import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {}

  /**
   * Upload file(s) with JSON data using multipart/form-data
   */
  uploadWithJson<T = any>(
    endpoint: string,
    data: any,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {
    const formData = new FormData();
    
    // Add JSON data as blob with proper Content-Type
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    // Add files
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
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (onProgress && event.total) {
              const progress: FileUploadProgress = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round(100 * event.loaded / event.total)
              };
              onProgress(progress);
            }
            return null as any;
          case HttpEventType.Response:
            return event.body;
          default:
            return null as any;
        }
      })
    );
  }

  /**
   * Update file(s) with JSON data using multipart/form-data
   */
  updateWithJson<T = any>(
    endpoint: string,
    data: any,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {
    const formData = new FormData();
    
    // Add JSON data as blob with proper Content-Type
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('data', jsonBlob);
    
    // Add files
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
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (onProgress && event.total) {
              const progress: FileUploadProgress = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round(100 * event.loaded / event.total)
              };
              onProgress(progress);
            }
            return null as any;
          case HttpEventType.Response:
            return event.body;
          default:
            return null as any;
        }
      })
    );
  }

  /**
   * Generic file validation method
   */
  validateFile(file: File, allowedTypes: string[], maxSizeInMB: number): ValidationResult {
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: FILE_UPLOAD_CONSTANTS.ERROR_MESSAGES.INVALID_TYPE
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: FILE_UPLOAD_CONSTANTS.ERROR_MESSAGES.FILE_TOO_LARGE(maxSizeInMB)
      };
    }

    return { isValid: true };
  }

  /**
   * Validate image file using constants
   */
  validateImageFile(file: File): ValidationResult {
    return this.validateFile(
      file,
      [...FILE_UPLOAD_CONSTANTS.IMAGE_ALLOWED_TYPES],
      FILE_UPLOAD_CONSTANTS.MAX_IMAGE_SIZE_MB
    );
  }

  /**
   * Validate image limit for entities
   */
  validateImageLimit(currentCount: number): ValidationResult {
    if (currentCount >= FILE_UPLOAD_CONSTANTS.MAX_IMAGES_PER_ENTITY) {
      return {
        isValid: false,
        error: FILE_UPLOAD_CONSTANTS.ERROR_MESSAGES.MAX_IMAGES_REACHED(FILE_UPLOAD_CONSTANTS.MAX_IMAGES_PER_ENTITY)
      };
    }
    return { isValid: true };
  }

  /**
   * Get file preview URL for images
   */
  getImagePreviewUrl(file: File): string {
    if (file && file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '';
  }

  /**
   * Clean up object URL to prevent memory leaks
   * @param url URL to revoke
   */
  revokePreviewUrl(url: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}
