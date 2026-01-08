import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Student,
  StudentFilters,
  StudentCreateRequest,
  StudentUpdateRequest,
  ApiResponse,
  StudentListResponse,
  OrphanCategory
} from './student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) {}

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
}
