import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../school.service';
import { School, SchoolCreateRequest, SchoolUpdateRequest } from '../school.model';
import { FilterService, FilterItem } from '../../../shared/services/filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-school-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './school-form.component.html',
  styleUrls: ['./school-form.component.scss']
})
export class SchoolFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  schoolForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  selectedSchool: School | null = null;

  @Input() school: School | null = null;
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

  districts: FilterItem[] = [];
  counties: FilterItem[] = [];
  subCounties: FilterItem[] = [];
  parishes: FilterItem[] = [];

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.schoolForm = this.createSchoolForm();
  }

  ngOnInit(): void {
    this.loadDistricts();
    if (this.school) {
      this.setEditMode(this.school);
    }
  }

  ngOnChanges(): void {
    // Only handle changes if component is initialized and districts are loaded
    if (this.districts.length > 0) {
      if (this.school) {
        this.setEditMode(this.school);
      } else {
        this.resetForm();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createSchoolForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      website: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
      addressLine1: ['', [Validators.required, Validators.maxLength(500)]],
      addressLine2: ['', Validators.maxLength(500)],
      parishId: ['', Validators.required],
      logoUrl: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
      registrationNo: ['', [Validators.required, Validators.maxLength(50)]]
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
    this.schoolForm.patchValue({ parishId: '' });

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
    this.schoolForm.patchValue({ parishId: '' });

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
    this.schoolForm.patchValue({ parishId: '' });

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

  setEditMode(school: School): void {
    this.isEditMode = true;
    this.selectedSchool = school;
    
    // Load location hierarchy for the school's location
    if (school.districtId) {
      this.loadLocationHierarchy(school.districtId, school.countyId, school.subCountyId, school.parishId);
    }
    
    this.schoolForm.patchValue({
      name: school.name,
      email: school.email,
      countryCode: school.countryCode,
      mobileNo: school.mobileNo,
      website: school.website,
      addressLine1: school.addressLine1,
      addressLine2: school.addressLine2,
      parishId: school.parishId,
      logoUrl: school.logoUrl,
      registrationNo: school.registrationNo
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
    this.selectedSchool = null;
    this.error = null;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    this.schoolForm.reset({
      countryCode: '+91'
    });
  }

  onSubmit(): void {
    if (this.schoolForm.invalid) {
      this.markFormGroupTouched(this.schoolForm);
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.schoolForm.value;

    if (this.isEditMode && this.selectedSchool) {
      const updateRequest: SchoolUpdateRequest = {
        name: formData.name,
        email: formData.email,
        countryCode: formData.countryCode,
        mobileNo: formData.mobileNo,
        website: formData.website || undefined,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        parishId: formData.parishId,
        logoUrl: formData.logoUrl || undefined,
        registrationNo: formData.registrationNo
      };

      this.schoolService.updateSchool(this.selectedSchool.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            // Emit success event with API message
            console.log('Update response:', response);
            this.onFormSuccess(response.message);
          },
          error: (error) => {
            this.error = error.message;
            this.isSubmitting = false;
          }
        });
    } else {
      const createRequest: SchoolCreateRequest = {
        name: formData.name,
        email: formData.email,
        countryCode: formData.countryCode,
        mobileNo: formData.mobileNo,
        website: formData.website || undefined,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        parishId: formData.parishId,
        logoUrl: formData.logoUrl || undefined,
        registrationNo: formData.registrationNo
      };

      this.schoolService.createSchool(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            // Emit success event with API message
            console.log('Create response:', response);
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
    this.toastr.success(message || 'School operation completed successfully');
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
    const control = this.schoolForm.get(controlName);
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
        case 'mobileNo':
          return 'Please enter a valid 10-digit mobile number';
        case 'website':
        case 'logoUrl':
          return 'Please enter a valid URL';
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
