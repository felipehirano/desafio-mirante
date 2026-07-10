import { Lote } from '../../features/lotes/models/lote.model';
import { LoteFilter } from '../models/lote-filter.model';
import { parsePtBRCurrency } from './currency.utils';

/**
 * Aplica filtros a um array de lotes
 * @param lotes - Array de lotes a filtrar
 * @param filter - Objeto com critérios de filtro
 * @returns Array de lotes filtrados
 */
export function applyLoteFilters(lotes: Lote[], filter: LoteFilter): Lote[] {
  return lotes.filter(lote => {
    // Filtro por instituição responsável
    if (filter.instituicaoResp && filter.instituicaoResp !== '') {
      if (!(lote as any).instituicaoResp?.toUpperCase().includes(filter.instituicaoResp.toUpperCase())) {
        return false;
      }
    }

    // Filtro por instituição
    if (filter.instituicao && filter.instituicao !== '') {
      if (!(lote as any).instituicao?.toUpperCase().includes(filter.instituicao.toUpperCase())) {
        return false;
      }
    }

    // Filtro por ID mínimo
    if (filter.idLoteMin !== null && filter.idLoteMin !== undefined && filter.idLoteMin !== '') {
      const minId = parseInt(filter.idLoteMin.toString(), 10);
      if (lote.id < minId) return false;
    }

    // Filtro por ID máximo
    if (filter.idLoteMax !== null && filter.idLoteMax !== undefined && filter.idLoteMax !== '') {
      const maxId = parseInt(filter.idLoteMax.toString(), 10);
      if (lote.id > maxId) return false;
    }

    // Filtro por valor mínimo
    if (filter.valorLoteMin !== null && filter.valorLoteMin !== undefined && filter.valorLoteMin !== '') {
      const minValue = parsePtBRCurrency(filter.valorLoteMin.toString());
      if (lote.valor < minValue) return false;
    }

    // Filtro por valor máximo
    if (filter.valorLoteMax !== null && filter.valorLoteMax !== undefined && filter.valorLoteMax !== '') {
      const maxValue = parsePtBRCurrency(filter.valorLoteMax.toString());
      if (lote.valor > maxValue) return false;
    }

    // Filtro por situação
    if (filter.situacao && filter.situacao !== 'TODAS') {
      if (lote.situacao.toUpperCase() !== filter.situacao.toUpperCase()) return false;
    }

    // Filtro por data de entrada mínima
    if (filter.dataEntradaMin) {
      const minDate = new Date(filter.dataEntradaMin);
      if (new Date(lote.dataEntrada) < minDate) return false;
    }

    // Filtro por data de entrada máxima
    if (filter.dataEntradaMax) {
      const maxDate = new Date(filter.dataEntradaMax);
      // Adiciona 1 dia para incluir o dia completo selecionado
      maxDate.setDate(maxDate.getDate() + 1);
      if (new Date(lote.dataEntrada) >= maxDate) return false;
    }

    return true;
  });
}
