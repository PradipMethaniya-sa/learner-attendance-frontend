import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../staff.service';
import { Staff, StaffCreateRequest, StaffUpdateRequest } from '../staff.model';
import { FilterService, FilterItem } from '../../../shared/services/filter.service';
import { FileUploadService, FileUploadProgress } from '../../../shared/services/file-upload.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss']
})
export class StaffFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  staffForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  selectedStaff: Staff | null = null;

  // Image upload properties
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  uploadProgress: number | null = null;

  @Input() staff: Staff | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+256', name: 'Uganda' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' },
    { code: '+94', name: 'Sri Lanka' }
  ];

  districts: FilterItem[] = [];
  counties: FilterItem[] = [];
  subCounties: FilterItem[] = [];
  parishes: FilterItem[] = [];

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private filterService: FilterService,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef
  ) {
    this.staffForm = this.createStaffForm();
  }

  ngOnInit(): void {
    this.loadDistricts();
    if (this.staff) {
      this.setEditMode(this.staff);
    }
  }

  ngOnChanges(): void {
    // Only handle changes if component is initialized and districts are loaded
    if (this.districts.length > 0) {
      if (this.staff) {
        this.setEditMode(this.staff);
      } else {
        this.resetForm();
      }
    }
  }

  private createStaffForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+94', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      nationalId: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['MALE', Validators.required],
      dob: ['', Validators.required],
      addressLine1: ['', [Validators.required, Validators.maxLength(500)]],
      addressLine2: ['', Validators.maxLength(500)],
      districtId: ['', Validators.required],
      countyId: [''],
      subCountyId: [''],
      parishId: [''],
      nationality: ['Sri Lankan', [Validators.required, Validators.maxLength(100)]],
      teacherRegNo: ['', Validators.maxLength(50)]
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

  onDistrictChange(event: Event): void {
    const districtId = (event.target as HTMLSelectElement).value;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    this.staffForm.patchValue({ countyId: '', subCountyId: '', parishId: '' });

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
    const districtId = (document.getElementById('districtId') as HTMLSelectElement).value;
    const countyId = (event.target as HTMLSelectElement).value;
    this.subCounties = [];
    this.parishes = [];
    this.staffForm.patchValue({ subCountyId: '', parishId: '' });

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
    const districtId = (document.getElementById('districtId') as HTMLSelectElement).value;
    const countyId = (document.getElementById('countyId') as HTMLSelectElement).value;
    const subCountyId = (event.target as HTMLSelectElement).value;
    this.parishes = [];
    this.staffForm.patchValue({ parishId: '' });

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

  setEditMode(staff: Staff): void {
    this.isEditMode = true;
    this.selectedStaff = staff;
    
    // Load location hierarchy for the staff's location
    if (staff.districtId) {
      this.loadLocationHierarchy(
        staff.districtId, 
        staff.countyId || '', 
        staff.subCountyId || '', 
        staff.parishId || ''
      );
    }
    
    this.staffForm.patchValue({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      countryCode: staff.countryCode,
      mobileNumber: staff.mobileNumber,
      nationalId: staff.nationalId,
      gender: staff.gender,
      dob: staff.dob,
      addressLine1: staff.addressLine1,
      addressLine2: staff.addressLine2 || '',
      districtId: staff.districtId,
      countyId: staff.countyId || '',
      subCountyId: staff.subCountyId || '',
      parishId: staff.parishId || '',
      nationality: staff.nationality,
      teacherRegNo: staff.teacherRegNo || ''
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
            
            // Set district value
            const districtSelect = document.getElementById('districtId') as HTMLSelectElement;
            if (districtSelect) {
              districtSelect.value = districtId;
            }
            
            // Load sub counties
            if (countyId) {
              this.filterService.getSubCounties(districtId, countyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (response) => {
                    if (response.success) {
                      this.subCounties = response.data;
                      
                      // Set county value
                      const countySelect = document.getElementById('countyId') as HTMLSelectElement;
                      if (countySelect) {
                        countySelect.value = countyId;
                      }
                      
                      // Load parishes
                      if (subCountyId) {
                        this.filterService.getParishes(districtId, countyId, subCountyId)
                          .pipe(takeUntil(this.destroy$))
                          .subscribe({
                            next: (response) => {
                              if (response.success) {
                                this.parishes = response.data;
                                
                                // Set sub county value
                                const subCountySelect = document.getElementById('subCountyId') as HTMLSelectElement;
                                if (subCountySelect) {
                                  subCountySelect.value = subCountyId;
                                }
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
    this.selectedStaff = null;
    this.error = null;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    this.staffForm.reset({
      countryCode: '+94',
      gender: 'MALE',
      nationality: 'Sri Lankan'
    });
  }

  onSubmit(): void {
    if (this.staffForm.invalid) {
      this.markFormGroupTouched(this.staffForm);
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.staffForm.value;

    if (this.isEditMode && this.selectedStaff) {
      const updateRequest: StaffUpdateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        nationalId: formData.nationalId,
        gender: formData.gender,
        dob: formData.dob,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        districtId: formData.districtId,
        countyId: formData.countyId || undefined,
        subCountyId: formData.subCountyId || undefined,
        parishId: formData.parishId || undefined,
        nationality: formData.nationality,
        teacherRegNo: formData.teacherRegNo || undefined
      };

      // Always use updateStaffWithImages (with undefined image if none selected)
      const onProgress = (progress: FileUploadProgress) => {
        this.uploadProgress = progress.percentage;
      };

      const imageFile = this.selectedImageFile || undefined;

      this.staffService.updateStaffWithImages(
        this.selectedStaff.id,
        updateRequest,
        imageFile,
        onProgress
      ).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.uploadProgress = null;
          this.onFormSuccess(response.message);
        },
        error: (error) => {
          this.error = error.message;
          this.isSubmitting = false;
          this.uploadProgress = null;
        }
      });
    } else {
      const createRequest: StaffCreateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        nationalId: formData.nationalId,
        gender: formData.gender,
        dob: formData.dob,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        districtId: formData.districtId,
        countyId: formData.countyId || undefined,
        subCountyId: formData.subCountyId || undefined,
        parishId: formData.parishId || undefined,
        nationality: formData.nationality,
        teacherRegNo: formData.teacherRegNo || undefined
      };

      // Always use createStaffWithImages (with undefined image if none selected)
      const onProgress = (progress: FileUploadProgress) => {
        this.uploadProgress = progress.percentage;
      };

      const imageFile = this.selectedImageFile || undefined;

      this.staffService.createStaffWithImages(
        createRequest,
        imageFile,
        onProgress
      ).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.uploadProgress = null;
          this.onFormSuccess(response.message);
        },
        error: (error) => {
          this.error = error.message;
          this.isSubmitting = false;
          this.uploadProgress = null;
        }
      });
    }
  }

  private onFormSuccess(message?: string): void {
    this.toastr.success(message || 'Staff operation completed successfully');
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
    const control = this.staffForm.get(controlName);
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
          return 'Please enter a valid mobile number';
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
  onImageFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate the file
      const validation = this.fileUploadService.validateImageFile(file);
      if (!validation.isValid) {
        this.toastr.error(validation.error || 'Invalid file');
        return;
      }

      // Clean up previous preview
      if (this.imagePreviewUrl) {
        this.fileUploadService.revokePreviewUrl(this.imagePreviewUrl);
      }

      this.selectedImageFile = file;
      
      // Create preview URL
      if (file.type.startsWith('image/')) {
        this.imagePreviewUrl = this.fileUploadService.getImagePreviewUrl(file);
      }

      // Clear input to allow selecting same file again
      input.value = '';
    }
  }

  removeSelectedImage(): void {
    // Clean up preview URL
    if (this.imagePreviewUrl) {
      this.fileUploadService.revokePreviewUrl(this.imagePreviewUrl);
    }
    
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
    
    // Clear file input
    const fileInput = document.getElementById('imageFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up preview URL
    if (this.imagePreviewUrl) {
      this.fileUploadService.revokePreviewUrl(this.imagePreviewUrl);
    }
  }
}
