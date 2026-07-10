import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  applyOnlyNumbersInputWithControl,
  applyCurrencyInput,
  createPositiveCurrencyValidator,
  getFormFieldErrorMessageWithState,
  hasFormFieldErrorWithState,
  isFormFieldBlank,
  parsePtBRCurrency
} from '../../../../shared/utils';
import { CONTAS_CORRENTES_MOCK, ContaCorrenteMock } from '../../mocks/contas-correntes.mock';
import { ContaCorrenteSearchModalComponent } from '../conta-corrente-search-modal/conta-corrente-search-modal.component';
import { EventoCscSearchModalComponent } from '../evento-csc-search-modal/evento-csc-search-modal.component';
import { Lancamento } from '../../models/lancamento.model';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly contaCorrenteSearchSubject = new Subject<string>();

  readonly historicoOptions: string[] = [
    'Lancamento Manual',
    'Ajuste de Conta',
    'Correcao Operacional'
  ];

  readonly paOptions: string[] = ['Cooperativa', 'PA 0001', 'PA 0002'];
  readonly titularEncontrado = signal<string>('');
  readonly descricaoEventoCsc = signal<string>('');
  readonly contaCorrenteSearching = signal(false);
  readonly contaCorrenteValidada = signal(false);
  readonly submitAttempted = signal(false);

  readonly form = this.fb.group({
    contaCorrente: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    valor: ['', [Validators.required, createPositiveCurrencyValidator()]],
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
    private readonly dialogRef: MatDialogRef<IncluirLancamentoModalComponent, Lancamento>
  ) {
    this.initializeContaCorrenteSearch();
  }

  onBuscarContaCorrente(): void {
    if (this.contaCorrenteSearching()) {
      return;
    }

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
      this.clearContaCorrenteLookupError();
      this.form.updateValueAndValidity();
      this.contaCorrenteValidada.set(true);
      this.contaCorrenteSearching.set(false);
      this.titularEncontrado.set(selectedConta.titular);
    });
  }

  onContaCorrenteInput(event: Event): void {
    applyOnlyNumbersInputWithControl(event, this.form);
    const contaCorrente = String(this.form.get('contaCorrente')?.value ?? '').trim();
    this.contaCorrenteValidada.set(false);
    this.contaCorrenteSearching.set(true);
    this.titularEncontrado.set('');
    this.contaCorrenteSearchSubject.next(contaCorrente);
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
    return getFormFieldErrorMessageWithState(this.form, fieldName, this.submitAttempted());
  }

  hasError(fieldName: string): boolean {
    return hasFormFieldErrorWithState(this.form, fieldName, this.submitAttempted());
  }

  get isConfirmDisabled(): boolean {
    return this.form.invalid || isFormFieldBlank(this.form, 'contaCorrente') || !this.contaCorrenteValidada();
  }

  private validateFormForSubmit(): boolean {
    this.submitAttempted.set(true);
    this.form.markAllAsTouched();

    if (isFormFieldBlank(this.form, 'contaCorrente')) {
      return false;
    }

    if (!this.contaCorrenteValidada()) {
      this.setContaCorrenteLookupError();
      return false;
    }

    if (this.form.invalid) {
      return false;
    }

    return true;
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

  private initializeContaCorrenteSearch(): void {
    this.contaCorrenteSearchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(contaCorrente => {
        this.resolveContaCorrente(contaCorrente);
      });
  }

  private resolveContaCorrente(contaCorrente: string): void {
    if (!contaCorrente) {
      this.contaCorrenteSearching.set(false);
      this.contaCorrenteValidada.set(false);
      this.titularEncontrado.set('');
      this.clearContaCorrenteLookupError();
      return;
    }

    const contaEncontrada = CONTAS_CORRENTES_MOCK.find(conta => conta.numero === contaCorrente);
    if (contaEncontrada) {
      this.contaCorrenteSearching.set(false);
      this.contaCorrenteValidada.set(true);
      this.titularEncontrado.set(contaEncontrada.titular);
      this.clearContaCorrenteLookupError();
      return;
    }

    this.contaCorrenteSearching.set(false);
    this.contaCorrenteValidada.set(false);
    this.titularEncontrado.set('');
    this.setContaCorrenteLookupError();
  }

  private setContaCorrenteLookupError(): void {
    const contaCorrenteControl = this.form.get('contaCorrente');
    if (!contaCorrenteControl) {
      return;
    }

    const currentErrors = contaCorrenteControl.errors ?? {};
    contaCorrenteControl.setErrors({
      ...currentErrors,
      contaCorrenteNotFound: true
    });
  }

  private clearContaCorrenteLookupError(): void {
    const contaCorrenteControl = this.form.get('contaCorrente');
    if (!contaCorrenteControl?.errors) {
      return;
    }

    const { contaCorrenteNotFound, ...remainingErrors } = contaCorrenteControl.errors;
    const hasOtherErrors = Object.keys(remainingErrors).length > 0;
    contaCorrenteControl.setErrors(hasOtherErrors ? remainingErrors : null);
  }

}
