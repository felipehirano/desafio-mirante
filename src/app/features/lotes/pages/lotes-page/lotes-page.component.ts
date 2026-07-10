import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LotesTableComponent } from '../../components/lotes-table/lotes-table.component';
import { LotesFilterComponent } from '../../components/lotes-filter/lotes-filter.component';
import { LotesActionsComponent, LoteAction } from '../../components/lotes-actions/lotes-actions.component';
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
    LotesActionsComponent
  ],
  providers: [LoteService, LotesFilterFacade],
  templateUrl: './lotes-page.component.html',
  styleUrls: ['./lotes-page.component.scss']
})
export class LotesPageComponent {
  readonly facade = this.lotesf;
  readonly selectedCount = signal<number>(0);

  constructor(private lotesf: LotesFilterFacade) {}

  onFilterChange(filter: LoteFilter): void {
    this.facade.searchLotes(filter);
  }

  onSelectionChange(count: number): void {
    this.selectedCount.set(count);
  }

  onAction(action: LoteAction): void {
    console.log('Ação executada:', action);
  }
}
