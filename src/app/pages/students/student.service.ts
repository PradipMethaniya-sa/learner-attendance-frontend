import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Student,
  StudentFilters,
  StudentCreateRequest,
  StudentUpdateRequest,
  StudentCreateWithFilesRequest,
  StudentUpdateWithFilesRequest,
  ApiResponse,
  StudentListResponse,
  OrphanCategory,
  SchoolClass,
  ClassFilters,
  ClassListResponse
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

  createStudent(student: StudentCreateRequest): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(`${this.apiUrl}/students`, student);
  }

  updateStudent(id: string, student: StudentUpdateRequest): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/students/${id}`, student);
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
    imageFile: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<Student>> {
    // Single image upload as per API requirement
    const filesObject: { [key: string]: File } = {
      'image': imageFile
    };

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
    imageFile: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<Student>> {
    // Single image upload as per API requirement
    const filesObject: { [key: string]: File } = {
      'image': imageFile
    };

    return this.fileUploadService.updateWithJson<Student>(
      `/students/${id}`,
      student,
      filesObject,
      onProgress
    );
  }

  /**
   * Validate student image file
   * @param file File to validate
   * @returns Validation result
   */
  validateStudentImage(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return this.fileUploadService.validateFile(file, allowedTypes, 5); // 5MB limit
  }

  /**
   * Check if student can add image (for edit mode)
   * @param currentImageCount Current number of images
   * @returns Validation result
   */
  validateImageAddition(currentImageCount: number): { isValid: boolean; error?: string } {
    if (currentImageCount >= 5) {
      return {
        isValid: false,
        error: `Maximum 5 images allowed. Student already has ${currentImageCount} images.`
      };
    }
    return { isValid: true };
  }
}
