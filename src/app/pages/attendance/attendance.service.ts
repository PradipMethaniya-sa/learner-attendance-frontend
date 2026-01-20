import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentUid: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  avatarThumbUrl?: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
  attendanceTime: string;
  attendanceDate: string;
  overrideReason?: string;
  overriddenAt?: string;
  isOverridden: boolean;
  markedAt: string;
  remark?: string;
}

export interface AttendanceUpdateRequest {
  attendanceId: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
  attendanceTime: string;
  remark?: string;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: {
    attendances: StudentAttendance[];
    pagination: {
      page: number;
      limit: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
      first: boolean;
      last: boolean;
      numberOfElements: number;
    };
  };
  timestamp: string;
  traceId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  getStudentAttendance(classId: string, date: string): Observable<AttendanceResponse> {
    const params = new HttpParams()
      .set('classId', classId)
      .set('date', date);

    return this.http.get<AttendanceResponse>(`${this.apiUrl}/attendance/students`, { params });
  }

  updateStudentAttendance(updates: AttendanceUpdateRequest[]): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/attendance/students`, updates);
  }

  getClasses(filters: any = {}): Observable<ApiResponse<any>> {
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
      return this.http.get<ApiResponse<any>>(`${this.apiUrl}/school-classes`, { params });
    }
}
