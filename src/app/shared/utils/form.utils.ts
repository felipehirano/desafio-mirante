import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { extractOnlyNumbers } from './input.utils';
import { formatCurrencyFromRawValue, parsePtBRCurrency } from './currency.utils';

const DEFAULT_FIELD_ERROR_MESSAGE = 'Campo invalido.';

function getControl(formGroup: AbstractControl | null, fieldName: string): AbstractControl | null {
  return formGroup?.get(fieldName) ?? null;
}

function shouldShowErrors(control: AbstractControl | null, submitAttempted: boolean): boolean {
  if (!control) {
    return false;
  }

  return control.touched || control.dirty || submitAttempted;
}

export function applyOnlyNumbersInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = extractOnlyNumbers(input.value);
}

export function applyOnlyNumbersInputWithControl(
  event: Event,
  formGroup: AbstractControl | null
): void {
  const input = event.target as HTMLInputElement;
  const sanitizedValue = extractOnlyNumbers(input.value);
  input.value = sanitizedValue;

  const fieldName = input.getAttribute('formControlName');
  if (fieldName) {
    formGroup?.get(fieldName)?.setValue(sanitizedValue, { emitEvent: false });
  }
}

export function applyCurrencyInput(event: Event, formGroup: AbstractControl | null): void {
  const input = event.target as HTMLInputElement;
  const onlyDigits = input.value.replace(/\D/g, '');

  if (parseInt(onlyDigits, 10) === 0) {
    input.value = '';
    const fieldName = input.getAttribute('formControlName');
    if (fieldName) {
      formGroup?.get(fieldName)?.setValue('', { emitEvent: false });
    }
    return;
  }

  const formatted = formatCurrencyFromRawValue(input.value);
  input.value = formatted;

  const fieldName = input.getAttribute('formControlName');
  if (fieldName) {
    formGroup?.get(fieldName)?.setValue(formatted, { emitEvent: false });
  }
}

export function getFormFieldErrorMessage(formGroup: AbstractControl | null, fieldName: string): string {
  return getFormFieldErrorMessageWithState(formGroup, fieldName);
}

export function hasFormFieldError(formGroup: AbstractControl | null, fieldName: string): boolean {
  return hasFormFieldErrorWithState(formGroup, fieldName);
}

export function getFormFieldErrorMessageWithState(
  formGroup: AbstractControl | null,
  fieldName: string,
  submitAttempted: boolean = false
): string {
  const control = getControl(formGroup, fieldName);
  if (!control || !control.errors || !shouldShowErrors(control, submitAttempted)) {
    return '';
  }

  if (control.errors['required']) {
    return 'Campo obrigatorio.';
  }

  if (control.errors['pattern']) {
    return 'Informe apenas numeros.';
  }

  if (control.errors['positiveValue']) {
    return 'Informe um valor maior que zero.';
  }

  if (control.errors['contaCorrenteNotFound']) {
    return 'Conta corrente nao encontrada.';
  }

  if (control.errors['maxlength']) {
    return `Maximo de ${control.errors['maxlength'].requiredLength} caracteres.`;
  }

  return DEFAULT_FIELD_ERROR_MESSAGE;
}

export function hasFormFieldErrorWithState(
  formGroup: AbstractControl | null,
  fieldName: string,
  submitAttempted: boolean = false
): boolean {
  const control = getControl(formGroup, fieldName);
  return !!(control?.errors && shouldShowErrors(control, submitAttempted));
}

export function isFormFieldBlank(formGroup: AbstractControl | null, fieldName: string): boolean {
  const value = getControl(formGroup, fieldName)?.value;
  return String(value ?? '').trim().length === 0;
}

export function createPositiveCurrencyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parsePtBRCurrency(control.value ?? '');
    if (!control.value) {
      return null;
    }

    return value > 0 ? null : { positiveValue: true };
  };
}
