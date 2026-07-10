import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-simple-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './simple-pagination.component.html',
  styleUrls: ['./simple-pagination.component.scss']
})
export class SimplePaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 1;
  @Input() isDisabled = false;

  @Output() previousClick = new EventEmitter<void>();
  @Output() nextClick = new EventEmitter<void>();

  get currentPageLabel(): number {
    return this.currentPage + 1;
  }

  get isPreviousDisabled(): boolean {
    return this.isDisabled || this.currentPage <= 0;
  }

  get isNextDisabled(): boolean {
    return this.isDisabled || this.currentPage >= this.totalPages - 1;
  }

  onPreviousClick(): void {
    if (this.isPreviousDisabled) {
      return;
    }

    this.previousClick.emit();
  }

  onNextClick(): void {
    if (this.isNextDisabled) {
      return;
    }

    this.nextClick.emit();
  }
}
