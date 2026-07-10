import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

export type ActionButtonVariant = 'default' | 'primary';
export type ActionButtonAlign = 'left' | 'right';

export interface ActionButtonConfig {
  id: string;
  label: string;
  variant?: ActionButtonVariant;
  align?: ActionButtonAlign;
  requiresSingleSelection?: boolean;
  ariaLabel?: string;
  ariaLabelWhenDisabled?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  @Input() selectedCount: number = 0;
  @Input() actions: ActionButtonConfig[] = [];
  @Input() ariaLabel: string = 'Ações';
  @Output() action = new EventEmitter<string>();

  get isSingleSelected(): boolean {
    return this.selectedCount === 1;
  }

  get leftActions(): ActionButtonConfig[] {
    return this.actions.filter(action => action.align === 'left');
  }

  get rightActions(): ActionButtonConfig[] {
    return this.actions.filter(action => action.align !== 'left');
  }

  get isSplitLayout(): boolean {
    return this.leftActions.length > 0;
  }

  isActionDisabled(action: ActionButtonConfig): boolean {
    return !!action.requiresSingleSelection && !this.isSingleSelected || !!action.disabled;
  }

  isPrimaryAction(action: ActionButtonConfig): boolean {
    return action.variant === 'primary';
  }

  getActionAriaLabel(action: ActionButtonConfig): string {
    if (this.isActionDisabled(action) && action.ariaLabelWhenDisabled) {
      return action.ariaLabelWhenDisabled;
    }

    return action.ariaLabel ?? action.label;
  }

  onAction(actionType: string): void {
    this.action.emit(actionType);
  }
}
