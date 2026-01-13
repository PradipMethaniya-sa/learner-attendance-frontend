import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Student,
  StudentFilters,
  StudentCreateWithFilesRequest,
  StudentUpdateWithFilesRequest,
  ApiResponse,
  StudentListResponse,
  OrphanCategory,
  SchoolClass,
  ClassFilters,
  ClassListResponse,
  GuardianDetails,
  GuardianRelation,
  GuardianListResponse,
  GuardianAssignRequest,
  GuardianAssignResponse
} from './student.model';
import { FileUploadService, FileUploadProgress } from '../../shared/services/file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService
  ) {}

  getStudents(filters: StudentFilters = {}): Observable<ApiResponse<StudentListResponse>> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.gender) {
      params = params.set('gender', filters.gender);
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.orderBy) {
      params = params.set('orderBy', filters.orderBy);
    }

    return this.http.get<ApiResponse<StudentListResponse>>(`${this.apiUrl}/students`, { params });
  }

  getStudentById(id: string): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/students/${id}`);
  }
  deleteStudent(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/students/${id}`);
  }

  getOrphanCategories(): Observable<ApiResponse<OrphanCategory[]>> {
    return this.http.get<ApiResponse<OrphanCategory[]>>(`${this.apiUrl}/students/orphan-categories`);
  }

  getClasses(filters: ClassFilters = {}): Observable<ApiResponse<ClassListResponse>> {
    let params = new HttpParams();

    // Set default values as per your curl
    params = params.set('page', (filters.page || 1).toString());
    params = params.set('limit', (filters.limit || 100).toString());
    params = params.set('sortBy', filters.sortBy || 'name');
    params = params.set('orderBy', filters.orderBy || 'asc');
    params = params.set('includeParent', (filters.includeParent !== false).toString());

    // Optional filters
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<ApiResponse<ClassListResponse>>(`${this.apiUrl}/school-classes`, { params });
  }

  // File upload methods
  createStudentWithImages(
    student: StudentCreateWithFilesRequest,
    imageFile: File | undefined,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<Student>> {
    // Always use multipart form data
    const filesObject: { [key: string]: File } = {};
    
    // Add image if provided
    if (imageFile) {
      filesObject['image'] = imageFile;
    }

    return this.fileUploadService.uploadWithJson<Student>(
      '/students',
      student,
      filesObject,
      onProgress
    );
  }

  updateStudentWithImages(
    id: string,
    student: StudentUpdateWithFilesRequest,
    imageFile: File | undefined,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<Student>> {
    // Always use multipart form data
    const filesObject: { [key: string]: File } = {};
    
    // Add image if provided
    if (imageFile) {
      filesObject['image'] = imageFile;
    }

    return this.fileUploadService.updateWithJson<Student>(
      `/students/${id}`,
      student,
      filesObject,
      onProgress
    );
  }

  // Guardian API methods
  getGuardians(isSkipPagination: boolean = true): Observable<ApiResponse<GuardianListResponse>> {
    let params = new HttpParams();
    if (isSkipPagination) {
      params = params.set('isSkipPagination', 'true');
    }
    return this.http.get<ApiResponse<GuardianListResponse>>(`${this.apiUrl}/guardians`, { params });
  }

  getGuardianRelations(): Observable<ApiResponse<GuardianRelation[]>> {
    return this.http.get<ApiResponse<GuardianRelation[]>>(`${this.apiUrl}/guardians/relations`);
  }

  bulkAssignUnassignGuardians(request: GuardianAssignRequest): Observable<ApiResponse<GuardianAssignResponse>> {
    return this.http.post<ApiResponse<GuardianAssignResponse>>(`${this.apiUrl}/guardians/bulk-assign-unassign`, request);
  }
}
