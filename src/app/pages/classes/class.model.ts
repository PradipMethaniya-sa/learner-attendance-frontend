export interface SchoolClass {
  id: string;
  name: string;
  classId: string | null;
  parentClassName: string | null;
  schoolId: string;
  schoolName: string;
  hasChildren: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ClassFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
  includeParent?: boolean;
}

export interface ClassPagination {
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface ClassCreateRequest {
  name: string;
  classId: string | null;
}

export interface ClassUpdateRequest {
  name: string;
  classId: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface ClassListResponse {
  schoolClasses: SchoolClass[];
  pagination: ClassPagination;
}
