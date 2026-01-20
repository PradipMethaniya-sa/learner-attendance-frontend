export interface AttendanceType {
  id: string;
  name: string;
  description: string;
  lateArrivalThreshold: string;
  earlyArrivalThreshold: string;
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AttendanceTypeFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface AttendanceTypePagination {
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

export interface AttendanceTypeCreateRequest {
  name: string;
  description: string;
  lateArrivalThreshold: string;
  earlyArrivalThreshold: string;
  isActive: boolean;
}

export interface AttendanceTypeUpdateRequest {
  name: string;
  description: string;
  lateArrivalThreshold: string;
  earlyArrivalThreshold: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface AttendanceTypeListResponse {
  attendanceTypes: AttendanceType[];
  pagination: AttendanceTypePagination;
}
