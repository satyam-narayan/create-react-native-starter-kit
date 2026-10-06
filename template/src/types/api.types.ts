export interface ApiResponse<T> {
  result: boolean;
  requestId: string;
  message: string;
  messageLBL: string;
  payload: T;
}

export interface MetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedPayload<T> {
  data: T[];
  meta: PaginationMeta;
}

export type ApiSuccess<T> = {
  data: T;
  message?: string;
};
