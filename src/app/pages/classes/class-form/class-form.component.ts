import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassService } from '../class.service';
import { SchoolClass, ClassCreateRequest, ClassUpdateRequest } from '../class.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss']
})
export class ClassFormComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  classForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  selectedClass: SchoolClass | null = null;

  @Input() class: SchoolClass | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  parentClasses: SchoolClass[] = [];
  isStream = false;

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private toastr: ToastrService
  ) {
    this.classForm = this.createClassForm();
  }

  ngOnInit(): void {
    this.loadParentClasses();
    if (this.class) {
      this.setEditMode(this.class);
    }
  }

  ngOnChanges(): void {
    if (this.parentClasses.length > 0) {
      if (this.class) {
        this.setEditMode(this.class);
      } else {
        this.resetForm();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createClassForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      classId: [null]
    });
  }

  loadParentClasses(): void {
    // Load classes that can be parent classes (classes without classId)
    this.classService.getClasses({ includeParent: true, sortBy: 'name', orderBy: 'asc' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.parentClasses = response.data.schoolClasses.filter(c => c.classId === null);
          }
        }
      });
  }

  onClassTypeChange(event: Event): void {
    const isStream = (event.target as HTMLInputElement).value === 'stream';
    this.isStream = isStream;
    
    if (!isStream) {
      this.classForm.patchValue({ classId: null });
    }
  }

  setEditMode(classItem: SchoolClass): void {
    this.isEditMode = true;
    this.selectedClass = classItem;
    this.isStream = classItem.classId !== null;
    
    this.classForm.patchValue({
      name: classItem.name,
      classId: classItem.classId
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedClass = null;
    this.error = null;
    this.isStream = false;
    this.classForm.reset();
  }

  onSubmit(): void {
    if (this.classForm.invalid) {
      this.markFormGroupTouched(this.classForm);
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.classForm.value;

    if (this.isEditMode && this.selectedClass) {
      const updateRequest: ClassUpdateRequest = {
        name: formData.name,
        classId: formData.classId
      };

      this.classService.updateClass(this.selectedClass.id, updateRequest)
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
      const createRequest: ClassCreateRequest = {
        name: formData.name,
        classId: formData.classId
      };

      this.classService.createClass(createRequest)
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
    this.toastr.success(message || 'Class operation completed successfully');
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
    const control = this.classForm.get(controlName);
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

  onCancel(): void {
    this.close.emit();
  }
}
