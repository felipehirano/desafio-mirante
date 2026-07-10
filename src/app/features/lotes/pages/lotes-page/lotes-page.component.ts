import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LotesTableComponent } from '../../components/lotes-table/lotes-table.component';
import { LotesFilterComponent } from '../../components/lotes-filter/lotes-filter.component';
import { LoteFilter } from '../../../../shared/models/lote-filter.model';
import { LotesFacade } from '../../../../core/services/lotes.facade';
import { LoteService } from '../../../../core/services/lote.service';

@Component({
  selector: 'app-lotes-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    LotesTableComponent,
    LotesFilterComponent
  ],
  providers: [LoteService, LotesFacade],
  templateUrl: './lotes-page.component.html',
  styleUrls: ['./lotes-page.component.scss']
})
export class LotesPageComponent {
  readonly facade = this.lotesf;

  constructor(private lotesf: LotesFacade) {}

  onFilterChange(filter: LoteFilter): void {
    this.facade.searchLotes(filter);
  }
}
