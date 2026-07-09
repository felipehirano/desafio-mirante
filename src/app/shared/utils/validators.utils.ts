/**
 * Utilitários para validações customizadas com Reactive Forms
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador customizado para comparar datas de range (mín e máx)
 * Garante que dataMin <= dataMax
 * @param minFieldName - Nome do campo de data mínima
 * @param maxFieldName - Nome do campo de data máxima
 * @returns Função validadora para FormGroup
 */
export function createDateRangeValidator(
  minFieldName: string,
  maxFieldName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const minDate = formGroup.get(minFieldName)?.value;
    const maxDate = formGroup.get(maxFieldName)?.value;

    if (minDate && maxDate && minDate > maxDate) {
      formGroup.get(maxFieldName)?.setErrors({ invalidDateRange: true });
      return { invalidDateRange: true };
    }

    return null;
  };
}

/**
 * Cria um filtro de data mínima para datepicker
 * Previne seleção de datas anteriores ao valor especificado
 * @param minDate - Data mínima permitida
 * @returns Função que retorna true se a data é válida
 */
export function createMinDateFilter(minDate: Date | null): (date: Date | null) => boolean {
  return (date: Date | null): boolean => {
    if (!date || !minDate) return true;
    return date >= minDate;
  };
}

/**
 * Cria um filtro de data máxima para datepicker
 * Previne seleção de datas posteriores ao valor especificado
 * @param maxDate - Data máxima permitida
 * @returns Função que retorna true se a data é válida
 */
export function createMaxDateFilter(maxDate: Date | null): (date: Date | null) => boolean {
  return (date: Date | null): boolean => {
    if (!date || !maxDate) return true;
    return date <= maxDate;
  };
}

/**
 * Factory para criar validadores de range de datas
 * Vincula dois campos de data (mín e máx) ao FormGroup
 * @param formGroup - FormGroup para extrair valores
 * @param minFieldName - Nome do campo de data mínima
 * @returns Função de filtro para datepicker mín
 */
export function createDynamicMinDateFilter(
  formGroup: AbstractControl | null,
  minFieldName: string
): (date: Date | null) => boolean {
  return (date: Date | null): boolean => {
    if (!date || !formGroup) return true;
    const minDate = formGroup.get(minFieldName)?.value;
    if (!minDate) return true;
    return date >= minDate;
  };
}

/**
 * Factory para criar validadores de range de datas
 * Vincula dois campos de data (mín e máx) ao FormGroup
 * @param formGroup - FormGroup para extrair valores
 * @param maxFieldName - Nome do campo de data máxima
 * @returns Função de filtro para datepicker máx
 */
export function createDynamicMaxDateFilter(
  formGroup: AbstractControl | null,
  maxFieldName: string
): (date: Date | null) => boolean {
  return (date: Date | null): boolean => {
    if (!date || !formGroup) return true;
    const maxDate = formGroup.get(maxFieldName)?.value;
    if (!maxDate) return true;
    return date <= maxDate;
  };
}
