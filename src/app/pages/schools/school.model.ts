export interface School {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  mobileNo: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  parishId: string;
  parishName: string;
  districtId: string;
  districtName: string;
  countyId: string;
  countyName: string;
  subCountyId: string;
  subCountyName: string;
  logoUrl: string;
  registrationNo: string;
  registrationDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string;
}

export interface SchoolFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface SchoolPagination {
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

export interface SchoolCreateRequest {
  name: string;
  email: string;
  countryCode: string;
  mobileNo: string;
  website?: string;
  addressLine1: string;
  addressLine2?: string;
  parishId: string;
  logoUrl?: string;
  registrationNo: string;
}

export interface SchoolUpdateRequest {
  name: string;
  email: string;
  countryCode: string;
  mobileNo: string;
  website?: string;
  addressLine1: string;
  addressLine2?: string;
  parishId: string;
  logoUrl?: string;
  registrationNo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface SchoolListResponse {
  schools: School[];
  pagination: SchoolPagination;
}
