import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { IncluirLancamentoModalComponent } from '../../components/incluir-lancamento-modal/incluir-lancamento-modal.component';
import { LancamentosStoreService } from '../../services/lancamentos-store.service';

type LancamentosPageAction = 'duplicar' | 'visualizar' | 'incluir' | 'alterar' | 'excluir';

@Component({
  selector: 'app-lancamentos-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './lancamentos-page.component.html',
  styleUrls: ['./lancamentos-page.component.scss']
})
export class LancamentosPageComponent {
  selectedLancamentoId: number | null = null;

  readonly displayedColumns: string[] = [
    'id',
    'contaCorrente',
    'titular',
    'historico',
    'valor',
    'situacao'
  ];

  constructor(
    readonly store: LancamentosStoreService,
    private readonly dialog: MatDialog
  ) {}

  get isSingleSelected(): boolean {
    return this.selectedLancamentoId !== null;
  }

  onSelectLancamento(lancamentoId: number): void {
    this.selectedLancamentoId = this.selectedLancamentoId === lancamentoId ? null : lancamentoId;
  }

  onAction(action: LancamentosPageAction): void {
    if (action === 'incluir') {
      const dialogRef = this.dialog.open(IncluirLancamentoModalComponent, {
        width: 'min(820px, 96vw)',
        maxHeight: '90vh',
        autoFocus: false,
        data: {}
      });

      dialogRef.afterClosed().subscribe(lancamento => {
        if (lancamento) {
          this.store.addLancamento(lancamento);
        }
      });
      return;
    }

    console.log('Ação executada:', action);
  }
}
