export interface LoteFilter {
  instituicaoResp?: string;
  instituicao?: string;
  situacao?: string;
  idLoteMin?: string | number;
  idLoteMax?: string | number;
  valorLoteMin?: string | number;
  valorLoteMax?: string | number;
  dataEntradaMin?: string | Date;
  dataEntradaMax?: string | Date;
}
