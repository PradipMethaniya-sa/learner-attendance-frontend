# File Upload Service Usage Guide

This guide demonstrates how to use the reusable `FileUploadService` for handling multipart/form-data requests in your Angular application.

## Features

- Upload files with JSON data using multipart/form-data
- Progress tracking for uploads
- File validation (type and size)
- Image preview generation
- Memory leak prevention with URL cleanup
- Support for POST, PUT, and file-only uploads

## Basic Usage

### 1. Import the Service

```typescript
import { FileUploadService, FileUploadProgress } from '../../../shared/services/file-upload.service';
```

### 2. Inject in Constructor

```typescript
constructor(
  private fileUploadService: FileUploadService
) {}
```

### 3. Upload File with JSON Data

```typescript
uploadDocument(data: any, file: File): Observable<any> {
  const onProgress = (progress: FileUploadProgress) => {
    console.log(`Upload progress: ${progress.percentage}%`);
  };

  return this.fileUploadService.uploadWithJson(
    '/api/endpoint',
    data,
    { document: file },
    onProgress
  );
}
```

## School API Integration Example

### Service Method

```typescript
import { FileUploadService, FileUploadProgress } from '../../shared/services/file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  constructor(
    private fileUploadService: FileUploadService
  ) {}

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
}
```

### Component Usage

```typescript
export class SchoolFormComponent {
  selectedLogoFile: File | null = null;
  uploadProgress: number | null = null;

  onLogoFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.selectedLogoFile) {
      const onProgress = (progress: FileUploadProgress) => {
        this.uploadProgress = progress.percentage;
      };

      this.schoolService.createSchoolWithLogo(
        schoolData,
        this.selectedLogoFile,
        onProgress
      ).subscribe({
        next: (response) => {
          console.log('School created successfully:', response);
        },
        error: (error) => {
          console.error('Upload failed:', error);
        }
      });
    }
  }
}
```

## Available Methods

### `uploadWithJson<T>()`
Upload file(s) with JSON data using POST request.

```typescript
uploadWithJson<T>(
  endpoint: string,
  data: any,
  files: { [key: string]: File },
  onProgress?: (progress: FileUploadProgress) => void
): Observable<FileUploadResponse<T>>
```

### `updateWithJson<T>()`
Update with file(s) and JSON data using PUT request.

```typescript
updateWithJson<T>(
  endpoint: string,
  data: any,
  files: { [key: string]: File },
  onProgress?: (progress: FileUploadProgress) => void
): Observable<FileUploadResponse<T>>
```

### `uploadFiles<T>()`
Upload only files without JSON data.

```typescript
uploadFiles<T>(
  endpoint: string,
  files: { [key: string]: File },
  onProgress?: (progress: FileUploadProgress) => void
): Observable<FileUploadResponse<T>>
```

### `validateFile()`
Validate file type and size.

```typescript
validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeInMB?: number
): { isValid: boolean; error?: string }
```

### `getImagePreviewUrl()`
Get preview URL for image files.

```typescript
getImagePreviewUrl(file: File): string
```

### `revokePreviewUrl()`
Clean up object URL to prevent memory leaks.

```typescript
revokePreviewUrl(url: string): void
```

## File Validation Example

```typescript
onFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Validate file
    const validation = this.fileUploadService.validateFile(
      file,
      ['image/jpeg', 'image/png', 'image/gif'],
      5 // 5MB limit
    );
    
    if (!validation.isValid) {
      this.toastr.error(validation.error);
      input.value = '';
      return;
    }
    
    // Process valid file
    this.selectedFile = file;
  }
}
```

## Progress Tracking

The service provides detailed progress information:

```typescript
interface FileUploadProgress {
  loaded: number;      // Bytes uploaded
  total: number;       // Total bytes
  percentage: number;  // Upload percentage (0-100)
}
```

## Multiple Files

You can upload multiple files in a single request:

```typescript
const files = {
  logo: logoFile,
  document: docFile,
  signature: signatureFile
};

this.fileUploadService.uploadWithJson(
  '/api/upload-multiple',
  data,
  files,
  onProgress
);
```

## Memory Management

Always clean up preview URLs to prevent memory leaks:

```typescript
ngOnDestroy(): void {
  if (this.previewUrl) {
    this.fileUploadService.revokePreviewUrl(this.previewUrl);
  }
}
```

## Error Handling

The service returns structured responses:

```typescript
interface FileUploadResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
  traceId: string;
}
```

Handle errors appropriately:

```typescript
this.fileUploadService.uploadWithJson(endpoint, data, files)
  .subscribe({
    next: (response) => {
      if (response.success) {
        // Handle success
      } else {
        // Handle API-level error
        console.error(response.message);
      }
    },
    error: (error) => {
      // Handle HTTP/network error
      console.error('Upload failed:', error);
    }
  });
```

## Best Practices

1. **Always validate files before upload**
2. **Show progress indication for large files**
3. **Clean up preview URLs in ngOnDestroy**
4. **Handle both success and error cases**
5. **Use appropriate file size limits**
6. **Provide user feedback for validation errors**

## Migration from Regular HTTP

Replace regular HTTP calls:

```typescript
// Before
return this.http.post('/api/schools', schoolData);

// After (with file)
return this.fileUploadService.uploadWithJson(
  '/api/schools',
  schoolData,
  { logo: logoFile }
);
```

This service provides a consistent, reusable way to handle file uploads across your entire application.
