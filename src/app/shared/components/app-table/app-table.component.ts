import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from './table-column.interface';
import { PaginationComponent } from '../pagination';
import { mkConfig, generateCsv, download } from 'export-to-csv';

export interface TableAction {
  key: string;
  label: string;
  icon: string;
  onClick: (item: any) => void;
  title?: string;
  disabled?: (item: any) => boolean;
  class?: string;
  getIcon?: (item: any) => string;
  getLabel?: (item: any) => string;
  getTitle?: (item: any) => string;
}

export interface SortChange {
  field: string;
  order: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss']
})
export class AppTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() page: number = 1;
  @Input() limit: number = 10;
  @Input() total: number = 0;
  @Input() loading: boolean = false;
  @Input() searchQuery: string = '';
  @Input() currentSort: SortChange = { field: '', order: 'asc' };
  @Input() pagination: any = null;
  @Input() actions: TableAction[] = [];
  @Input() csvFileName: string = 'export';
  @Input() showExportButton: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<SortChange>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();

  constructor(){
    console.log('Actions', this.actions);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onSortClick(column: TableColumn): void {
    if (!column.sortable) return;

    let order: 'asc' | 'desc' = 'asc';
    
    if (this.currentSort.field === column.key) {
      order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
    }

    this.sortChange.emit({ field: column.key, order });
  }

  getSortIcon(columnKey: string): string {
    if (this.currentSort.field !== columnKey) {
      return 'sort';
    }
    return this.currentSort.order === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onPageClick(pageNumber: number): void {
    if (pageNumber !== this.page) {
      this.pageChange.emit(pageNumber);
    }
  }

  // Remove pagination logic since we're using the built-in component
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getCellValue(item: any, key: string): string {
    return item[key] || '-';
  }

  getImageUrl(item: any, column: TableColumn): string {

    if (column.imageKey) {
      return item[column.imageKey] || column.imageFallback || '';
    }
    return item[column.key] || column.imageFallback || '';
  }

  getBadgeClass(item: any, column: TableColumn): string {
    if (column.badgeClass) {
      return column.badgeClass(item[column.key]);
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }

  formatDate(value: string | Date, format: string = 'short'): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  }

  renderCustomCell(item: any, column: TableColumn): string {
    if (column.customTemplate) {
      return column.customTemplate(item);
    }
    return '';
  }

  onActionClick(action: TableAction, item: any): void {
    if (action.disabled && action.disabled(item)) {
      return;
    }
    this.actionClick.emit({ action: action.key, item });
    action.onClick(item);
  }
  exportToCsv(): void {
    // Filter columns that are explicitly marked as exportable: true
    const exportableColumns = this.columns.filter(column => 
      column.exportable === true && 
      !column.actions
    );
    
    if (exportableColumns.length === 0 || this.data.length === 0) {
      return;
    }

    const csvData = this.data.map(item => {
      const row: any = {};
      exportableColumns.forEach(column => {
        let value = item[column.key];
        
        // Handle null/undefined values
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Handle different column types
        if (column.type === 'date' && value) {
          value = this.formatDate(value);
        } else if (typeof value === 'object' && value !== null && column.type !== 'image') {
          value = JSON.stringify(value);
        }
        
        // Use the column key as the property name for CSV
        row[column.key] = value;
      });
      return row;
    });
    console.log('CSV data:', csvData);

    try {
      // Step 1: Configure CSV with proper columnHeaders format
      const columnHeaders = exportableColumns.map(column => ({
        key: column.key,
        displayLabel: column.label
      }));
      
      const csvConfig = mkConfig({ 
        filename: this.csvFileName,
        columnHeaders: columnHeaders,
        useKeysAsHeaders: false
      });

      // Step 2: Generate CSV string
      const csvString = generateCsv(csvConfig)(csvData);

      // Step 3: Download the CSV file
      download(csvConfig)(csvString);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  }
}
