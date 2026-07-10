import { AbstractControl } from '@angular/forms';
import { extractOnlyNumbers } from './input.utils';
import { formatCurrencyFromRawValue } from './currency.utils';

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
  const control = formGroup?.get(fieldName);
  if (control?.errors) {
    if (control.errors['maxlength']) {
      return `Maximo de ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    if (control.errors['pattern']) {
      return 'Formato invalido';
    }
  }
  return '';
}

export function hasFormFieldError(formGroup: AbstractControl | null, fieldName: string): boolean {
  const control = formGroup?.get(fieldName);
  return !!(control?.errors && (control.dirty || control.touched));
}
