export const keyExtractorById = <T extends { id: string }>(item: T): string =>
  item.id.toString();

export const KEY_EXTRACTORS = {
  byId: keyExtractorById,
} as const;
