export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  type: 'SCHOOL_STAFF';
  dob: string;
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId?: string;
  subCountyId?: string;
  parishId?: string;
  nationality: string;
  avatarUrl?: string;
  schoolId: string;
  schoolName: string;
  teacherRegNo?: string;
  createdAt: string | null;
  updatedAt: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StaffFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface StaffPagination {
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

export interface StaffCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId?: string;
  subCountyId?: string;
  parishId?: string;
  nationality: string;
  teacherRegNo?: string;
}

export interface StaffUpdateRequest {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  nationalId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  addressLine1: string;
  addressLine2?: string;
  districtId: string;
  countyId?: string;
  subCountyId?: string;
  parishId?: string;
  nationality: string;
  teacherRegNo?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface StaffListResponse {
  schoolStaffs: Staff[];
  pagination: StaffPagination;
}
