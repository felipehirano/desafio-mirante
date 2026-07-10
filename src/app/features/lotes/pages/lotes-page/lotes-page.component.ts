import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LotesTableComponent } from '../../components/lotes-table/lotes-table.component';
import { LotesFilterComponent } from '../../components/lotes-filter/lotes-filter.component';
import { LotesActionsComponent, LoteAction } from '../../components/lotes-actions/lotes-actions.component';
import { LoteFilter } from '../../../../shared/models/lote-filter.model';
import { LotesFilterFacade } from '../../services/lotes-filter.facade';
import { LoteService } from '../../services/lote.service';
import { MatDialog } from '@angular/material/dialog';
import { IncluirLancamentoModalComponent } from '../../components/incluir-lancamento-modal/incluir-lancamento-modal.component';

@Component({
  selector: 'app-lotes-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    LotesTableComponent,
    LotesFilterComponent,
    LotesActionsComponent
  ],
  providers: [LoteService, LotesFilterFacade],
  templateUrl: './lotes-page.component.html',
  styleUrls: ['./lotes-page.component.scss']
})
export class LotesPageComponent {
  readonly selectedCount = signal<number>(0);

  constructor(
    readonly facade: LotesFilterFacade,
    private readonly dialog: MatDialog
  ) {}

  onFilterChange(filter: LoteFilter): void {
    this.facade.searchLotes(filter);
  }

  onSelectionChange(count: number): void {
    this.selectedCount.set(count);
  }

  onAction(action: LoteAction): void {
    if (action === 'incluir') {
      this.dialog.open(IncluirLancamentoModalComponent, {
        width: 'min(820px, 96vw)',
        maxHeight: '90vh',
        autoFocus: false,
        data: {}
      });
      return;
    }

    console.log('Ação executada:', action);
  }
}
