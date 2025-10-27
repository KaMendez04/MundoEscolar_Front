// types/detalleOrdenPedido.ts
export interface DetalleOrdenPedido {
  idDetalleOrdenPedido: number;
  cantidad: number;
  idProducto: number;
  nombreProducto: string;
  monto: number;
  impuesto: number;
  descuento: number;
  stock: number;
  subtotal: number;
}

export interface CreateDetalleOrdenPedidoDto {
  cantidad: number;
  idProducto: number;
}

export interface UpdateDetalleOrdenPedidoDto {
  cantidad: number;
  idProducto: number;
}