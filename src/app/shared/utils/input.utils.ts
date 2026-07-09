/**
 * Utilitários para manipulação e limpeza de valores de input
 */

/**
 * Remove todos os caracteres que não são dígitos (0-9)
 * @param value - String a ser processada
 * @returns String contendo apenas dígitos
 */
export function extractOnlyNumbers(value: string): string {
  return value.replace(/[^\d]/g, '');
}

/**
 * Remove todos os caracteres que não são dígitos ou ponto decimal
 * Útil para inputs de valores decimais
 * @param value - String a ser processada
 * @returns String contendo apenas dígitos e ponto
 */
export function extractNumbersAndDecimal(value: string): string {
  return value.replace(/[^\d.]/g, '');
}

/**
 * Formata um input HTML para aceitar apenas números
 * @param inputElement - Elemento HTML input
 */
export function formatInputOnlyNumbers(inputElement: HTMLInputElement): void {
  inputElement.value = extractOnlyNumbers(inputElement.value);
}

/**
 * Formata um input HTML para aceitar apenas números e ponto decimal
 * @param inputElement - Elemento HTML input
 */
export function formatInputNumbersAndDecimal(inputElement: HTMLInputElement): void {
  inputElement.value = extractNumbersAndDecimal(inputElement.value);
}
