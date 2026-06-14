/**
 * response.ts — shared API response shapes.
 *
 * Every backend response is wrapped in ApiResponse<T>.
 * List endpoints return Paginated<T> inside the `data` field.
 * Errors are normalised into ApiError before being thrown.
 */

// ─── Success wrappers ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Error shape ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
