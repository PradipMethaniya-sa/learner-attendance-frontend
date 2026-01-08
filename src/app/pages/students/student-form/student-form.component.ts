import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { Student, StudentCreateRequest, StudentUpdateRequest, OrphanCategory } from '../student.model';
import { FilterService, FilterItem } from '../../../shared/services/filter.service';
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
  error: string | null = null;
  selectedStudent: Student | null = null;

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
  districts: FilterItem[] = [];
  counties: FilterItem[] = [];
  subCounties: FilterItem[] = [];
  parishes: FilterItem[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.studentForm = this.createStudentForm();
  }

  ngOnInit(): void {
    this.loadDistricts();
    this.loadOrphanCategories();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createStudentForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
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
    
    // Load location hierarchy for the student's location
    if (student.districtId) {
      this.loadLocationHierarchy(student.districtId, student.countyId, student.subCountyId, student.parishId);
    }
    
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
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
    this.error = null;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    this.studentForm.reset({
      countryCode: '+91',
      gender: 'MALE',
      hasSpecialNeeds: false,
      orphanCategory: 'NONE'
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.studentForm);
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.studentForm.value;

    if (this.isEditMode && this.selectedStudent) {
      const updateRequest: StudentUpdateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
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

      this.studentService.updateStudent(this.selectedStudent.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.onFormSuccess(response.message);
          },
          error: (error) => {
            this.error = error.message;
            this.isSubmitting = false;
          }
        });
    } else {
      const createRequest: StudentCreateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
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

      this.studentService.createStudent(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.onFormSuccess(response.message);
          },
          error: (error) => {
            this.error = error.message;
            this.isSubmitting = false;
          }
        });
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
}
