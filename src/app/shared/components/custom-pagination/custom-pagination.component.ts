import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent implements OnChanges {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() visiblePageNumbers: number[] = [];
  @Input() isDisabled = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() firstPageClick = new EventEmitter<void>();
  @Output() lastPageClick = new EventEmitter<void>();
  @Output() previousPageClick = new EventEmitter<void>();
  @Output() nextPageClick = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['totalPages']) {
      this.updateVisiblePages();
    }
  }

  updateVisiblePages(): void {
    const maxVisiblePages = 5;
    const startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages);
    const adjustedStartPage = Math.max(0, endPage - maxVisiblePages);

    this.visiblePageNumbers = Array.from(
      { length: endPage - adjustedStartPage },
      (_, i) => adjustedStartPage + i
    );
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToFirstPage(): void {
    if (this.currentPage > 0) {
      this.firstPageClick.emit();
    }
  }

  goToLastPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.lastPageClick.emit();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.previousPageClick.emit();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.nextPageClick.emit();
    }
  }

  canGoToPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  canGoToNextPage(): boolean {
    return this.currentPage < this.totalPages - 1;
  }
}
