export interface Lancamento {
  id: number;
  pa: string;
  contaCorrente: string;
  titular: string;
  valor: number;
  historico: string;
  estorno: boolean;
  documento: string;
  descricao: string;
  situacao: string;
}
