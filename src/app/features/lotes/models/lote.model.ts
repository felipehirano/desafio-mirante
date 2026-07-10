export interface Lote {
  id: number;
  instituicaoResp: string;
  instituicao: string;
  dataEntrada: Date;
  valor: number;
  quantidadeLancamentos: number;
  usuarioRegistro: string;
  usuarioAprovacao?: string;
  situacao: string;
  dataHoraSituacao: Date;
}
