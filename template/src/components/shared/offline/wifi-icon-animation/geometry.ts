/** All geometry is in a 100×100 viewBox and scaled to the rendered size. */
export const VIEWBOX = 100;
export const SHADOW_OFFSET = 2.5;

const CX = 50;
const CY = 80;
const SPAN = 45;
const BOX_PADDING = 1;

type Point = [number, number];
type Edge = [number, number];
export type Box = { x: number; y: number; w: number; h: number };

export type PieceDef = {
  d: string;
  box: Box;
  origin: Point;
  dx: number;
  dy: number;
  rot: number;
  /** Shiver amount, signed so neighbours move in opposite directions. */
  strength: number;
  isShard?: boolean;
};

const polar = (r: number, deg: number): Point => {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)];
};

const arcPoints = (r: number, from: number, to: number): Point[] => {
  const steps = Math.max(2, Math.ceil(Math.abs(to - from) / 5));
  return Array.from({ length: steps + 1 }, (_, i) =>
    polar(r, from + ((to - from) * i) / steps),
  );
};

/** Tight bounds (plus shadow) so each piece rasterises only its own area, not the full canvas. */
const boundsOf = (points: Point[]): Box => {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const x = Math.min(...xs) - BOX_PADDING;
  const y = Math.min(...ys) - BOX_PADDING;
  return {
    x,
    y,
    w: Math.max(...xs) + BOX_PADDING - x,
    h: Math.max(...ys) + BOX_PADDING + SHADOW_OFFSET - y,
  };
};

/** Thick arc segment; separate inner/outer angles give the cut edges a jagged slant. */
const band = (r1: number, r2: number, outer: Edge, inner: Edge) => {
  const [ox1, oy1] = polar(r2, outer[0]);
  const [ox2, oy2] = polar(r2, outer[1]);
  const [ix2, iy2] = polar(r1, inner[1]);
  const [ix1, iy1] = polar(r1, inner[0]);
  return {
    d: `M${ox1} ${oy1} A${r2} ${r2} 0 0 1 ${ox2} ${oy2} L${ix2} ${iy2} A${r1} ${r1} 0 0 0 ${ix1} ${iy1} Z`,
    box: boundsOf([
      ...arcPoints(r2, outer[0], outer[1]),
      ...arcPoints(r1, inner[0], inner[1]),
    ]),
  };
};

const shard = ([x, y]: Point, s: number) => {
  const points: Point[] = [
    [x, y - s],
    [x + s, y + s * 0.6],
    [x - s * 0.8, y + s * 0.4],
  ];
  return {
    d: `M${points[0][0]} ${points[0][1]} L${points[1][0]} ${points[1][1]} L${points[2][0]} ${points[2][1]} Z`,
    box: boundsOf(points),
  };
};

const BANDS: { r1: number; r2: number }[] = [
  { r1: 16, r2: 28 },
  { r1: 36, r2: 48 },
  { r1: 56, r2: 68 },
];

const CUT_ONE = { outer: -6, inner: 2 };
const CUT_TWO = { outer: 22, inner: 14 };

type RawPiece = Omit<PieceDef, 'strength'>;

const RAW_PIECES: RawPiece[] = [
  {
    d: `M${CX - 8} ${CY} a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0`,
    box: boundsOf([
      [CX - 8, CY - 8],
      [CX + 8, CY + 8],
    ]),
    origin: [CX, CY],
    dx: 0,
    dy: 2,
    rot: 0,
  },
  ...BANDS.flatMap(({ r1, r2 }, index): RawPiece[] => {
    const midR = (r1 + r2) / 2;
    const reach = index + 1;
    return [
      {
        ...band(r1, r2, [-SPAN, CUT_ONE.outer], [-SPAN, CUT_ONE.inner]),
        origin: polar(midR, -25),
        dx: -1,
        dy: 1,
        rot: -3,
      },
      {
        ...band(
          r1,
          r2,
          [CUT_ONE.outer, CUT_TWO.outer],
          [CUT_ONE.inner, CUT_TWO.inner],
        ),
        origin: polar(midR, 8),
        dx: 1.5 + reach * 1.5,
        dy: -2 - reach * 1.5,
        rot: 6 + reach * 3,
      },
      {
        ...band(r1, r2, [CUT_TWO.outer, SPAN], [CUT_TWO.inner, SPAN]),
        origin: polar(midR, 33),
        dx: 4 + reach * 2.5,
        dy: -1 - reach * 2.5,
        rot: 12 + reach * 5,
      },
    ];
  }),
  ...(
    [
      [[58, 18], 3.5, 8, -16, 120],
      [[74, 24], 3, 16, -10, -140],
      [[66, 38], 3.5, 14, -6, 160],
      [[55, 44], 2.5, 6, -14, -100],
      [[64, 56], 3, 12, -4, 110],
      [[80, 12], 2.5, 14, -16, 180],
      [[52, 28], 2.5, 4, -18, -160],
    ] as [Point, number, number, number, number][]
  ).map(
    ([origin, s, dx, dy, rot]): RawPiece => ({
      ...shard(origin, s),
      origin,
      dx,
      dy,
      rot,
      isShard: true,
    }),
  ),
];

// Pieces that flew further shiver more; the anchored left halves barely move.
export const PIECES: PieceDef[] = RAW_PIECES.map((piece, index) => ({
  ...piece,
  strength:
    Math.min(1, Math.hypot(piece.dx, piece.dy) / 10) * (index % 2 ? -1 : 1),
}));

export const SOLID_PIECES = PIECES.filter(piece => !piece.isShard);
