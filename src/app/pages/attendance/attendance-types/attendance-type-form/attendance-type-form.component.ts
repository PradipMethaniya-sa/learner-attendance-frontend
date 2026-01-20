import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceTypeService } from '../attendance-type.service';
import { AttendanceType, AttendanceTypeCreateRequest, AttendanceTypeUpdateRequest, ApiResponse } from '../attendance-type.model';
import { TimePickerComponent } from '../../../../shared/components/form/time-picker/time-picker.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimePickerComponent],
  templateUrl: './attendance-type-form.component.html',
  styleUrls: ['./attendance-type-form.component.scss']
})
export class AttendanceTypeFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  attendanceTypeForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  selectedAttendanceType: AttendanceType | null = null;

  @Input() attendanceType: AttendanceType | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private attendanceTypeService: AttendanceTypeService,
    private toastr: ToastrService
  ) {
    this.attendanceTypeForm = this.createAttendanceTypeForm();
  }

  ngOnInit(): void {
    if (this.attendanceType) {
      this.setEditMode(this.attendanceType);
    }
  }

  ngOnChanges(): void {
    if (this.attendanceType) {
      this.setEditMode(this.attendanceType);
    } else {
      this.resetForm();
    }
  }

  private createAttendanceTypeForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      lateArrivalThreshold: ['', [Validators.required]],
      earlyArrivalThreshold: ['', [Validators.required]],
      isActive: [true, Validators.required]
    });
  }

  setEditMode(attendanceType: AttendanceType): void {
    this.isEditMode = true;
    this.selectedAttendanceType = attendanceType;
    
    this.attendanceTypeForm.patchValue({
      name: attendanceType.name,
      description: attendanceType.description,
      lateArrivalThreshold: attendanceType.lateArrivalThreshold,
      earlyArrivalThreshold: attendanceType.earlyArrivalThreshold,
      isActive: attendanceType.isActive
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedAttendanceType = null;
    this.error = null;
    this.attendanceTypeForm.reset({
      isActive: true
    });
  }

  onSubmit(): void {
    if (this.attendanceTypeForm.invalid) {
      this.markFormGroupTouched(this.attendanceTypeForm);
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.attendanceTypeForm.value;

    if (this.isEditMode && this.selectedAttendanceType) {
      const updateRequest: AttendanceTypeUpdateRequest = {
        name: formData.name,
        description: formData.description,
        lateArrivalThreshold: formData.lateArrivalThreshold,
        earlyArrivalThreshold: formData.earlyArrivalThreshold,
        isActive: formData.isActive
      };

      this.attendanceTypeService.updateAttendanceType(this.selectedAttendanceType.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: ApiResponse<AttendanceType>) => {
            this.isSubmitting = false;
            this.onFormSuccess(response.message);
          },
          error: (error) => {
            this.error = error.message || 'Failed to update attendance type';
            this.isSubmitting = false;
          }
        });
    } else {
      const createRequest: AttendanceTypeCreateRequest = {
        name: formData.name,
        description: formData.description,
        lateArrivalThreshold: formData.lateArrivalThreshold,
        earlyArrivalThreshold: formData.earlyArrivalThreshold,
        isActive: formData.isActive
      };

      this.attendanceTypeService.createAttendanceType(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: ApiResponse<AttendanceType>) => {
            this.isSubmitting = false;
            this.onFormSuccess(response.message);
          },
          error: (error) => {
            this.error = error.message || 'Failed to create attendance type';
            this.isSubmitting = false;
          }
        });
    }
  }

  private onFormSuccess(message?: string): void {
    this.toastr.success(message || 'Attendance type operation completed successfully');
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
    const control = this.attendanceTypeForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }

    return 'Invalid input';
  }

  onLateArrivalTimeChange(time: string): void {
    this.attendanceTypeForm.patchValue({ lateArrivalThreshold: time });
  }

  onEarlyDepartureTimeChange(time: string): void {
    this.attendanceTypeForm.patchValue({ earlyArrivalThreshold: time });
  }

  onCancel(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
