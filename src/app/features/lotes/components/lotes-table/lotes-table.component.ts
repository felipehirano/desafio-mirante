import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { Lote } from '../../../../core/models/lote.model';

@Component({
  selector: 'app-lotes-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CustomPaginationComponent
  ],
  templateUrl: './lotes-table.component.html',
  styleUrls: ['./lotes-table.component.scss']
})
export class LotesTableComponent implements OnInit, OnChanges {
  @Input() lotes: Lote[] = [];
  @Input() isLoading: boolean = false;

  readonly allColumns: string[] = [
    'checkbox',
    'id',
    'dataEntrada',
    'valor',
    'quantidadeLancamentos',
    'usuarioRegistro',
    'usuarioAprovacao',
    'situacao',
    'dataHoraSituacao'
  ];

  readonly emptyColumns: string[] = [
    'id',
    'dataEntrada',
    'valor',
    'quantidadeLancamentos',
    'usuarioRegistro',
    'usuarioAprovacao',
    'situacao',
    'dataHoraSituacao'
  ];

  get displayedColumns(): string[] {
    return this.paginatedData.length > 0 ? this.allColumns : this.emptyColumns;
  }

  readonly skeletonRows = Array(5);

  dataSource = new MatTableDataSource<Lote>([]);
  selectedRows: Set<number> = new Set();

  // Paginação customizada
  currentPage = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  totalPages = 0;
  paginatedData: Lote[] = [];
  visiblePageNumbers: number[] = [];

  ngOnInit(): void {
    this.updateTableData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lotes']) {
      this.updateTableData();
    }
  }

  private updateTableData(): void {
    this.dataSource.data = this.lotes;
    this.currentPage = 0; // Reset para primeira página
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.dataSource.data.length / this.pageSize);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.data.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.selectedRows.clear();
    this.updatePaginatedData();
  }

  onFirstPageClick(): void {
    this.onPageChange(0);
  }

  onLastPageClick(): void {
    this.onPageChange(this.totalPages - 1);
  }

  onPreviousPageClick(): void {
    this.onPageChange(this.currentPage - 1);
  }

  onNextPageClick(): void {
    this.onPageChange(this.currentPage + 1);
  }

  toggleRow(id: number): void {
    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id);
    } else {
      this.selectedRows.add(id);
    }
  }

  isRowSelected(id: number): boolean {
    return this.selectedRows.has(id);
  }

  toggleAllRows(): void {
    const allPageSelected = this.paginatedData.every(lote => this.selectedRows.has(lote.id));
    if (allPageSelected) {
      this.paginatedData.forEach(lote => this.selectedRows.delete(lote.id));
    } else {
      this.paginatedData.forEach(lote => this.selectedRows.add(lote.id));
    }
  }

  isAllRowsSelected(): boolean {
    return this.paginatedData.length > 0 && this.paginatedData.every(lote => this.selectedRows.has(lote.id));
  }
}
