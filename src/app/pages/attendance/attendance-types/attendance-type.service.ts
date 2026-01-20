import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AttendanceType,
  AttendanceTypeFilters,
  AttendanceTypeCreateRequest,
  AttendanceTypeUpdateRequest,
  ApiResponse,
  AttendanceTypeListResponse
} from './attendance-type.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceTypeService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(
    private http: HttpClient
  ) {}

  getAttendanceTypes(filters: AttendanceTypeFilters = {}): Observable<ApiResponse<AttendanceTypeListResponse>> {
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

    return this.http.get<ApiResponse<AttendanceTypeListResponse>>(`${this.apiUrl}/attendance-types`, { params });
  }

  getAttendanceTypeById(id: string): Observable<ApiResponse<AttendanceType>> {
    return this.http.get<ApiResponse<AttendanceType>>(`${this.apiUrl}/attendance-types/${id}`);
  }

  createAttendanceType(attendanceType: AttendanceTypeCreateRequest): Observable<ApiResponse<AttendanceType>> {
    return this.http.post<ApiResponse<AttendanceType>>(`${this.apiUrl}/attendance-types`, attendanceType);
  }

  updateAttendanceType(id: string, attendanceType: AttendanceTypeUpdateRequest): Observable<ApiResponse<AttendanceType>> {
    return this.http.put<ApiResponse<AttendanceType>>(`${this.apiUrl}/attendance-types/${id}`, attendanceType);
  }

  deleteAttendanceType(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/attendance-types/${id}`);
  }
}
