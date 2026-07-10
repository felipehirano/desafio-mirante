import { Injectable, signal, computed } from '@angular/core';
import { Lote } from '../models/lote.model';
import { LoteFilter } from '../../shared/models/lote-filter.model';
import { LoteService } from './lote.service';

@Injectable()
export class LotesFacade {
  private readonly filterState = signal<LoteFilter>({});
  private readonly lotesState = signal<Lote[]>([]);
  private readonly isLoadingState = signal(false);

  readonly filter = this.filterState.asReadonly();
  readonly lotes = this.lotesState.asReadonly();
  readonly isLoading = this.isLoadingState.asReadonly();

  readonly hasFilter = computed(() =>
    Object.values(this.filterState()).some(value =>
      value !== null && value !== undefined && value !== ''
    )
  );

  constructor(private loteService: LoteService) {}

  searchLotes(filter: LoteFilter): void {
    this.filterState.set(filter);
    this.loadLotes();
  }

  clearFilter(): void {
    this.filterState.set({});
    this.lotesState.set([]);
    this.isLoadingState.set(false);
  }

  private loadLotes(): void {
    this.isLoadingState.set(true);

    this.loteService.getLotes(this.filterState()).subscribe(lotes => {
      this.lotesState.set(lotes);
      this.isLoadingState.set(false);
    });
  }
}
