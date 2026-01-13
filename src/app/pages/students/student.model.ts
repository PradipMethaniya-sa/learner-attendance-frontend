export interface StudentImage {
  id: string;
  imageUrl: string;
  thumbUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  studentUid: string;
  generalUserId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
  countryCode: string;
  mobileNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  hasSpecialNeeds: boolean;
  orphanCategory: 'NONE' | 'SINGLE_ORPHAN' | 'DOUBLE_ORPHAN';
  avatarUrl: string | null;
  images: StudentImage[];
  status: 'ACTIVE' | 'INACTIVE';
  guardians: Guardian[];
  addressLine1: string;
  addressLine2: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
  parishId: string;
  parishName?: string;
  subCountyName?: string;
  countyName?: string;
  districtName?: string;
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
export interface StudentCreateWithFilesRequest {
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
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
export interface StudentUpdateWithFilesRequest {
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
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
  keepImageIds?: string[];
}

// Class interfaces for dropdown
export interface SchoolClass {
  id: string;
  name: string;
  classId?: string;
  parentClassName?: string;
  schoolId: string;
  schoolName: string;
  hasChildren: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
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

export interface ClassListResponse {
  schoolClasses: SchoolClass[];
  pagination: ClassPagination;
}

export interface ClassFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
  includeParent?: boolean;
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
  displayName: string;
}
export interface Guardian {
  assignmentId: string;
  guardianId: string;
  guardianUid: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  avatarUrl: string | null;
  relation: string;
  isPrimary: boolean;
}

export interface GuardianDetails {
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
  addressLine2: string | null;
  parishId: string;
  parishName: string;
  subCountyId: string;
  subCountyName: string;
  countyId: string;
  countyName: string;
  districtId: string;
  districtName: string;
  nationality: string;
  avatarUrl: string;
  avatarThumbUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface GuardianRelation {
  displayName: string;
  value: string;
}

export interface GuardianListResponse {
  guardians: GuardianDetails[];
  pagination: any;
}

export interface GuardianAssignRequest {
  studentId: string;
  data: GuardianAssignment[];
  removeAssignIds: string[];
}

export interface GuardianAssignment {
  guardianId: string;
  relation: string;
  isPrimary: boolean;
}

export interface GuardianAssignResponse {
  assigned: any[];
  unassigned: any[];
  message: string;
}
