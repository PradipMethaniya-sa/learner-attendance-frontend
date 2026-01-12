import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Guardian,
  GuardianFilters,
  GuardianCreateRequest,
  GuardianUpdateRequest,
  ApiResponse,
  GuardianListResponse
} from './guardian.model';
import { FileUploadService, FileUploadProgress } from '../../shared/services/file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5051';

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService
  ) {}

  getGuardians(filters: GuardianFilters = {}): Observable<ApiResponse<GuardianListResponse>> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
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

    return this.http.get<ApiResponse<GuardianListResponse>>(`${this.apiUrl}/guardians`, { params });
  }

  getGuardianById(id: string): Observable<ApiResponse<Guardian>> {
    return this.http.get<ApiResponse<Guardian>>(`${this.apiUrl}/guardians/${id}`);
  }

  createGuardian(guardian: GuardianCreateRequest): Observable<ApiResponse<Guardian>> {
    return this.http.post<ApiResponse<Guardian>>(`${this.apiUrl}/guardians`, guardian);
  }

  updateGuardian(id: string, guardian: GuardianUpdateRequest): Observable<ApiResponse<Guardian>> {
    return this.http.put<ApiResponse<Guardian>>(`${this.apiUrl}/guardians/${id}`, guardian);
  }

  deleteGuardian(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/guardians/${id}`);
  }

  // Image upload methods
  createGuardianWithImages(
    guardian: GuardianCreateRequest,
    imageFile: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<Guardian>> {
    const filesObject = { image: imageFile };
    return this.fileUploadService.uploadWithJson<Guardian>(
      '/guardians',
      guardian,
      filesObject,
      onProgress
    );
  }

  updateGuardianWithImages(
    id: string,
    guardian: GuardianUpdateRequest,
    imageFile: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<Guardian>> {
    const filesObject = { image: imageFile };
    return this.fileUploadService.updateWithJson<Guardian>(
      `/guardians/${id}`,
      guardian,
      filesObject,
      onProgress
    );
  }
}
