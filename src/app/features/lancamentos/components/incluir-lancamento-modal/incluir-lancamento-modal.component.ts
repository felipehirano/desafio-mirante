import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef, Inject, inject } from '@angular/core';
import {
  applyCurrencyInput,
  parsePtBRCurrency
} from '../../../../shared/utils';
import { ContaCorrenteMock } from '../../mocks/contas-correntes.mock';
import { ContaCorrenteSearchModalComponent } from '../conta-corrente-search-modal/conta-corrente-search-modal.component';
import { EventoCscSearchModalComponent } from '../evento-csc-search-modal/evento-csc-search-modal.component';
import { Lancamento } from '../../models/lancamento.model';

interface IncluirLancamentoModalData {
  loteId?: number;
}

@Component({
  selector: 'app-incluir-lancamento-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './incluir-lancamento-modal.component.html',
  styleUrls: ['./incluir-lancamento-modal.component.scss']
})
export class IncluirLancamentoModalComponent {
  private readonly hostElement = inject(ElementRef<HTMLElement>);

  readonly historicoOptions: string[] = [
    'Lancamento Manual',
    'Ajuste de Conta',
    'Correcao Operacional'
  ];

  readonly paOptions: string[] = ['Cooperativa', 'PA 0001', 'PA 0002'];
  readonly titularEncontrado = signal<string>('');
  readonly descricaoEventoCsc = signal<string>('');
  readonly submitAttempted = signal(false);
  readonly requiredFieldOrder: string[] = [
    'contaCorrente',
    'valor',
    'historico',
    'documento',
    'pa',
    'complHistoricoCsc'
  ];

  readonly form = this.fb.group({
    contaCorrente: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    valor: ['', [Validators.required, this.positiveCurrencyValidator()]],
    historico: ['', [Validators.required]],
    estorno: [false],
    documento: ['', [Validators.required, Validators.maxLength(30)]],
    descricao: ['', [Validators.maxLength(255)]],
    situacao: [{ value: 'Pendente', disabled: true }],
    pa: ['Cooperativa', [Validators.required]],
    idEventoCsc: [{ value: '', disabled: true }, [Validators.pattern(/^\d+$/)]],
    complHistoricoCsc: ['', [Validators.required, Validators.maxLength(255)]],
    situacaoCsc: [{ value: 'Aguardando Processamento CCO', disabled: true }],
    idDocCsc: ['', [Validators.pattern(/^\d*$/)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<IncluirLancamentoModalComponent, Lancamento>,
    @Inject(MAT_DIALOG_DATA) readonly data: IncluirLancamentoModalData
  ) {}

  onBuscarContaCorrente(): void {
    const dialogRef = this.dialog.open(ContaCorrenteSearchModalComponent, {
      width: 'min(900px, 96vw)',
      maxHeight: '88vh',
      autoFocus: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe((selectedConta: ContaCorrenteMock | undefined) => {
      if (!selectedConta) {
        return;
      }

      this.form.patchValue({ contaCorrente: selectedConta.numero });
      this.form.get('contaCorrente')?.markAsTouched();
      this.titularEncontrado.set(selectedConta.titular);
    });
  }

  onValorInput(event: Event): void {
    applyCurrencyInput(event, this.form);
  }

  onBuscarEventoCsc(): void {
    const dialogRef = this.dialog.open(EventoCscSearchModalComponent, {
      width: 'min(900px, 96vw)',
      maxHeight: '88vh',
      autoFocus: false,
      data: {}
    });

    dialogRef.afterClosed().subscribe(selectedEvento => {
      if (!selectedEvento) {
        return;
      }

      this.form.patchValue({ idEventoCsc: selectedEvento.idEvento });
      this.descricaoEventoCsc.set(selectedEvento.descricao);
    });
  }

  onConfirmar(): void {
    if (!this.validateFormForSubmit()) {
      return;
    }

    this.dialogRef.close(this.createLancamentoFromForm());
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !(control.touched || control.dirty || this.submitAttempted())) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Campo obrigatorio.';
    }

    if (control.errors?.['pattern']) {
      return 'Informe apenas numeros.';
    }

    if (control.errors?.['positiveValue']) {
      return 'Informe um valor maior que zero.';
    }

    if (control.errors?.['maxlength']) {
      return `Maximo de ${control.errors['maxlength'].requiredLength} caracteres.`;
    }

    return 'Campo invalido.';
  }

  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.errors && (control.touched || control.dirty || this.submitAttempted()));
  }

  get isConfirmDisabled(): boolean {
    const contaCorrente = (this.form.getRawValue().contaCorrente ?? '').trim();
    return contaCorrente.length === 0;
  }

  private validateFormForSubmit(): boolean {
    this.submitAttempted.set(true);
    this.form.markAllAsTouched();
    const raw = this.form.getRawValue();

    if (!raw.contaCorrente?.trim()) {
      this.focusFirstInvalidField();
      return false;
    }

    if (this.form.invalid) {
      this.focusFirstInvalidField();
      return false;
    }

    return true;
  }

  private focusFirstInvalidField(): void {
    for (const fieldName of this.requiredFieldOrder) {
      const control = this.form.get(fieldName);
      if (!control || control.disabled || control.valid) {
        continue;
      }

      const controlElement =
        (this.hostElement.nativeElement.querySelector(`[formControlName="${fieldName}"]`) as HTMLElement | null) ??
        (this.hostElement.nativeElement.querySelector(`#${fieldName}`) as HTMLElement | null);

      controlElement?.focus();
      return;
    }
  }

  private createLancamentoFromForm(): Lancamento {
    const raw = this.form.getRawValue();
    return {
      id: 1,
      pa: raw.pa ?? '',
      contaCorrente: raw.contaCorrente ?? '',
      titular: this.titularEncontrado(),
      valor: parsePtBRCurrency(raw.valor ?? ''),
      historico: raw.historico ?? '',
      estorno: !!raw.estorno,
      documento: raw.documento ?? '',
      descricao: raw.descricao ?? '',
      situacao: raw.situacao ?? 'Pendente'
    };
  }

  private positiveCurrencyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parsePtBRCurrency(control.value ?? '');
      if (!control.value) {
        return null;
      }

      return value > 0 ? null : { positiveValue: true };
    };
  }

}
