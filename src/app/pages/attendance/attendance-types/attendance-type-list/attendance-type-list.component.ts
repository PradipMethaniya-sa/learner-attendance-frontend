import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AttendanceType, AttendanceTypePagination, AttendanceTypeFilters } from '../attendance-type.model';
import { AttendanceTypeService } from '../attendance-type.service';
import { AppTableComponent, TableColumn, TableAction } from '../../../../shared/components/app-table';
import { AttendanceTypeFormComponent } from '../attendance-type-form/attendance-type-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog';

@Component({
  selector: 'app-attendance-type-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppTableComponent, AttendanceTypeFormComponent, ConfirmDialogComponent],
  templateUrl: './attendance-type-list.component.html',
  styleUrls: ['./attendance-type-list.component.scss']
})
export class AttendanceTypeListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  attendanceTypes: AttendanceType[] = [];
  pagination: AttendanceTypePagination | null = null;
  loading = false;

  searchForm: FormGroup;
  currentSortBy = 'createdAt';
  currentOrderBy: 'asc' | 'desc' = 'desc';

  // Modal and Dialog states
  showAttendanceTypeForm = false;
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'info'
  };
  selectedAttendanceType: AttendanceType | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, exportable: true },
    { key: 'description', label: 'Description', exportable: true },
    { 
      key: 'lateArrivalThreshold', 
      label: 'Late Arrival', 
      sortable: false, 
      exportable: true,
      customTemplate: (item: AttendanceType) => {
        return `<span class="text-sm">${item.lateArrivalThreshold}</span>`;
      }
    },
    { 
      key: 'earlyArrivalThreshold', 
      label: 'Early Departure', 
      sortable: false, 
      exportable: true,
      customTemplate: (item: AttendanceType) => {
        return `<span class="text-sm">${item.earlyArrivalThreshold}</span>`;
      }
    },
    { 
      key: 'isActive', 
      label: 'Status',
      type: 'badge',
      badgeClass: (value: boolean) => {
        switch (value) {
          case true: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          case false: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
      },
      exportable: true
    },
    { key: 'actions', label: 'Actions', actions: true, exportable: false }
  ];

  // Table actions
  tableActions: TableAction[] = [
    {
      key: 'edit',
      label: 'Edit Attendance Type',
      icon: 'edit',
      title: 'Edit Attendance Type',
      onClick: (attendanceType: any) => this.editAttendanceType(attendanceType)
    },
    {
      key: 'toggle',
      label: 'Toggle Status',
      icon: 'pause',
      title: 'Toggle Status',
      onClick: (attendanceType: any) => this.toggleAttendanceTypeStatus(attendanceType),
      getIcon: (attendanceType: any) => this.getToggleIcon(attendanceType),
      getLabel: (attendanceType: any) => this.getToggleLabel(attendanceType),
      getTitle: (attendanceType: any) => this.getToggleTitle(attendanceType)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      title: 'Delete',
      onClick: (attendanceType: any) => this.deleteAttendanceType(attendanceType)
    }
  ];

  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private attendanceTypeService: AttendanceTypeService,
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
    this.loadAttendanceTypes();

    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({ page: 1 }, { emitEvent: false });
        this.loadAttendanceTypes();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAttendanceTypes(): void {
    this.loading = true;

    const filters: AttendanceTypeFilters = {
      search: this.searchForm.value.search || undefined,
      page: this.page,
      limit: this.limit,
      sortBy: this.currentSortBy,
      orderBy: this.currentOrderBy
    };

    this.attendanceTypeService.getAttendanceTypes(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.attendanceTypes = response.data.attendanceTypes;
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
    this.loadAttendanceTypes();
  }

  onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
    this.currentSortBy = sortChange.field;
    this.currentOrderBy = sortChange.order;
    this.page = 1; // Reset to first page on sort
    this.loadAttendanceTypes();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadAttendanceTypes();
  }

  onLimitChange(newLimit: any): void {
    this.limit = newLimit;
    this.page = 1; // Reset to first page when limit changes
    this.loadAttendanceTypes();
  }

  onTableAction(event: { action: string; item: any }): void {
    switch (event.action) {
      case 'edit':
        this.editAttendanceType(event.item);
        break;
      case 'toggle':
        this.toggleAttendanceTypeStatus(event.item);
        break;
      case 'delete':
        this.deleteAttendanceType(event.item);
        break;
    }
  }

  addNewAttendanceType(): void {
    this.selectedAttendanceType = null;
    this.showAttendanceTypeForm = true;
  }

  editAttendanceType(attendanceType: AttendanceType): void {
    this.selectedAttendanceType = attendanceType;
    this.showAttendanceTypeForm = true;
  }

  toggleAttendanceTypeStatus(attendanceType: AttendanceType): void {
    this.selectedAttendanceType = attendanceType;
    const action = attendanceType.status === 'ACTIVE' ? 'deactivate' : 'activate';
    const actionText = attendanceType.status === 'ACTIVE' ? 'Deactivate' : 'Activate';
    
    this.confirmDialogData = {
      title: `${actionText} Attendance Type`,
      message: `Are you sure you want to ${action} ${attendanceType.name}?`,
      confirmText: actionText,
      cancelText: 'Cancel',
      type: attendanceType.status === 'ACTIVE' ? 'warning' : 'info'
    };
    
    this.showConfirmDialog = true;
  }

  deleteAttendanceType(attendanceType: AttendanceType): void {
    this.selectedAttendanceType = attendanceType;
    this.confirmDialogData = {
      title: 'Delete Attendance Type',
      message: `Are you sure you want to delete ${attendanceType.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };
    
    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    if (!this.selectedAttendanceType) return;
    
    if (this.confirmDialogData.type === 'danger') {
      // Delete operation
      this.attendanceTypeService.deleteAttendanceType(this.selectedAttendanceType.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadAttendanceTypes();
            this.closeConfirmDialog();
          }
        });
    } else {
      // Activate/Deactivate operation
      const isActive = this.confirmDialogData.type === 'info';
      const updateRequest = {
        name: this.selectedAttendanceType.name,
        description: this.selectedAttendanceType.description,
        lateArrivalThreshold: this.selectedAttendanceType.lateArrivalThreshold,
        earlyArrivalThreshold: this.selectedAttendanceType.earlyArrivalThreshold,
        isActive: isActive
      };
      
      this.attendanceTypeService.updateAttendanceType(this.selectedAttendanceType.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadAttendanceTypes();
            this.closeConfirmDialog();
          }
        });
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedAttendanceType = null;
  }

  onAttendanceTypeFormClose(): void {
    this.showAttendanceTypeForm = false;
    this.selectedAttendanceType = null;
  }

  onAttendanceTypeFormSuccess(): void {
    this.loadAttendanceTypes();
    this.onAttendanceTypeFormClose();
  }

  getToggleIcon(attendanceType: AttendanceType): string {
    return attendanceType.status === 'ACTIVE' ? 'pause' : 'play_arrow';
  }

  getToggleLabel(attendanceType: AttendanceType): string {
    return attendanceType.status === 'ACTIVE' ? 'Deactivate' : 'Activate';
  }

  getToggleTitle(attendanceType: AttendanceType): string {
    return attendanceType.status === 'ACTIVE' ? 'Deactivate Attendance Type' : 'Activate Attendance Type';
  }
}
