import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FILE_UPLOAD_CONSTANTS } from '../constants/constants';

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) { }
  uploadWithJson<T = any>(
    endpoint: string,
    data: any,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {

    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    return this.http.post<FileUploadResponse<T>>(`${this.apiUrl}${endpoint}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && onProgress && event.total) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round(100 * event.loaded / event.total)
          });
        }
        return event;
      }),
      filter(event => event.type === HttpEventType.Response),
      map((event: any) => event.body)
    );
  }
  updateWithJson<T = any>(
    endpoint: string,
    data: any,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {

    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    return this.http.put<FileUploadResponse<T>>(`${this.apiUrl}${endpoint}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && onProgress && event.total) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round(100 * event.loaded / event.total)
          });
        }
        return event;
      }),

      filter(event => event.type === HttpEventType.Response),
      map((event: any) => event.body)
    );
  }
  validateFile(file: File, allowedTypes: string[], maxSizeInMB: number): ValidationResult {
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: FILE_UPLOAD_CONSTANTS.ERROR_MESSAGES.INVALID_TYPE
      };
    }

    const maxSizeBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: FILE_UPLOAD_CONSTANTS.ERROR_MESSAGES.FILE_TOO_LARGE(maxSizeInMB)
      };
    }

    return { isValid: true };
  }

  validateImageFile(file: File): ValidationResult {
    return this.validateFile(
      file,
      [...FILE_UPLOAD_CONSTANTS.IMAGE_ALLOWED_TYPES],
      FILE_UPLOAD_CONSTANTS.MAX_IMAGE_SIZE_MB
    );
  }

  validateImageLimit(currentCount: number): ValidationResult {
    if (currentCount >= FILE_UPLOAD_CONSTANTS.MAX_IMAGES_PER_ENTITY) {
      return {
        isValid: false,
        error: FILE_UPLOAD_CONSTANTS.ERROR_MESSAGES.MAX_IMAGES_REACHED(FILE_UPLOAD_CONSTANTS.MAX_IMAGES_PER_ENTITY)
      };
    }
    return { isValid: true };
  }

  getImagePreviewUrl(file: File): string {
    if (file && file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '';
  }

  revokePreviewUrl(url: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}
