import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  School,
  SchoolFilters,
  SchoolCreateRequest,
  SchoolUpdateRequest,
  SchoolCreateWithFileRequest,
  SchoolUpdateWithFileRequest,
  ApiResponse,
  SchoolListResponse
} from './school.model';
import { FilterService, FilterItem } from '../../shared/services/filter.service';
import { FileUploadService, FileUploadProgress } from '../../shared/services/file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(
    private http: HttpClient,
    private fileUploadService: FileUploadService
  ) {}

  getSchools(filters: SchoolFilters = {}): Observable<ApiResponse<SchoolListResponse>> {
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

    return this.http.get<ApiResponse<SchoolListResponse>>(`${this.apiUrl}/schools`, { params });
  }

  getSchoolById(id: string): Observable<ApiResponse<School>> {
    return this.http.get<ApiResponse<School>>(`${this.apiUrl}/schools/${id}`);
  }

  createSchool(school: SchoolCreateRequest): Observable<ApiResponse<School>> {
    return this.http.post<ApiResponse<School>>(`${this.apiUrl}/schools`, school);
  }

  updateSchool(id: string, school: SchoolUpdateRequest): Observable<ApiResponse<School>> {
    return this.http.put<ApiResponse<School>>(`${this.apiUrl}/schools/${id}`, school);
  }

  activateSchool(id: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/schools/${id}/activate`, {});
  }

  deactivateSchool(id: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/schools/${id}/deactivate`, {});
  }

  deleteSchool(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/schools/${id}`);
  }

  // Enhanced filter methods
  getSchoolsByLocation(districtId?: string, countyId?: string, subCountyId?: string, parishId?: string): Observable<ApiResponse<SchoolListResponse>> {
    let params = new HttpParams();
    
    if (districtId) {
      params = params.set('districtId', districtId);
    }
    if (countyId) {
      params = params.set('countyId', countyId);
    }
    if (subCountyId) {
      params = params.set('subCountyId', subCountyId);
    }
    if (parishId) {
      params = params.set('parishId', parishId);
    }

    return this.http.get<ApiResponse<SchoolListResponse>>(`${this.apiUrl}/schools`, { params });
  }

  // File upload methods
  createSchoolWithLogo(
    school: SchoolCreateWithFileRequest,
    logoFile: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<School>> {
    return this.fileUploadService.uploadWithJson<School>(
      '/schools',
      school,
      { logo: logoFile },
      onProgress
    );
  }

  updateSchoolWithLogo(
    id: string,
    school: SchoolUpdateWithFileRequest,
    logoFile: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<ApiResponse<School>> {
    return this.fileUploadService.updateWithJson<School>(
      `/schools/${id}`,
      school,
      { logo: logoFile },
      onProgress
    );
  }
}
