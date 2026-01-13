import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Staff, StaffPagination, StaffFilters } from '../staff.model';
import { StaffService } from '../staff.service';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table';
import { StaffFormComponent } from '../staff-form/staff-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppTableComponent, StaffFormComponent, ConfirmDialogComponent],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  staffs: Staff[] = [];
  pagination: StaffPagination | null = null;
  loading = false;

  searchForm: FormGroup;
  currentSortBy = 'firstName';
  currentOrderBy: 'asc' | 'desc' = 'asc';

  // Modal and Dialog states
  showStaffForm = false;
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'info'
  };
  selectedStaff: Staff | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { 
      key: 'avatarUrl', 
      label: 'Photo', 
      type: 'image',
      imageKey: 'avatarUrl',
      imageFallback: '/assets/images/default-avatar.png',
      imageClass: 'w-10 h-10 rounded-full object-cover'
    },
    { key: 'firstName', label: 'First Name', sortable: true, exportable: true },
    { key: 'lastName', label: 'Last Name', sortable: true, exportable: true },
    { key: 'email', label: 'Email', sortable: true, exportable: true },
    { key: 'mobileNumber', label: 'Phone', sortable: true, exportable: true },
    { key: 'nationalId', label: 'National ID', exportable: true },
    { key: 'gender', label: 'Gender', exportable: true },
    { key: 'teacherRegNo', label: 'Teacher Reg No', sortable: true, exportable: true },
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
      onClick: (staff: any) => this.viewStaffDetails(staff)
    },
    {
      key: 'edit',
      label: 'Edit Staff',
      icon: 'edit',
      title: 'Edit Staff',
      onClick: (staff: any) => this.editStaff(staff)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      title: 'Delete',
      onClick: (staff: any) => this.deleteStaff(staff)
    }
  ];

  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private staffService: StaffService,
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
    this.loadStaffs();

    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({ page: 1 }, { emitEvent: false });
        this.loadStaffs();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStaffs(): void {
    this.loading = true;

    const filters: StaffFilters = {
      search: this.searchForm.value.search || undefined,
      page: this.page,
      limit: this.limit,
      sortBy: this.currentSortBy,
      orderBy: this.currentOrderBy
    };

    this.staffService.getStaffs(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.staffs = response.data.schoolStaffs;
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
    this.loadStaffs();
  }

  onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
    this.currentSortBy = sortChange.field;
    this.currentOrderBy = sortChange.order;
    this.page = 1; // Reset to first page on sort
    this.loadStaffs();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadStaffs();
  }

  onLimitChange(newLimit: any): void {
    this.limit = newLimit;
    this.page = 1; // Reset to first page when limit changes
    this.loadStaffs();
  }

  onTableAction(event: { action: string; item: any }): void {
    switch (event.action) {
      case 'view':
        this.viewStaffDetails(event.item);
        break;
      case 'edit':
        this.editStaff(event.item);
        break;
      case 'delete':
        this.deleteStaff(event.item);
        break;
    }
  }

  addNewStaff(): void {
    this.selectedStaff = null;
    this.showStaffForm = true;
  }

  editStaff(staff: Staff): void {
    this.selectedStaff = staff;
    this.showStaffForm = true;
  }

  viewStaffDetails(staff: Staff): void {
    console.log('Viewing staff details:', staff);
  }

  deleteStaff(staff: Staff): void {
    this.selectedStaff = staff;
    this.confirmDialogData = {
      title: 'Delete Staff',
      message: `Are you sure you want to delete ${staff.firstName} ${staff.lastName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };
    
    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    if (!this.selectedStaff) return;
    
    this.staffService.deleteStaff(this.selectedStaff.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.loadStaffs();
          this.closeConfirmDialog();
        }
      });
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedStaff = null;
  }

  onStaffFormClose(): void {
    this.showStaffForm = false;
    this.selectedStaff = null;
  }

  onStaffFormSuccess(): void {
    this.loadStaffs();
    this.onStaffFormClose();
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
