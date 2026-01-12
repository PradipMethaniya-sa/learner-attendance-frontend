import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly apiUrl = environment.API_URL || 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  /**
   * Upload file(s) with JSON data using multipart/form-data
   * @param endpoint API endpoint
   * @param data JSON data to send
   * @param files Files to upload (key-value pairs where key is the field name)
   * @param onProgress Optional progress callback
   * @returns Observable with upload response
   */
  uploadWithJson<T = any>(
    endpoint: string,
    data: any,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {
    const formData = new FormData();
    
    // Add JSON data as blob with proper Content-Type to match Postman format
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
   * Update with file(s) and JSON data using multipart/form-data (PUT)
   * @param endpoint API endpoint
   * @param data JSON data to send
   * @param files Files to upload (key-value pairs where key is the field name)
   * @param onProgress Optional progress callback
   * @returns Observable with upload response
   */
  updateWithJson<T = any>(
    endpoint: string,
    data: any,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {
    const formData = new FormData();
    
    // Add JSON data as blob with proper Content-Type to match Postman format
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
   * Upload only files without JSON data
   * @param endpoint API endpoint
   * @param files Files to upload (key-value pairs where key is the field name)
   * @param onProgress Optional progress callback
   * @returns Observable with upload response
   */
  uploadFiles<T = any>(
    endpoint: string,
    files: { [key: string]: File },
    onProgress?: (progress: FileUploadProgress) => void
  ): Observable<FileUploadResponse<T>> {
    const formData = new FormData();
    
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
   * Validate file type and size
   * @param file File to validate
   * @param allowedTypes Array of allowed MIME types
   * @param maxSizeInMB Maximum file size in MB
   * @returns Validation result
   */
  validateFile(file: File, allowedTypes: string[], maxSizeInMB: number = 5): { isValid: boolean; error?: string } {
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeInMB}MB limit`
      };
    }

    return { isValid: true };
  }

  /**
   * Get file preview URL for images
   * @param file File object
   * @returns Preview URL string
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
