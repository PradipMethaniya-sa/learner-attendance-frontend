import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SchoolClass,
  ClassFilters,
  ClassCreateRequest,
  ClassUpdateRequest,
  ApiResponse,
  ClassListResponse
} from './class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  private getSchoolId(): string {
    const schoolId = localStorage.getItem('school_id');
    if (!schoolId) {
      throw new Error('School ID not found in localStorage. Please ensure you are logged in to a school.');
    }
    return schoolId;
  }

  getClasses(filters: ClassFilters = {}): Observable<ApiResponse<ClassListResponse>> {
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
    if (filters.includeParent !== undefined) {
      params = params.set('includeParent', filters.includeParent.toString());
    }

    return this.http.get<ApiResponse<ClassListResponse>>(`${this.apiUrl}/school-classes`, { params });
  }

  getClassById(id: string): Observable<ApiResponse<SchoolClass>> {
    return this.http.get<ApiResponse<SchoolClass>>(`${this.apiUrl}/school-classes/${id}`);
  }

  createClass(classData: ClassCreateRequest): Observable<ApiResponse<SchoolClass>> {
    const schoolId = this.getSchoolId();
    const payload = {
      ...classData,
      schoolId
    };
    return this.http.post<ApiResponse<SchoolClass>>(`${this.apiUrl}/school-classes`, payload);
  }

  updateClass(id: string, classData: ClassUpdateRequest): Observable<ApiResponse<SchoolClass>> {
    const schoolId = this.getSchoolId();
    const payload = {
      ...classData,
      schoolId
    };
    return this.http.put<ApiResponse<SchoolClass>>(`${this.apiUrl}/school-classes/${id}`, payload);
  }

  deleteClass(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/school-classes/${id}`);
  }
}
