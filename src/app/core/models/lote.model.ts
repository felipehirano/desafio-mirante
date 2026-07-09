export interface Lote {
  id: number;
  dataEntrada: Date;
  valor: number;
  quantidadeLancamentos: number;
  usuarioRegistro: string;
  usuarioAprovacao?: string;
  situacao: string;
  dataHoraSituacao: Date;
}
