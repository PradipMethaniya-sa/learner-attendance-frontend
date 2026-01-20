import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { StudentService } from '../student.service';
import { 
  Student,
  StudentCreateWithFilesRequest, 
  StudentUpdateWithFilesRequest, 
  OrphanCategory, 
  SchoolClass,
  Guardian,
  GuardianDetails,
  GuardianRelation,
  GuardianAssignment
} from '../student.model';
import { FilterService, FilterItem } from '../../../shared/services/filter.service';
import { FileUploadService, FileUploadProgress } from '../../../shared/services/file-upload.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  @Input() studentId: string | null = null;
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

  // Guardian Mapping properties
  assignedGuardians: Guardian[] = [];
  availableGuardians: GuardianDetails[] = [];
  guardianRelations: GuardianRelation[] = [];
  isLoadingGuardians = false;
  
  // Track guardian changes for bulk update
  guardiansToAdd: GuardianAssignment[] = [];
  guardiansToRemove: string[] = [];
  originalAssignedGuardians: Guardian[] = [];

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
    this.loadGuardianRelations();
    this.loadGuardians();
    if (this.studentId) {
      this.loadStudentDetails(this.studentId);
    }
  }

  ngOnChanges(): void {
    // Only handle changes if component is initialized and districts are loaded
    if (this.districts.length > 0) {
      if (this.studentId) {
        this.loadStudentDetails(this.studentId);
      } else {
        this.resetForm();
      }
    }
  }

  private loadStudentDetails(studentId: string): void {
    this.studentService.getStudentById(studentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.setEditMode(response.data);
          } else {
            this.toastr.error('Failed to load student details');
          }
        },
        error: (error) => {
          this.toastr.error('Failed to load student details');
        }
      });
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
      nationality: ['', [Validators.required, Validators.maxLength(100)]],
      // Guardian mapping controls
      guardianId: [''],
      relation: ['']
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

  loadGuardianRelations(): void {
    this.studentService.getGuardianRelations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.guardianRelations = response.data;
          }
        },
        error: (error) => {
          this.toastr.error('Failed to load guardian relations');
        }
      });
  }

  loadGuardians(): void {
    this.isLoadingGuardians = true;
    this.studentService.getGuardians(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.availableGuardians = response.data.guardians;
            this.filterAvailableGuardians();
          }
          this.isLoadingGuardians = false;
        },
        error: (error) => {
          this.toastr.error('Failed to load guardians');
          this.isLoadingGuardians = false;
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
    
    // Load assigned guardians and store original for comparison
    this.assignedGuardians = student.guardians || [];
    this.originalAssignedGuardians = JSON.parse(JSON.stringify(student.guardians || [])); // Deep copy
    
    // Reset guardian changes tracking
    this.guardiansToAdd = [];
    this.guardiansToRemove = [];
    
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
    this.assignedGuardians = [];
    this.availableGuardians = [];
    this.originalAssignedGuardians = [];
    this.guardiansToAdd = [];
    this.guardiansToRemove = [];
    this.studentForm.reset();
    this.resetLocationFields();
    // Reset form to default values
    this.studentForm.patchValue({
      countryCode: '+91',
      gender: 'MALE',
      hasSpecialNeeds: false,
      orphanCategory: 'NONE',
      guardianId: '',
      relation: ''
    });
    // Reload guardians for fresh state
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

      // Update student first, then handle guardians
      this.updateStudentAndGuardians(updateRequest);
    } else {
      this.createStudent(formData);
    }
  }

  private updateStudentAndGuardians(updateRequest: StudentUpdateWithFilesRequest): void {
    if (!this.selectedStudent) {
      this.isSubmitting = false;
      this.toastr.error('No student selected for update');
      return;
    }

    // Always use updateStudentWithImages (with undefined image if none selected)
    const onProgress = (progress: FileUploadProgress) => {
      this.uploadProgress = progress.percentage;
    };

    const imageFile = this.selectedImageFiles.length > 0 ? this.selectedImageFiles[0] : undefined;

    // Update student first, then handle guardians
    this.studentService.updateStudentWithImages(
      this.selectedStudent.id,
      updateRequest,
      imageFile,
      onProgress
    ).subscribe({
      next: (response) => {
        // Student updated successfully, now handle guardians
        this.handleGuardianUpdate();
        this.uploadProgress = null;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.uploadProgress = null;
      }
    });
  }

  private handleGuardianUpdate(): void {
    if (!this.selectedStudent) {
      this.isSubmitting = false;
      this.toastr.error('No student selected for guardian update');
      return;
    }

    // Check if there are guardian changes to process
    if (this.guardiansToAdd.length > 0 || this.guardiansToRemove.length > 0) {
      const guardianRequest = {
        studentId: this.selectedStudent.id,
        data: this.guardiansToAdd,
        removeAssignIds: this.guardiansToRemove
      };

      this.studentService.bulkAssignUnassignGuardians(guardianRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success('Student and guardians updated successfully');
              this.resetGuardianTracking();
              this.onFormSuccess('Student updated successfully');
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            this.toastr.error('Student updated but guardian changes failed');
          }
        });
    } else {
      // No guardian changes, just complete the update
      this.toastr.success('Student updated successfully');
      this.onFormSuccess('Student updated successfully');
    }
  }

  private resetGuardianTracking(): void {
    // Reset tracking arrays after successful update
    this.originalAssignedGuardians = JSON.parse(JSON.stringify(this.assignedGuardians));
    this.guardiansToAdd = [];
    this.guardiansToRemove = [];
  }

  private createStudent(formData: any): void {
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

    // Always use createStudentWithImages (with undefined image if none selected)
    const onProgress = (progress: FileUploadProgress) => {
      this.uploadProgress = progress.percentage;
    };

    const imageFile = this.selectedImageFiles.length > 0 ? this.selectedImageFiles[0] : undefined;

    this.studentService.createStudentWithImages(createRequest, imageFile, onProgress)
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
  }

  private onFormSuccess(message?: string): void {
    this.isSubmitting = false;
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

  // Guardian Mapping methods
  filterAvailableGuardians(): void {
    const assignedGuardianIds = this.assignedGuardians.map(g => g.guardianId);
    this.availableGuardians = this.availableGuardians.filter(guardian => 
      !assignedGuardianIds.includes(guardian.id)
    );
  }

  getFilteredAvailableGuardians(): GuardianDetails[] {
    const assignedGuardianIds = this.assignedGuardians.map(g => g.guardianId);
    return this.availableGuardians.filter(guardian => 
      !assignedGuardianIds.includes(guardian.id)
    );
  }

  onGuardianSelect(): void {
    const guardianId = this.studentForm.get('guardianId')?.value;
    const relation = this.studentForm.get('relation')?.value;
    if (guardianId && relation) {
      this.assignGuardian();
    }
  }

  assignGuardian(): void {
    const guardianId = this.studentForm.get('guardianId')?.value;
    const relation = this.studentForm.get('relation')?.value;
    
    if (!guardianId || !relation) {
      this.toastr.error('Please select both guardian and relation');
      return;
    }

    const selectedGuardian = this.availableGuardians.find(g => g.id === guardianId);
    if (!selectedGuardian) {
      this.toastr.error('Selected guardian not found');
      return;
    }

    // Check if already assigned
    if (this.assignedGuardians.some(g => g.guardianId === guardianId)) {
      this.toastr.error('Guardian already assigned');
      return;
    }

    // Create new guardian object
    const newGuardian: Guardian = {
      assignmentId: '', // Will be set by API
      guardianId: selectedGuardian.id,
      guardianUid: selectedGuardian.guardianUid,
      firstName: selectedGuardian.firstName,
      lastName: selectedGuardian.lastName,
      email: selectedGuardian.email,
      countryCode: selectedGuardian.countryCode,
      mobileNumber: selectedGuardian.mobileNumber,
      avatarUrl: selectedGuardian.avatarUrl,
      relation: relation,
      isPrimary: this.assignedGuardians.length === 0 // First guardian is primary
    };

    // Add to assigned guardians (optimistic update)
    this.assignedGuardians.push(newGuardian);
    this.filterAvailableGuardians();
    
    // Track for bulk update
    this.guardiansToAdd.push({
      guardianId: newGuardian.guardianId,
      relation: newGuardian.relation,
      isPrimary: newGuardian.isPrimary
    });
    
    // Clear form controls
    this.studentForm.patchValue({
      guardianId: '',
      relation: ''
    });
  }

  unassignGuardian(guardian: Guardian): void {
    if (!this.isEditMode || !this.selectedStudent) {
      this.toastr.warning('Cannot unassign guardian in add mode');
      return;
    }

    // Optimistic update
    const index = this.assignedGuardians.findIndex(g => g.guardianId === guardian.guardianId);
    if (index > -1) {
      this.assignedGuardians.splice(index, 1);
    }
    this.filterAvailableGuardians();

    // Track for bulk update
    this.guardiansToRemove.push(guardian.assignmentId);
    
    // Remove from guardiansToAdd if it was added in this session
    const addIndex = this.guardiansToAdd.findIndex(g => g.guardianId === guardian.guardianId);
    if (addIndex > -1) {
      this.guardiansToAdd.splice(addIndex, 1);
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
