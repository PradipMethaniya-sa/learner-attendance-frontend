export interface Student {
  id: string;
  studentUid: string;
  generalUserId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  hasSpecialNeeds: boolean;
  orphanCategory: 'NONE' | 'SINGLE_ORPHAN' | 'DOUBLE_ORPHAN';
  avatarUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  guardians: any[];
  addressLine1: string;
  addressLine2: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  nationality: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface StudentPagination {
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

export interface StudentCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  hasSpecialNeeds: boolean;
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  orphanCategory: 'NONE' | 'SINGLE_ORPHAN' | 'DOUBLE_ORPHAN';
  nationality: string;
}

export interface StudentUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  hasSpecialNeeds: boolean;
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  orphanCategory: 'NONE' | 'SINGLE_ORPHAN' | 'DOUBLE_ORPHAN';
  nationality: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface StudentListResponse {
  students: Student[];
  pagination: StudentPagination;
}

export interface OrphanCategory {
  value: string;
  label: string;
}
