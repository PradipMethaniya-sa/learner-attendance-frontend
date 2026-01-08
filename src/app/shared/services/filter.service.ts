import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../pages/guardians/guardian.model';

export interface FilterItem {
  id: string;
  name: string;
}

export interface FilterResponse {
  districts: FilterItem[];
  counties: FilterItem[];
  subCounties: FilterItem[];
  parishes: FilterItem[];
}

export interface FilterParams {
  type?: 'district' | 'county' | 'subCounty' | 'parish';
  districtId?: string;
  countyId?: string;
  subCountyId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  getFilters(params: FilterParams = {}): Observable<ApiResponse<FilterItem[]>> {
    let httpParams = new HttpParams();

    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    if (params.districtId) {
      httpParams = httpParams.set('districtId', params.districtId);
    }
    if (params.countyId) {
      httpParams = httpParams.set('countyId', params.countyId);
    }
    if (params.subCountyId) {
      httpParams = httpParams.set('subCountyId', params.subCountyId);
    }
    
    return this.http.get<ApiResponse<FilterItem[]>>(`${this.apiUrl}/filters`, { 
      params: httpParams
    });
  }

  getDistricts(): Observable<ApiResponse<FilterItem[]>> {
    return this.getFilters({ type: 'district' });
  }

  getCounties(districtId: string): Observable<ApiResponse<FilterItem[]>> {
    return this.getFilters({ type: 'county', districtId });
  }

  getSubCounties(districtId: string, countyId: string): Observable<ApiResponse<FilterItem[]>> {
    return this.getFilters({ type: 'subCounty', districtId, countyId });
  }

  getParishes(districtId: string, countyId: string, subCountyId: string): Observable<ApiResponse<FilterItem[]>> {
    return this.getFilters({ type: 'parish', districtId, countyId, subCountyId });
  }
}
