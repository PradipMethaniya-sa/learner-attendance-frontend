import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { 
  Student, 
  StudentCreateRequest, 
  StudentUpdateRequest, 
  StudentCreateWithFilesRequest, 
  StudentUpdateWithFilesRequest, 
  OrphanCategory, 
  SchoolClass 
} from '../student.model';
import { FilterService, FilterItem } from '../../../shared/services/filter.service';
import { FileUploadService, FileUploadProgress } from '../../../shared/services/file-upload.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  studentForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  selectedStudent: Student | null = null;
  
  // Image upload properties
  selectedImageFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  uploadProgress: number | null = null;
  existingImageIds: string[] = [];
  readonly maxImages = 5;

  // Computed property for filtered existing images
  get remainingExistingImages(): any[] {
    if (!this.selectedStudent || !this.selectedStudent.images) {
      return [];
    }
    return this.selectedStudent.images.filter(img => this.existingImageIds.includes(img.id));
  }

  @Input() student: Student | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+256', name: 'Uganda' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' }
  ];

  genders = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  orphanCategories: OrphanCategory[] = [];
  classes: SchoolClass[] = [];
  districts: FilterItem[] = [];
  counties: FilterItem[] = [];
  subCounties: FilterItem[] = [];
  parishes: FilterItem[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private filterService: FilterService,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.studentForm = this.createStudentForm();
  }

  ngOnInit(): void {
    this.loadDistricts();
    this.loadOrphanCategories();
    this.loadClasses();
    if (this.student) {
      this.setEditMode(this.student);
    }
  }

  ngOnChanges(): void {
    // Only handle changes if component is initialized and districts are loaded
    if (this.districts.length > 0) {
      if (this.student) {
        this.setEditMode(this.student);
      } else {
        this.resetForm();
      }
    }
  }

  private createStudentForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      classId: ['', Validators.required],
      countryCode: ['+91', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: ['MALE', Validators.required],
      dob: ['', Validators.required],
      hasSpecialNeeds: [false],
      addressLine1: ['', [Validators.required, Validators.maxLength(500)]],
      addressLine2: ['', Validators.maxLength(500)],
      districtId: ['', Validators.required],
      countyId: ['', Validators.required],
      subCountyId: ['', Validators.required],
      parishId: ['', Validators.required],
      orphanCategory: ['NONE', Validators.required],
      nationality: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  loadDistricts(): void {
    this.filterService.getDistricts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.districts = response.data;
          }
        }
      });
  }

  loadOrphanCategories(): void {
    this.studentService.getOrphanCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.orphanCategories = response.data;
          }
        }
      });
  }

  loadClasses(): void {
    this.studentService.getClasses({ limit: 100, sortBy: 'name', orderBy: 'asc', includeParent: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.classes = response.data.schoolClasses;
          }
        },
        error: (error) => {
          this.toastr.error('Failed to load classes');
        }
      });
  }

  onDistrictChange(event: Event): void {
    const districtId = (event.target as HTMLSelectElement).value;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    this.studentForm.patchValue({ 
      countyId: '', 
      subCountyId: '', 
      parishId: '' 
    });

    if (districtId) {
      this.filterService.getCounties(districtId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.counties = response.data;
            }
          }
        });
    }
  }

  onCountyChange(event: Event): void {
    const districtId = this.studentForm.get('districtId')?.value;
    const countyId = (event.target as HTMLSelectElement).value;
    this.subCounties = [];
    this.parishes = [];
    this.studentForm.patchValue({ 
      subCountyId: '', 
      parishId: '' 
    });

    if (districtId && countyId) {
      this.filterService.getSubCounties(districtId, countyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.subCounties = response.data;
            }
          }
        });
    }
  }

  onSubCountyChange(event: Event): void {
    const districtId = this.studentForm.get('districtId')?.value;
    const countyId = this.studentForm.get('countyId')?.value;
    const subCountyId = (event.target as HTMLSelectElement).value;
    this.parishes = [];
    this.studentForm.patchValue({ parishId: '' });

    if (districtId && countyId && subCountyId) {
      this.filterService.getParishes(districtId, countyId, subCountyId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.parishes = response.data;
            }
          }
        });
    }
  }

  setEditMode(student: Student): void {
    this.isEditMode = true;
    this.selectedStudent = student;
    
    // Initialize existing image IDs
    this.existingImageIds = student.images?.map(img => img.id) || [];
    
    // Load location hierarchy for the student's location
    if (student.districtId) {
      this.loadLocationHierarchy(student.districtId, student.countyId, student.subCountyId, student.parishId);
    }
    
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      classId: student.classId,
      countryCode: student.countryCode,
      mobileNumber: student.mobileNumber,
      gender: student.gender,
      dob: student.dob,
      hasSpecialNeeds: student.hasSpecialNeeds,
      addressLine1: student.addressLine1,
      addressLine2: student.addressLine2,
      districtId: student.districtId,
      countyId: student.countyId,
      subCountyId: student.subCountyId,
      parishId: student.parishId,
      orphanCategory: student.orphanCategory,
      nationality: student.nationality
    });
  }

  private loadLocationHierarchy(districtId: string, countyId: string, subCountyId: string, parishId: string): void {
    // Load counties
    this.filterService.getCounties(districtId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.counties = response.data;
            
            // Load sub counties
            if (countyId) {
              this.filterService.getSubCounties(districtId, countyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (response) => {
                    if (response.success) {
                      this.subCounties = response.data;
                      
                      // Load parishes
                      if (subCountyId) {
                        this.filterService.getParishes(districtId, countyId, subCountyId)
                          .pipe(takeUntil(this.destroy$))
                          .subscribe({
                            next: (response) => {
                              if (response.success) {
                                this.parishes = response.data;
                              }
                            }
                          });
                      }
                    }
                  }
                });
            }
          }
        }
      });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedStudent = null;
    this.selectedImageFiles = [];
    this.imagePreviewUrls = [];
    this.uploadProgress = null;
    this.existingImageIds = [];
    this.studentForm.reset();
    this.resetLocationFields();
    // Reset form to default values
    this.studentForm.patchValue({
      countryCode: '+91',
      gender: 'MALE',
      hasSpecialNeeds: false,
      orphanCategory: 'NONE'
    });
  }

  private resetLocationFields(): void {
    this.districts = [];
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.studentForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.studentForm.value;

    if (this.isEditMode && this.selectedStudent) {
      const updateRequest: StudentUpdateWithFilesRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        classId: formData.classId,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        gender: formData.gender,
        dob: formData.dob,
        hasSpecialNeeds: formData.hasSpecialNeeds,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        districtId: formData.districtId,
        countyId: formData.countyId,
        subCountyId: formData.subCountyId,
        parishId: formData.parishId,
        orphanCategory: formData.orphanCategory,
        nationality: formData.nationality,
        keepImageIds: this.existingImageIds
      };

      // Use file upload if images are selected
      if (this.selectedImageFiles.length > 0) {
        // Validate image addition
        const currentImageCount = this.selectedStudent.images?.length || 0;
        const countValidation = this.fileUploadService.validateImageLimit(currentImageCount);
        
        if (!countValidation.isValid) {
          this.toastr.error(countValidation.error || 'Cannot add more images');
          this.isSubmitting = false;
          return;
        }

        // For now, we'll upload the first image (API limitation)
        // TODO: Update API to support multiple images
        const onProgress = (progress: FileUploadProgress) => {
          this.uploadProgress = progress.percentage;
        };

        this.studentService.updateStudentWithImages(
          this.selectedStudent.id,
          updateRequest,
          this.selectedImageFiles[0], // Upload first image
          onProgress
        ).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.uploadProgress = null;
            this.onFormSuccess(response.message);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.uploadProgress = null;
          }
        });
      } else {
        // Use regular update if no new image
        const regularUpdateRequest: StudentUpdateRequest = {
          ...updateRequest
        };

        this.studentService.updateStudent(this.selectedStudent.id, regularUpdateRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.onFormSuccess(response.message);
            },
            error: (error) => {
              this.isSubmitting = false;
            }
          });
      }
    } else {
      const createRequest: StudentCreateWithFilesRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        classId: formData.classId,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        gender: formData.gender,
        dob: formData.dob,
        hasSpecialNeeds: formData.hasSpecialNeeds,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        districtId: formData.districtId,
        countyId: formData.countyId,
        subCountyId: formData.subCountyId,
        parishId: formData.parishId,
        orphanCategory: formData.orphanCategory,
        nationality: formData.nationality
      };

      if (this.selectedImageFiles.length > 0) {
        // For now, we'll upload the first image (API limitation)
        // TODO: Update API to support multiple images
        const onProgress = (progress: FileUploadProgress) => {
          this.uploadProgress = progress.percentage;
        };

        this.studentService.createStudentWithImages(createRequest, this.selectedImageFiles[0], onProgress)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.uploadProgress = null;
              this.onFormSuccess(response.message);
            },
            error: (error) => {
              this.isSubmitting = false;
              this.uploadProgress = null;
            }
          });
      } else {
        // Use regular create if no image
        const regularCreateRequest: StudentCreateRequest = {
          ...createRequest
        };

        this.studentService.createStudent(regularCreateRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.onFormSuccess(response.message);
            },
            error: (error) => {
              this.isSubmitting = false;
            }
          });
      }
    }
  }

  private onFormSuccess(message?: string): void {
    this.toastr.success(message || 'Student operation completed successfully');
    this.success.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.studentForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['pattern']) {
      switch (controlName) {
        case 'mobileNumber':
          return 'Please enter a valid 10-digit mobile number';
        default:
          return 'Invalid format';
      }
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }

    return 'Invalid input';
  }

  onCancel(): void {
    this.close.emit();
  }

  // Image handling methods
  onImageFilesSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      // Check if adding these files would exceed max images
      const totalImages = this.selectedImageFiles.length + this.existingImageIds.length + files.length;
      if (totalImages > this.maxImages) {
        const availableSlots = this.maxImages - (this.selectedImageFiles.length + this.existingImageIds.length);
        this.toastr.error(`You can only add ${availableSlots} more image(s). Maximum ${this.maxImages} images allowed.`);
        input.value = '';
        return;
      }
      
      // Validate and add each file
      files.forEach(file => {
        const validation = this.fileUploadService.validateImageFile(file);
        if (!validation.isValid) {
          this.toastr.error(validation.error || 'Invalid file');
          return;
        }
        
        this.selectedImageFiles.push(file);
        
        // Create preview URL
        if (file.type.startsWith('image/')) {
          const previewUrl = this.fileUploadService.getImagePreviewUrl(file);
          this.imagePreviewUrls.push(previewUrl);
        }
      });

      // Clear input to allow selecting same files again
      input.value = '';
    }
  }

  removeImageFile(index: number): void {
    // Clean up preview URL
    if (this.imagePreviewUrls[index]) {
      this.fileUploadService.revokePreviewUrl(this.imagePreviewUrls[index]);
    }
    
    // Remove file and preview
    this.selectedImageFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
    
    // Clear file input
    const fileInput = document.getElementById('imageFilesInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    // Trigger change detection to update UI
    this.cdr.detectChanges();
  }

  clearAllImages(): void {
    // Clean up all preview URLs
    this.imagePreviewUrls.forEach(url => {
      this.fileUploadService.revokePreviewUrl(url);
    });
    
    this.selectedImageFiles = [];
    this.imagePreviewUrls = [];
    
    // Clear file input
    const fileInput = document.getElementById('imageFilesInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    // Trigger change detection to update UI
    this.cdr.detectChanges();
  }

  removeExistingImage(imageId: string): void {
    // Remove from existingImageIds array
    const index = this.existingImageIds.indexOf(imageId);
    if (index > -1) {
      this.existingImageIds.splice(index, 1);
      // Trigger change detection to update UI
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up all preview URLs
    this.imagePreviewUrls.forEach(url => {
      this.fileUploadService.revokePreviewUrl(url);
    });
  }
}
