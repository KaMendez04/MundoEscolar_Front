// types/detalleOrdenPedido.ts
export interface DetalleOrdenPedido {
  idDetalleOrdenPedido: number;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
  costo: number;
  stock: number;
}

export interface CreateDetalleOrdenPedidoDto {
  cantidad: number;
  idProducto: number;
}

export interface UpdateDetalleOrdenPedidoDto {
  cantidad: number;
  idProducto: number;
}