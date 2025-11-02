import type { Producto } from "./produto";

// types/detalleOrdenPedido.ts
export interface DetalleOrdenPedido {
  idDetalleOrdenPedido: number;
  cantidad: number;
  subtotal: number;
  impuesto: number;
  descuento: number;
  idProducto: number;
  idOrdenPedido: number;
  producto: Producto;
}

export interface CreateDetalleOrdenPedidoDto {
  idOrdenPedido: number;
  cantidad: number;
  idProducto: number;
}

export interface UpdateDetalleOrdenPedidoDto {
  cantidad: number;
  idProducto: number;
}