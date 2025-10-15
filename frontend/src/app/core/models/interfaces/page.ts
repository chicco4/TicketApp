export interface SortInfo {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: PageableInfo;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number; // current page index
  sort: SortInfo;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
