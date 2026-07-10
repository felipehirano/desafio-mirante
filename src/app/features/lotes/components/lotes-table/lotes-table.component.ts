import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { Lote } from '../../../../core/models/lote.model';
import { LotesTableFacade } from '../../services/lotes-table.facade';

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
  providers: [LotesTableFacade],
  templateUrl: './lotes-table.component.html',
  styleUrls: ['./lotes-table.component.scss']
})
export class LotesTableComponent implements OnChanges {
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

  readonly skeletonRows = Array(5);
  dataSource = new MatTableDataSource<Lote>([]);

  readonly facade = this.tableService;

  get displayedColumns(): string[] {
    return this.facade.paginatedData().length > 0 ? this.allColumns : this.emptyColumns;
  }

  constructor(private tableService: LotesTableFacade) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lotes']) {
      this.facade.setLotes(this.lotes);
      this.dataSource.data = this.lotes;
    }
  }

  onPageChange(page: number): void {
    this.facade.changePage(page);
  }

  onFirstPageClick(): void {
    this.facade.goToFirstPage();
  }

  onLastPageClick(): void {
    this.facade.goToLastPage();
  }

  onPreviousPageClick(): void {
    this.facade.goToPreviousPage();
  }

  onNextPageClick(): void {
    this.facade.goToNextPage();
  }

  toggleRow(id: number): void {
    this.facade.toggleRow(id);
  }

  isRowSelected(id: number): boolean {
    return this.facade.isRowSelected(id);
  }

  toggleAllRows(): void {
    this.facade.toggleAllRows();
  }

  isAllRowsSelected(): boolean {
    return this.facade.isAllRowsSelected();
  }
}

