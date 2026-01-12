import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { School, SchoolPagination, SchoolFilters } from '../school.model';
import { SchoolService } from '../school.service';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table';
import { SchoolFormComponent } from '../school-form/school-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppTableComponent, SchoolFormComponent, ConfirmDialogComponent],
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  schools: School[] = [];
  pagination: SchoolPagination | null = null;
  loading = false;

  searchForm: FormGroup;
  currentSortBy = 'registrationNo';
  currentOrderBy: 'asc' | 'desc' = 'asc';

  // Modal and Dialog states
  showSchoolForm = false;
  showConfirmDialog = false;
  confirmDialogData: ConfirmDialogData = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Cancel',
    type: 'info'
  };
  selectedSchool: School | null = null;

  // Table configuration
  columns: TableColumn[] = [
    { 
      key: 'logoUrl', 
      label: 'Logo', 
      type: 'image',
      imageKey: 'logoUrl',
      imageFallback: '/assets/images/default-school-logo.png',
      imageClass: 'w-10 h-10 rounded-lg object-cover'
    },
    { key: 'name', label: 'School Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'mobileNo', label: 'Phone', sortable: true },
    { key: 'registrationNo', label: 'Registration No', sortable: true },
    { key: 'districtName', label: 'District' },
    { key: 'parishName', label: 'Parish' },
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
      }
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
      onClick: (school: any) => this.viewSchoolDetails(school)
    },
    {
      key: 'edit',
      label: 'Edit School',
      icon: 'edit',
      title: 'Edit School',
      onClick: (school: any) => this.editSchool(school)
    },
    {
      key: 'toggle',
      label: 'Toggle Status',
      icon: 'pause',
      title: 'Toggle Status',
      onClick: (school: any) => this.toggleSchoolStatus(school),
      getIcon: (school: any) => this.getToggleIcon(school),
      getLabel: (school: any) => this.getToggleLabel(school),
      getTitle: (school: any) => this.getToggleTitle(school)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      title: 'Delete',
      onClick: (school: any) => this.deleteSchool(school)
    }
  ];

  page = 1;
  limit = 10;
  total = 0;

  constructor(
    private schoolService: SchoolService,
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
    this.loadSchools();

    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchForm.patchValue({ page: 1 }, { emitEvent: false });
        this.loadSchools();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSchools(): void {
    this.loading = true;

    const filters: SchoolFilters = {
      search: this.searchForm.value.search || undefined,
      page: this.page,
      limit: this.limit,
      sortBy: this.currentSortBy,
      orderBy: this.currentOrderBy
    };

    this.schoolService.getSchools(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.schools = response.data.schools;
            this.pagination = response.data.pagination;
            this.total = response.data.pagination.total;
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
    this.loadSchools();
  }

  onSort(sortChange: { field: string; order: 'asc' | 'desc' }): void {
    this.currentSortBy = sortChange.field;
    this.currentOrderBy = sortChange.order;
    this.page = 1; // Reset to first page on sort
    this.loadSchools();
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadSchools();
  }

  onLimitChange(newLimit: any): void {
    this.limit = newLimit;
    this.page = 1; // Reset to first page when limit changes
    this.loadSchools();
  }

  onTableAction(event: { action: string; item: any }): void {
    switch (event.action) {
      case 'view':
        this.viewSchoolDetails(event.item);
        break;
      case 'edit':
        this.editSchool(event.item);
        break;
      case 'toggle':
        this.toggleSchoolStatus(event.item);
        break;
      case 'delete':
        this.deleteSchool(event.item);
        break;
    }
  }

  addNewSchool(): void {
    this.selectedSchool = null;
    this.showSchoolForm = true;
  }

  editSchool(school: School): void {
    this.selectedSchool = school;
    this.showSchoolForm = true;
  }

  viewSchoolDetails(school: School): void {
    console.log('Viewing school details:', school);
  }

  toggleSchoolStatus(school: School): void {
    this.selectedSchool = school;
    const action = school.status === 'ACTIVE' ? 'deactivate' : 'activate';
    const actionText = school.status === 'ACTIVE' ? 'Deactivate' : 'Activate';
    
    this.confirmDialogData = {
      title: `${actionText} School`,
      message: `Are you sure you want to ${action} ${school.name}?`,
      confirmText: actionText,
      cancelText: 'Cancel',
      type: school.status === 'ACTIVE' ? 'warning' : 'info'
    };
    
    this.showConfirmDialog = true;
  }

  deleteSchool(school: School): void {
    this.selectedSchool = school;
    this.confirmDialogData = {
      title: 'Delete School',
      message: `Are you sure you want to delete ${school.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    };
    
    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    if (!this.selectedSchool) return;
    
    if (this.confirmDialogData.type === 'danger') {
      // Delete operation
      this.schoolService.deleteSchool(this.selectedSchool.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadSchools();
            this.closeConfirmDialog();
          }
        });
    } else {
      // Activate/Deactivate operation
      const isActivate = this.confirmDialogData.type === 'info';
      const operation = isActivate ? 
        this.schoolService.activateSchool(this.selectedSchool.id) :
        this.schoolService.deactivateSchool(this.selectedSchool.id);
      
      operation.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadSchools();
            this.closeConfirmDialog();
          }
        });
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedSchool = null;
  }

  onSchoolFormClose(): void {
    this.showSchoolForm = false;
    this.selectedSchool = null;
  }

  onSchoolFormSuccess(): void {
    this.loadSchools();
    this.onSchoolFormClose();
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

  getToggleIcon(school: School): string {
    return school.status === 'ACTIVE' ? 'pause' : 'play_arrow';
  }

  getToggleLabel(school: School): string {
    return school.status === 'ACTIVE' ? 'Deactivate' : 'Activate';
  }

  getToggleTitle(school: School): string {
    return school.status === 'ACTIVE' ? 'Deactivate School' : 'Activate School';
  }
}
