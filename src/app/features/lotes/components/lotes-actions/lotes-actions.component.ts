import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export type LoteAction = 'confirmar' | 'enviar' | 'visualizar-justificativa' | 'incluir' | 'alterar' | 'excluir' | 'visualizar';

@Component({
  selector: 'app-lotes-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './lotes-actions.component.html',
  styleUrls: ['./lotes-actions.component.scss']
})
export class LotesActionsComponent {
  @Input() selectedCount: number = 0;
  @Output() action = new EventEmitter<LoteAction>();

  get isSingleSelected(): boolean {
    return this.selectedCount === 1;
  }

  onAction(actionType: LoteAction): void {
    this.action.emit(actionType);
  }
}
