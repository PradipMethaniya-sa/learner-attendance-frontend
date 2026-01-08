import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuardianService } from '../guardian.service';
import { Guardian, GuardianCreateRequest, GuardianUpdateRequest } from '../guardian.model';
import { FilterService, FilterItem } from '../../../shared/services/filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-guardian-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './guardian-form.component.html',
  styleUrls: ['./guardian-form.component.scss']
})
export class GuardianFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  guardianForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  selectedGuardian: Guardian | null = null;

  @Input() guardian: Guardian | null = null;
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

  districts: FilterItem[] = [];
  counties: FilterItem[] = [];
  subCounties: FilterItem[] = [];
  parishes: FilterItem[] = [];

  constructor(
    private fb: FormBuilder,
    private guardianService: GuardianService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.guardianForm = this.createGuardianForm();
  }

  ngOnInit(): void {
    this.loadDistricts();
    if (this.guardian) {
      this.setEditMode(this.guardian);
    }
  }

  ngOnChanges(): void {
    // Only handle changes if component is initialized and districts are loaded
    if (this.districts.length > 0) {
      if (this.guardian) {
        this.setEditMode(this.guardian);
      } else {
        this.resetForm();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createGuardianForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+1', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nationalId: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['MALE', Validators.required],
      addressLine1: ['', [Validators.required, Validators.maxLength(500)]],
      addressLine2: ['', Validators.maxLength(500)],
      districtId: ['', Validators.required],
      countyId: ['', Validators.required],
      subCountyId: ['', Validators.required],
      parishId: ['', Validators.required],
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

  onDistrictChange(event: Event): void {
    const districtId = (event.target as HTMLSelectElement).value;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    // Reset all dependent form controls
    this.guardianForm.patchValue({ 
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
    const districtId = this.guardianForm.get('districtId')?.value;
    const countyId = (event.target as HTMLSelectElement).value;
    this.subCounties = [];
    this.parishes = [];
    // Reset dependent form controls
    this.guardianForm.patchValue({ 
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
    const districtId = this.guardianForm.get('districtId')?.value;
    const countyId = this.guardianForm.get('countyId')?.value;
    const subCountyId = (event.target as HTMLSelectElement).value;
    this.parishes = [];
    // Reset dependent form control
    this.guardianForm.patchValue({ parishId: '' });

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

  setEditMode(guardian: Guardian): void {
    this.isEditMode = true;
    this.selectedGuardian = guardian;
    
    // Load location hierarchy for the guardian's location
    if (guardian.districtId) {
      this.loadLocationHierarchy(guardian.districtId, guardian.countyId, guardian.subCountyId, guardian.parishId);
    }
    
    this.guardianForm.patchValue({
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      email: guardian.email,
      countryCode: guardian.countryCode,
      mobileNumber: guardian.mobileNumber,
      nationalId: guardian.nationalId,
      gender: guardian.gender,
      addressLine1: guardian.addressLine1,
      addressLine2: guardian.addressLine2,
      districtId: guardian.districtId,
      countyId: guardian.countyId || '',
      subCountyId: guardian.subCountyId || '',
      parishId: guardian.parishId,
      nationality: guardian.nationality
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
            
            // Load sub counties if countyId is provided
            if (countyId) {
              this.filterService.getSubCounties(districtId, countyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (subCountyResponse) => {
                    if (subCountyResponse.success) {
                      this.subCounties = subCountyResponse.data;
                      
                      // Load parishes if subCountyId is provided
                      if (subCountyId) {
                        this.filterService.getParishes(districtId, countyId, subCountyId)
                          .pipe(takeUntil(this.destroy$))
                          .subscribe({
                            next: (parishResponse) => {
                              if (parishResponse.success) {
                                this.parishes = parishResponse.data;
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
    this.selectedGuardian = null;
    this.error = null;
    this.counties = [];
    this.subCounties = [];
    this.parishes = [];
    this.guardianForm.reset({
      countryCode: '+1',
      gender: 'MALE'
    });
  }

  onSubmit(): void {
    if (this.guardianForm.invalid) {
      this.markFormGroupTouched(this.guardianForm);
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.guardianForm.value;

    if (this.isEditMode && this.selectedGuardian) {
      const updateRequest: GuardianUpdateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        nationalId: formData.nationalId,
        gender: formData.gender,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        districtId: formData.districtId,
        countyId: formData.countyId,
        subCountyId: formData.subCountyId,
        parishId: formData.parishId,
        nationality: formData.nationality
      };

      this.guardianService.updateGuardian(this.selectedGuardian.id, updateRequest)
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
      const createRequest: GuardianCreateRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        nationalId: formData.nationalId,
        gender: formData.gender,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        districtId: formData.districtId,
        countyId: formData.countyId,
        subCountyId: formData.subCountyId,
        parishId: formData.parishId,
        nationality: formData.nationality
      };

      this.guardianService.createGuardian(createRequest)
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
    this.toastr.success(message || 'Guardian operation completed successfully');
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
    const control = this.guardianForm.get(controlName);
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
