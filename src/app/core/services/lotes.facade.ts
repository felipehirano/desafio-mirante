import { Injectable, signal, computed } from '@angular/core';
import { Lote } from '../models/lote.model';
import { LoteFilter } from '../../shared/models/lote-filter.model';
import { LoteService } from './lote.service';

@Injectable({
  providedIn: 'root'
})
export class LotesFacade {
  // Signals para estado
  private readonly filterState = signal<LoteFilter>({});
  private readonly lotesState = signal<Lote[]>([]);
  private readonly isLoadingState = signal(false);

  // Signals públicos (read-only)
  readonly filter = this.filterState.asReadonly();
  readonly lotes = this.lotesState.asReadonly();
  readonly isLoading = this.isLoadingState.asReadonly();

  // Computed signals
  readonly hasFilter = computed(() =>
    Object.values(this.filterState()).some(value =>
      value !== null && value !== undefined && value !== ''
    )
  );

  constructor(private loteService: LoteService) {}

  /**
   * Aplica um novo filtro e carrega os dados
   */
  searchLotes(filter: LoteFilter): void {
    this.filterState.set(filter);
    this.loadLotes();
  }

  /**
   * Limpa o filtro e os dados
   */
  clearFilter(): void {
    this.filterState.set({});
    this.lotesState.set([]);
    this.isLoadingState.set(false);
  }

  /**
   * Carrega os lotes baseado no filtro atual
   */
  private loadLotes(): void {
    this.isLoadingState.set(true);

    this.loteService.getLotes(this.filterState()).subscribe(lotes => {
      this.lotesState.set(lotes);
      this.isLoadingState.set(false);
    });
  }
}
