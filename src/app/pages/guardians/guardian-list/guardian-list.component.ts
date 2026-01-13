import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Guardian, GuardianPagination, GuardianFilters } from '../guardian.model';
import { GuardianService } from '../guardian.service';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog';
import { GuardianFormComponent } from '../guardian-form/guardian-form.component';

@Component({
  selector: 'app-guardian-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppTableComponent, GuardianFormComponent, ConfirmDialogComponent],
  templateUrl: './guardian-list.component.html',
  styleUrls: ['./guardian-list.component.scss']
})
export class GuardianListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  guardians: Guardian[] = [];
  pagination: GuardianPagination | null = null;
  loading = false;

  searchForm: FormGroup;
  currentSortBy = 'firstName';
  currentOrderBy: 'asc' | 'desc' = 'asc';

  // Modal and Dialog states
  showGuardianForm = false;
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'info'
  };
  selectedGuardian: Guardian | null = null;

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
    { key: 'guardianUid', label: 'Guardian ID', sortable: true, exportable: true },
    { key: 'firstName', label: 'First Name', sortable: true, exportable: true },
    { key: 'lastName', label: 'Last Name', sortable: true, exportable: true },
    { key: 'email', label: 'Email', sortable: true, exportable: true },
    { key: 'mobileNumber', label: 'Phone', sortable: true, exportable: true },
    { key: 'nationalId', label: 'National ID', sortable: true, exportable: true },
    { key: 'gender', label: 'Gender', exportable: true },
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
      onClick: (guardian: any) => this.viewGuardianDetails(guardian)
    },
    {
      key: 'edit',
      label: 'Edit Guardian',
      icon: 'edit',
      title: 'Edit Guardian',
      onClick: (guardian: any) => this.editGuardian(guardian)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      title: 'Delete',
      onClick: (guardian: any) => this.deleteGuardian(guardian)
    }
  ];

  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private guardianService: GuardianService,
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
    this.loadGuardians();

    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({ page: 1 }, { emitEvent: false });
        this.loadGuardians();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGuardians(): void {
    this.loading = true;

    const filters: GuardianFilters = {
      search: this.searchForm.value.search || undefined,
      page: this.page,
      limit: this.limit,
      sortBy: this.currentSortBy,
      orderBy: this.currentOrderBy
    };

    this.guardianService.getGuardians(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.guardians = response.data.guardians;
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
    this.loadGuardians();
  }

  onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
    this.currentSortBy = sortChange.field;
    this.currentOrderBy = sortChange.order;
    this.page = 1; // Reset to first page on sort
    this.loadGuardians();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadGuardians();
  }

  onLimitChange(newLimit: any): void {
    this.limit = newLimit;
    this.page = 1; // Reset to first page when limit changes
    this.loadGuardians();
  }

  onTableAction(event: { action: string; item: any }): void {
    switch (event.action) {
      case 'view':
        this.viewGuardianDetails(event.item);
        break;
      case 'edit':
        this.editGuardian(event.item);
        break;
      case 'delete':
        this.deleteGuardian(event.item);
        break;
    }
  }

  addNewGuardian(): void {
    this.selectedGuardian = null;
    this.showGuardianForm = true;
  }

  editGuardian(guardian: Guardian): void {
    this.selectedGuardian = guardian;
    this.showGuardianForm = true;
  }

  viewGuardianDetails(guardian: Guardian): void {
    console.log('Viewing guardian details:', guardian);
  }

  deleteGuardian(guardian: Guardian): void {
    this.selectedGuardian = guardian;
    this.confirmDialogData = {
      title: 'Delete Guardian',
      message: `Are you sure you want to delete ${guardian.firstName} ${guardian.lastName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };
    
    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    if (!this.selectedGuardian) return;
    
    if (this.confirmDialogData.type === 'danger') {
      // Delete operation
      this.guardianService.deleteGuardian(this.selectedGuardian.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadGuardians();
            this.closeConfirmDialog();
          }
        });
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedGuardian = null;
  }

  onGuardianFormClose(): void {
    this.showGuardianForm = false;
    this.selectedGuardian = null;
  }

  onGuardianFormSuccess(): void {
    this.loadGuardians();
    this.onGuardianFormClose();
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
}
