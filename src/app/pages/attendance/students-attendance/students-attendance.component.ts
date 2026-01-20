import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { AttendanceService, StudentAttendance, AttendanceUpdateRequest } from '../attendance.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

export interface StudentAttendanceUI {
  id: string;
  studentId: string;
  studentUid: string;
  name: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string;
  avatarThumbUrl?: string;
  isPresent: boolean;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
  timeIn: string;
  remarks: string;
  synced: boolean;
  originalStatus?: 'PRESENT' | 'ABSENT' | 'LATE';
  originalTime?: string;
  originalRemark?: string;
}

export interface OriginalStudentValues {
  id: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'LATE';
  timeIn: string;
  remarks: string;
}

@Component({
  selector: 'app-students-attendance',
  standalone: true,
  imports: [CommonModule, PageBreadcrumbComponent, DatePickerComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './students-attendance.component.html',
  styleUrls: ['./students-attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class StudentsAttendanceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Form for filters
  filterForm: FormGroup;

  // UI State
  selectedClass = '';
  selectedDate = '';
  totalStudents = 0;
  searchTerm = '';
  isLoading = false;
  isSaving = false;

  // Data
  students: StudentAttendanceUI[] = [];
  filteredStudents: StudentAttendanceUI[] = [];
  localChanges: Map<string, OriginalStudentValues> = new Map();

  // Options for dropdowns
  classes: any[] = [];
  isLoadingClasses = false;

  // Modal state
  showTimeSelectionModal = false;
  selectedTimeForAll = '--:--';

  constructor(
    private attendanceService: AttendanceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Initialize form
    this.filterForm = this.fb.group({
      classId: [''],
      date: ['']
    });
  }

  ngOnInit(): void {
    // Load classes first
    this.loadClasses();

    // Subscribe to form changes
    this.filterForm.get('classId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.selectedClass = value;
        if (value && this.selectedDate) {
          this.loadAttendance();
        }
      });

    this.filterForm.get('date')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.selectedDate = value;
        if (value && this.selectedClass) {
          this.loadAttendance();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClasses(): void {
    this.isLoadingClasses = true;
    this.attendanceService.getClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoadingClasses = false;
          if (response.success && response.data) {
            this.classes = response.data.schoolClasses || response.data.classes || response.data || [];
          } else {
            this.toastr.error(response.message || 'Failed to load classes');
          }
        },
        error: (error) => {
          this.isLoadingClasses = false;
        }
      });
  }

  loadAttendance(): void {
    if (!this.selectedClass || !this.selectedDate) {
      return;
    }

    this.isLoading = true;
    this.localChanges.clear();

    this.attendanceService.getStudentAttendance(this.selectedClass, this.selectedDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.students = response.data.attendances.map(student => this.mapToUIModel(student));
            this.filteredStudents = [...this.students];
            this.totalStudents = this.students.length;
            this.toastr.success(response.message || 'Attendance data loaded successfully');
          } else {
            this.toastr.error(response.message || 'Failed to load attendance data');
            this.students = [];
            this.filteredStudents = [];
            this.totalStudents = 0;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.students = [];
          this.filteredStudents = [];
          this.totalStudents = 0;
        }
      });
  }

  // Helper functions for time format conversion
  private normalizeTimeFromAPI(time: string): string {
    if (!time) return '';
    // Extract just HH:MM from HH:MM:SS format
    return time.substring(0, 5);
  }

  private normalizeTimeForAPI(time: string): string {
    if (!time) return '';
    // Convert HH:MM to HH:MM:SS format
    return time.length === 5 ? `${time}:00` : time;
  }

  private mapToUIModel(student: StudentAttendance): StudentAttendanceUI {
    const colors = [
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    ];

    const fullName = `${student.firstName} ${student.lastName}`;
    const colorIndex = fullName.charCodeAt(0) % colors.length;
    const names = fullName.split(' ');
    const initials = names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];

    return {
      id: student.id,
      studentId: student.studentId,
      studentUid: student.studentUid || student.studentId,
      name: fullName,
      initials: initials.toUpperCase(),
      avatarColor: colors[colorIndex],
      avatarUrl: student.avatarUrl,
      avatarThumbUrl: student.avatarThumbUrl,
      isPresent: student.attendanceStatus === 'PRESENT',
      attendanceStatus: student.attendanceStatus,
      timeIn: this.normalizeTimeFromAPI(student.attendanceTime),
      remarks: student.overrideReason || student.remark || '',
      synced: true,
      originalStatus: student.attendanceStatus,
      originalTime: this.normalizeTimeFromAPI(student.attendanceTime),
      originalRemark: student.overrideReason || student.remark || ''
    };
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.filterStudents();
  }

  onClassChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterForm.get('classId')?.setValue(value, { emitEvent: true });
  }

  onDatePickerChange(event: any): void {
    const dateStr = event.dateStr;
    this.filterForm.get('date')?.setValue(dateStr, { emitEvent: true });
  }

  onAttendanceChange(studentId: string, isPresent: boolean): void {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      // Store original values if not already tracked
      if (!this.localChanges.has(studentId)) {
        this.localChanges.set(studentId, {
          id: student.id,
          attendanceStatus: student.attendanceStatus,
          timeIn: student.timeIn,
          remarks: student.remarks
        });
      }

      // Update the student
      student.isPresent = isPresent;
      student.attendanceStatus = isPresent ? 'PRESENT' : 'ABSENT';

      // Check if this is actually different from original
      this.updateChangesTracking(studentId);
    }
  }

  onTimeInChange(studentId: string, timeIn: string): void {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.isPresent && timeIn !== '--:--') {
      // Store original values if not already tracked
      if (!this.localChanges.has(studentId)) {
        this.localChanges.set(studentId, {
          id: student.id,
          attendanceStatus: student.attendanceStatus,
          timeIn: student.timeIn,
          remarks: student.remarks
        });
      }

      student.timeIn = timeIn;

      // Check if this is actually different from original
      this.updateChangesTracking(studentId);
    }
  }

  onRemarksChange(studentId: string, remarks: string): void {
    const student = this.students.find(s => s.id === studentId);
    if (student && this.hasStudentChanged(studentId)) {
      // Store original values if not already tracked
      if (!this.localChanges.has(studentId)) {
        this.localChanges.set(studentId, {
          id: student.id,
          attendanceStatus: student.attendanceStatus,
          timeIn: student.timeIn,
          remarks: student.remarks
        });
      }

      student.remarks = remarks;

      // Check if this is actually different from original
      this.updateChangesTracking(studentId);
    }
  }

  markAllPresent(): void {
    this.openMarkAllPresentModal();
  }

  markAllAbsent(): void {
    this.students.forEach(student => {
      // Store original values if not already tracked
      if (!this.localChanges.has(student.id)) {
        this.localChanges.set(student.id, {
          id: student.id,
          attendanceStatus: student.attendanceStatus,
          timeIn: student.timeIn,
          remarks: student.remarks
        });
      }

      // Update the student
      student.isPresent = false;
      student.attendanceStatus = 'ABSENT';
      student.timeIn = student.timeIn;
    });
  }

  openMarkAllPresentModal(): void {
    this.showTimeSelectionModal = true;
  }

  closeTimeSelectionModal(): void {
    this.showTimeSelectionModal = false;
  }

  confirmMarkAllPresent(): void {
    this.students.forEach(student => {
      // Store original values if not already tracked
      if (!this.localChanges.has(student.id)) {
        this.localChanges.set(student.id, {
          id: student.id,
          attendanceStatus: student.attendanceStatus,
          timeIn: student.timeIn,
          remarks: student.remarks
        });
      }

      // Update the student
      student.isPresent = true;
      student.attendanceStatus = 'PRESENT';
      student.timeIn = this.selectedTimeForAll;
    });

    this.closeTimeSelectionModal();
    this.toastr.success(`All students marked present with time ${this.selectedTimeForAll}`);
  }

  saveAttendance(): void {
    if (this.localChanges.size === 0) {
      this.toastr.info('No changes to save.');
      return;
    }

    this.isSaving = true;

    const updates: AttendanceUpdateRequest[] = [];
    this.localChanges.forEach((originalStudent, studentId) => {
      const currentStudent = this.students.find(s => s.id === studentId);
      if (currentStudent) {
        updates.push({
          attendanceId: currentStudent.id,
          attendanceStatus: currentStudent.attendanceStatus,
          attendanceTime: this.normalizeTimeForAPI(currentStudent.timeIn),
          remark: currentStudent.remarks || ''
        });
      }
    });

    this.attendanceService.updateStudentAttendance(updates)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          if (response.success) {
            this.toastr.success(response.message || `Attendance updated for ${updates.length} student(s)`);
            this.localChanges.clear();
            // Update the original values in the main array
            updates.forEach(update => {
              const student = this.students.find(s => s.id === update.attendanceId);
              if (student) {
                student.originalStatus = update.attendanceStatus;
                student.originalTime = this.normalizeTimeFromAPI(update.attendanceTime);
                student.originalRemark = update.remark || '';
              }
            });
            this.filteredStudents = [...this.students];
          } else {
            this.toastr.error(response.message || 'Failed to update attendance');
          }
        },
        error: (error) => {
          this.isSaving = false;
          // Error handled globally
        }
      });
  }

  get hasUnsavedChanges(): boolean {
    return Array.from(this.localChanges.values()).some(originalStudent => {
      const currentStudent = this.students.find(s => s.id === originalStudent.id);
      if (!currentStudent) return false;

      return (
        currentStudent.attendanceStatus !== originalStudent.attendanceStatus ||
        currentStudent.timeIn !== originalStudent.timeIn ||
        currentStudent.remarks !== originalStudent.remarks
      );
    });
  }

  hasStudentChanged(studentId: string): boolean {
    const originalStudent = this.localChanges.get(studentId);
    const currentStudent = this.students.find(s => s.id === studentId);
    if (!originalStudent || !currentStudent) return false;

    return (
      currentStudent.attendanceStatus !== originalStudent.attendanceStatus ||
      currentStudent.timeIn !== originalStudent.timeIn
    );
  }

  private updateChangesTracking(studentId: string): void {
    const originalStudent = this.localChanges.get(studentId);
    const currentStudent = this.students.find(s => s.id === studentId);

    if (!originalStudent || !currentStudent) return;

    // Check if current values match original values
    const isSameAsOriginal = (
      currentStudent.attendanceStatus === originalStudent.attendanceStatus &&
      currentStudent.timeIn === originalStudent.timeIn &&
      currentStudent.remarks === originalStudent.remarks
    );

    // If same as original, remove from changes tracking
    if (isSameAsOriginal) {
      this.localChanges.delete(studentId);
    }
  }

  private filterStudents(): void {
    if (!this.searchTerm) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(this.searchTerm) ||
        student.studentId.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  getAttendanceStatusClass(isPresent: boolean): string {
    return isPresent ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  }

  getRowClass(isPresent: boolean): string {
    return isPresent ? '' : 'bg-red-50/30 dark:bg-red-900/5';
  }

  getSelectedClassName(): string {
    const selectedClass = this.classes.find(c => c.id === this.selectedClass);
    return selectedClass ? selectedClass.name : '';
  }
}
