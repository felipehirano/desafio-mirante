import { Injectable, signal } from '@angular/core';
import { Lancamento } from '../models/lancamento.model';

@Injectable({
  providedIn: 'root'
})
export class LancamentosStoreService {
  private readonly lancamentosState = signal<Lancamento[]>([]);

  readonly lancamentos = this.lancamentosState.asReadonly();

  addLancamento(lancamento: Lancamento): void {
    this.lancamentosState.update(items => [...items, { ...lancamento, id: this.generateNextId(items) }]);
  }

  private generateNextId(current: Lancamento[]): number {
    if (current.length === 0) {
      return 1;
    }

    return Math.max(...current.map(item => item.id)) + 1;
  }
}
