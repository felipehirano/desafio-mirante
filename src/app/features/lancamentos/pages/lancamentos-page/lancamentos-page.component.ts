import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ActionButtonConfig, ActionsComponent } from '../../../../shared/components';
import { IncluirLancamentoModalComponent } from '../../components/incluir-lancamento-modal/incluir-lancamento-modal.component';
import { LancamentosStoreService } from '../../services/lancamentos-store.service';

type LancamentosPageAction = 'duplicar' | 'visualizar' | 'incluir' | 'alterar' | 'excluir';

@Component({
  selector: 'app-lancamentos-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, ActionsComponent],
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

  readonly lancamentosActions: ActionButtonConfig[] = [
    {
      id: 'duplicar',
      label: 'DUPLICAR',
      align: 'left',
      requiresSingleSelection: true,
      ariaLabel: 'Duplicar lançamento',
      ariaLabelWhenDisabled: 'Duplicar lançamento (selecione um lançamento)'
    },
    {
      id: 'visualizar',
      label: 'VISUALIZAR',
      align: 'right',
      requiresSingleSelection: true,
      ariaLabel: 'Visualizar lançamento',
      ariaLabelWhenDisabled: 'Visualizar lançamento (selecione um lançamento)'
    },
    {
      id: 'incluir',
      label: 'INCLUIR',
      align: 'right',
      variant: 'primary',
      ariaLabel: 'Incluir lançamento'
    },
    {
      id: 'alterar',
      label: 'ALTERAR',
      align: 'right',
      requiresSingleSelection: true,
      ariaLabel: 'Alterar lançamento',
      ariaLabelWhenDisabled: 'Alterar lançamento (selecione um lançamento)'
    },
    {
      id: 'excluir',
      label: 'EXCLUIR',
      align: 'right',
      requiresSingleSelection: true,
      ariaLabel: 'Excluir lançamento',
      ariaLabelWhenDisabled: 'Excluir lançamento (selecione um lançamento)'
    }
  ];

  constructor(
    readonly store: LancamentosStoreService,
    private readonly dialog: MatDialog
  ) {}

  onSelectLancamento(lancamentoId: number): void {
    this.selectedLancamentoId = this.selectedLancamentoId === lancamentoId ? null : lancamentoId;
  }

  onAction(action: string): void {
    if (!this.isLancamentosAction(action)) {
      return;
    }

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

  private isLancamentosAction(action: string): action is LancamentosPageAction {
    return ['duplicar', 'visualizar', 'incluir', 'alterar', 'excluir'].includes(action);
  }
}
