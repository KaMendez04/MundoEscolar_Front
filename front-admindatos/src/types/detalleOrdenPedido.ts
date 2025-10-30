import type { Producto } from "./produto";

// types/detalleOrdenPedido.ts
export interface DetalleOrdenPedido {
  IdDetalleOrdenPedido: number;
  Cantidad: number;
  Subtotal: number;
  Impuesto: number;
  Descuento: number;
  IdProducto: number;
  IdOrdenPedido: number;
  producto: Producto;
}

export interface CreateDetalleOrdenPedidoDto {
  IdOrdenPedido: number;
  Cantidad: number;
  IdProducto: number;
}

export interface UpdateDetalleOrdenPedidoDto {
  Cantidad: number;
  IdProducto: number;
}