import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Staff,
  StaffFilters,
  StaffCreateRequest,
  StaffUpdateRequest,
  ApiResponse,
  StaffListResponse
} from './staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  getStaffs(filters: StaffFilters = {}): Observable<ApiResponse<StaffListResponse>> {
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

    return this.http.get<ApiResponse<StaffListResponse>>(`${this.apiUrl}/school-staffs`, { params });
  }

  getStaffById(id: string): Observable<ApiResponse<Staff>> {
    return this.http.get<ApiResponse<Staff>>(`${this.apiUrl}/school-staffs/${id}`);
  }

  createStaff(staff: StaffCreateRequest): Observable<ApiResponse<Staff>> {
    return this.http.post<ApiResponse<Staff>>(`${this.apiUrl}/school-staffs`, staff);
  }

  updateStaff(id: string, staff: StaffUpdateRequest): Observable<ApiResponse<Staff>> {
    return this.http.put<ApiResponse<Staff>>(`${this.apiUrl}/school-staffs/${id}`, staff);
  }

  deleteStaff(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/school-staffs/${id}`);
  }
}
