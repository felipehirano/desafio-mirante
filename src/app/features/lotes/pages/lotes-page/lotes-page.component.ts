import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LotesTableComponent } from '../../components/lotes-table/lotes-table.component';
import { LotesFilterComponent } from '../../components/lotes-filter/lotes-filter.component';
import { ActionButtonConfig, ActionsComponent } from '../../../../shared/components';
import { LoteFilter } from '../../../../shared/models/lote-filter.model';
import { LotesFilterFacade } from '../../services/lotes-filter.facade';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-lotes-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    LotesTableComponent,
    LotesFilterComponent,
    ActionsComponent
  ],
  providers: [LoteService, LotesFilterFacade],
  templateUrl: './lotes-page.component.html',
  styleUrls: ['./lotes-page.component.scss']
})
export class LotesPageComponent {
  readonly selectedCount = signal<number>(0);

  readonly lotesActions: ActionButtonConfig[] = [
    { id: 'confirmar', label: 'CONFIRMAR', ariaLabel: 'Confirmar lote' },
    { id: 'enviar', label: 'ENVIAR', ariaLabel: 'Enviar lote' },
    { id: 'visualizar-justificativa', label: 'VISUALIZAR JUSTIFICATIVA', ariaLabel: 'Visualizar justificativa do lote' },
    { id: 'incluir', label: 'INCLUIR', variant: 'primary', ariaLabel: 'Incluir novo lote' },
    {
      id: 'alterar',
      label: 'ALTERAR',
      requiresSingleSelection: true,
      ariaLabel: 'Alterar lote',
      ariaLabelWhenDisabled: 'Alterar lote (selecione um lote)'
    },
    {
      id: 'excluir',
      label: 'EXCLUIR',
      requiresSingleSelection: true,
      ariaLabel: 'Excluir lote',
      ariaLabelWhenDisabled: 'Excluir lote (selecione um lote)'
    },
    {
      id: 'visualizar',
      label: 'VISUALIZAR',
      requiresSingleSelection: true,
      ariaLabel: 'Visualizar lote',
      ariaLabelWhenDisabled: 'Visualizar lote (selecione um lote)'
    }
  ];

  constructor(
    readonly facade: LotesFilterFacade
  ) {}

  onFilterChange(filter: LoteFilter): void {
    this.facade.searchLotes(filter);
  }

  onSelectionChange(count: number): void {
    this.selectedCount.set(count);
  }

  onAction(action: string): void {
    console.log('Ação executada:', action);
  }
}
