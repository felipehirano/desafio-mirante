import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LotesTableComponent } from '../../components/lotes-table/lotes-table.component';
import { LotesFilterComponent } from '../../components/lotes-filter/lotes-filter.component';
import { LoteFilter } from '../../../../shared/models/lote-filter.model';

@Component({
  selector: 'app-lotes-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    LotesTableComponent,
    LotesFilterComponent
  ],
  templateUrl: './lotes-page.component.html',
  styleUrls: ['./lotes-page.component.scss']
})
export class LotesPageComponent {
  currentFilter = signal<LoteFilter>({});

  onFilterChange(filter: LoteFilter): void {
    this.currentFilter.set(filter);
  }
}
