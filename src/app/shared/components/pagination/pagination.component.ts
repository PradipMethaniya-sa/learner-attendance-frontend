import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PaginationData {
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() pagination: PaginationData | null = null;
  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  pageSizeOptions = [10, 25, 50, 100];

  selectedLimit: string = '10';

  // Update selectedLimit when pagination input changes
  ngOnChanges(): void {
    if (this.pagination?.limit) {
      this.selectedLimit = this.pagination.limit.toString();
    }
  }

  get paginationButtons(): number[] {
    if (!this.pagination) return [];
    
    const currentPage = this.pagination.page;
    const totalPages = this.pagination.totalPages;
    const buttons: number[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          buttons.push(i);
        }
      }
    }
    
    return buttons;
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onLimitChange(newLimit: string): void {
    this.limitChange.emit(Number(newLimit));
    this.pageChange.emit(1);
  }
}
