import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SchoolClass, ClassPagination, ClassFilters } from '../class.model';
import { ClassService } from '../class.service';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table';
import { ClassFormComponent } from '../class-form/class-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppTableComponent, ClassFormComponent, ConfirmDialogComponent],
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  classes: SchoolClass[] = [];
  pagination: ClassPagination | null = null;
  loading = false;

  searchForm: FormGroup;
  currentSortBy = 'name';
  currentOrderBy: 'asc' | 'desc' = 'asc';

  // Modal and Dialog states
  showClassForm = false;
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'info'
  };
  selectedClass: SchoolClass | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Class Name', sortable: true },
    { key: 'parentClassName', label: 'Parent Class' },
    { key: 'schoolName', label: 'School' },
    { key: 'hasChildren', label: 'Has Streams' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', actions: true }
  ];

  // Table actions
  tableActions: TableAction[] = [
    {
      key: 'edit',
      label: 'Edit Class',
      icon: 'edit',
      title: 'Edit Class',
      onClick: (classItem: any) => this.editClass(classItem)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      title: 'Delete',
      onClick: (classItem: any) => this.deleteClass(classItem)
    }
  ];

  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private classService: ClassService,
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
    this.loadClasses();

    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({ page: 1 }, { emitEvent: false });
        this.loadClasses();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClasses(): void {
    this.loading = true;

    const filters: ClassFilters = {
      search: this.searchForm.value.search || undefined,
      page: this.page,
      limit: this.limit,
      sortBy: this.currentSortBy,
      orderBy: this.currentOrderBy
    };

    this.classService.getClasses(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.classes = response.data.schoolClasses;
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
    this.loadClasses();
  }

  onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
    this.currentSortBy = sortChange.field;
    this.currentOrderBy = sortChange.order;
    this.page = 1; // Reset to first page on sort
    this.loadClasses();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadClasses();
  }

  onLimitChange(newLimit: any): void {
    this.limit = newLimit;
    this.page = 1; // Reset to first page when limit changes
    this.loadClasses();
  }

  onTableAction(event: { action: string; item: any }): void {
    switch (event.action) {
      case 'edit':
        this.editClass(event.item);
        break;
      case 'delete':
        this.deleteClass(event.item);
        break;
    }
  }

  addNewClass(): void {
    this.selectedClass = null;
    this.showClassForm = true;
  }

  editClass(classItem: SchoolClass): void {
    this.selectedClass = classItem;
    this.showClassForm = true;
  }

  deleteClass(classItem: SchoolClass): void {
    this.selectedClass = classItem;
    this.confirmDialogData = {
      title: 'Delete Class',
      message: `Are you sure you want to delete ${classItem.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };
    
    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    if (!this.selectedClass) return;
    
    // Delete operation
    this.classService.deleteClass(this.selectedClass.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.loadClasses();
          this.closeConfirmDialog();
        }
      });
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedClass = null;
  }

  onClassFormClose(): void {
    this.showClassForm = false;
    this.selectedClass = null;
  }

  onClassFormSuccess(): void {
    this.loadClasses();
    this.onClassFormClose();
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

  formatHasChildren(hasChildren: boolean): string {
    return hasChildren ? 'Yes' : 'No';
  }
}
