import { Injectable, computed, signal } from '@angular/core';
import { Lote } from '../../../core/models/lote.model';

@Injectable()
export class LotesTableFacade {
  private readonly lotesState = signal<Lote[]>([]);
  private readonly currentPageState = signal<number>(0);
  private readonly pageSizeState = signal<number>(5);
  private readonly selectedRowsState = signal<Set<number>>(new Set());

  readonly lotes = this.lotesState.asReadonly();
  readonly currentPage = this.currentPageState.asReadonly();
  readonly pageSize = this.pageSizeState.asReadonly();
  readonly selectedRows = this.selectedRowsState.asReadonly();

  readonly totalPages = computed(() => {
    return Math.ceil(this.lotesState().length / this.pageSizeState());
  });

  readonly paginatedData = computed(() => {
    const startIndex = this.currentPageState() * this.pageSizeState();
    const endIndex = startIndex + this.pageSizeState();
    return this.lotesState().slice(startIndex, endIndex);
  });

  readonly selectedCount = computed(() => this.selectedRowsState().size);

  readonly isAllRowsSelected = computed(() => {
    const paginatedData = this.paginatedData();
    return paginatedData.length > 0 && paginatedData.every(lote => this.selectedRowsState().has(lote.id));
  });

  constructor() {}

  setLotes(lotes: Lote[]): void {
    this.lotesState.set(lotes);
    this.resetPage();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPageState.set(page);
      this.clearSelection();
    }
  }

  goToFirstPage(): void {
    this.changePage(0);
  }

  goToLastPage(): void {
    this.changePage(this.totalPages() - 1);
  }

  goToPreviousPage(): void {
    this.changePage(this.currentPageState() - 1);
  }

  goToNextPage(): void {
    this.changePage(this.currentPageState() + 1);
  }

  toggleRow(id: number): void {
    const selectedSet = new Set(this.selectedRowsState());
    if (selectedSet.has(id)) {
      selectedSet.delete(id);
    } else {
      selectedSet.add(id);
    }
    this.selectedRowsState.set(selectedSet);
  }

  isRowSelected(id: number): boolean {
    return this.selectedRowsState().has(id);
  }

  toggleAllRows(): void {
    const selectedSet = new Set(this.selectedRowsState());
    const paginatedData = this.paginatedData();

    if (this.isAllRowsSelected()) {
      paginatedData.forEach(lote => selectedSet.delete(lote.id));
    } else {
      paginatedData.forEach(lote => selectedSet.add(lote.id));
    }

    this.selectedRowsState.set(selectedSet);
  }

  private clearSelection(): void {
    this.selectedRowsState.set(new Set());
  }

  private resetPage(): void {
    this.currentPageState.set(0);
  }
}
