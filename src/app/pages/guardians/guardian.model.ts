export interface Guardian {
  id: string;
  guardianUid: string;
  generalUserInfoId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string | null;
  addressLine1: string;
  addressLine2: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  nationality: string;
  avatarUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string | null;
  updatedAt: string | null;
}

export interface GuardianFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface GuardianPagination {
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

export interface GuardianCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  nationality: string;
}

export interface GuardianUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  nationality: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface GuardianListResponse {
  guardians: Guardian[];
  pagination: GuardianPagination;
}
