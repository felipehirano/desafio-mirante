/**
 * Utilitários para formatação de valores monetários em padrão pt-BR
 */

/**
 * Formata um número para o padrão de moeda brasileira
 * @param value - Número a ser formatado
 * @returns String formatada (ex: "1.234,56")
 */
export function formatCurrencyPtBR(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Converte centavos para reais e formata como moeda
 * @param centavos - Valor em centavos (ex: 123456 = R$ 1.234,56)
 * @returns String formatada em moeda pt-BR
 */
export function centavosToFormattedCurrency(centavos: number): string {
  const reais = centavos / 100;
  return formatCurrencyPtBR(reais);
}

/**
 * Extrai dígitos de um valor e converte para moeda formatada
 * @param rawValue - String com números e caracteres especiais
 * @returns String formatada em moeda pt-BR
 */
export function formatCurrencyFromRawValue(rawValue: string): string {
  const onlyNumbers = rawValue.replace(/\D/g, '');

  if (!onlyNumbers) {
    return '';
  }

  return centavosToFormattedCurrency(parseInt(onlyNumbers, 10));
}
