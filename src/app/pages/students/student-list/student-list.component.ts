import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Student, StudentPagination, StudentFilters } from '../student.model';
import { StudentService } from '../student.service';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppTableComponent, StudentFormComponent, ConfirmDialogComponent],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  students: Student[] = [];
  pagination: StudentPagination | null = null;
  loading = false;

  searchForm: FormGroup;
  currentSortBy = 'studentUid';
  currentOrderBy: 'asc' | 'desc' = 'asc';

  // Modal and Dialog states
  showStudentForm = false;
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'info'
  };
  selectedStudent: Student | null = null;
  selectedStudentId: string | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { 
      key: 'avatarUrl', 
      label: 'Photo', 
      type: 'image',
      imageKey: 'avatarThumbUrl',
      imageFallback: '/assets/images/default-avatar.png',
      imageClass: 'w-10 h-10 rounded-full object-cover'
    },
    { key: 'studentUid', label: 'Student ID', sortable: true, exportable: true },
    { key: 'firstName', label: 'First Name', sortable: true, exportable: true },
    { key: 'lastName', label: 'Last Name', sortable: true, exportable: true },
    { key: 'email', label: 'Email', sortable: true, exportable: true },
    { key: 'mobileNumber', label: 'Phone', sortable: true, exportable: true },
    { key: 'gender', label: 'Gender', sortable: true, exportable: true },
    { key: 'guardianCount', label: 'No Of Guardians', type: 'text', sortable: true, exportable: true },
    { 
      key: 'status', 
      label: 'Status',
      type: 'badge',
      badgeClass: (value: string) => {
        switch (value) {
          case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          case 'INACTIVE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
      },
      exportable: true
    },
    { key: 'actions', label: 'Actions', actions: true }
  ];

  // Table actions
  tableActions: TableAction[] = [
    {
      key: 'view',
      label: 'View Details',
      icon: 'visibility',
      title: 'View Details',
      onClick: (student: any) => this.viewStudentDetails(student)
    },
    {
      key: 'edit',
      label: 'Edit Student',
      icon: 'edit',
      title: 'Edit Student',
      onClick: (student: any) => this.editStudent(student)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      title: 'Delete',
      onClick: (student: any) => this.deleteStudent(student)
    }
  ];

  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      page: [1],
      limit: [10]
    });
  }

  ngOnInit(): void {
    this.loadStudents();

    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({ page: 1 }, { emitEvent: false });
        this.loadStudents();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents(): void {
    this.loading = true;

    const filters: StudentFilters = {
      search: this.searchForm.value.search || undefined,
      page: this.page,
      limit: this.limit,
      sortBy: this.currentSortBy,
      orderBy: this.currentOrderBy
    };

    this.studentService.getStudents(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.students = response.data.students;
            this.students = response.data.students.map((student: any) => ({
              ...student,
              guardianCount: student.guardians?.length ?? 0
            }));
            this.pagination = response.data.pagination;
            this.total = response.data.pagination.totalElements;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchForm.patchValue({ search: value });
  }

  // Table component event handlers
  onSearch(searchQuery: string): void {
    this.searchForm.patchValue({ search: searchQuery });
    this.page = 1; // Reset to first page on search
    this.loadStudents();
  }

  onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
    this.currentSortBy = sortChange.field;
    this.currentOrderBy = sortChange.order;
    this.page = 1; // Reset to first page on sort
    this.loadStudents();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadStudents();
  }

  onLimitChange(newLimit: any): void {
    this.limit = newLimit;
    this.page = 1; // Reset to first page when limit changes
    this.loadStudents();
  }

  onTableAction(event: { action: string; item: any }): void {
    switch (event.action) {
      case 'view':
        this.viewStudentDetails(event.item);
        break;
      case 'edit':
        this.editStudent(event.item);
        break;
      case 'delete':
        this.deleteStudent(event.item);
        break;
    }
  }

  addNewStudent(): void {
    this.selectedStudent = null;
    this.selectedStudentId = null;
    this.showStudentForm = true;
  }

  editStudent(student: Student): void {
    this.selectedStudentId = student.id;
    this.showStudentForm = true;
  }

  viewStudentDetails(student: Student): void {
    console.log('Viewing student details:', student);
  }

  deleteStudent(student: Student): void {
    this.selectedStudent = student;
    this.confirmDialogData = {
      title: 'Delete Student',
      message: `Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };
    
    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    if (!this.selectedStudent) return;
    
    if (this.confirmDialogData.type === 'danger') {
      // Delete operation
      this.studentService.deleteStudent(this.selectedStudent.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadStudents();
            this.closeConfirmDialog();
          }
        });
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedStudent = null;
  }

  onStudentFormClose(): void {
    this.showStudentForm = false;
    this.selectedStudent = null;
    this.selectedStudentId = null;
  }

  onStudentFormSuccess(): void {
    this.onStudentFormClose();
    this.loadStudents();
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }

  getGenderDisplay(gender: string): string {
    switch (gender) {
      case 'MALE':
        return 'Male';
      case 'FEMALE':
        return 'Female';
      case 'OTHER':
        return 'Other';
      default:
        return gender;
    }
  }
}
