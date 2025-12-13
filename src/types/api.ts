// API response types

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SnapshotsQueryParams extends PaginationParams {
  imei: string;
}
