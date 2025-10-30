import type { DetalleOrdenPedido } from "./detalleOrdenPedido";
import type { Proveedor } from "./proveedor";

// types/ordenPedido.ts
export interface OrdenPedido {
  idOrdenPedido: number;
  numeroOrden: number;
  subtotal: number;
  descuento: number;
  impuesto: number;
  montoTotal: number;
  montoCancelado: number;
  fechaEmision: string;
  estadoPago: boolean;
  idProveedor: number;
  proveedor: Proveedor;
  detalles: DetalleOrdenPedido[];
}

export interface VistaOrdenPedido {
  idOrdenPedido: number;
  numeroOrden: number;
  subtotal: number;
  descuento: number;
  impuesto: number;
  montoTotal: number;
  montoCancelado: number;
  fechaEmision: string;
  estadoPago: string;
  idProveedor: number;
  proveedor: Proveedor;
  detalles: DetalleOrdenPedido[];
}

export interface CreateOrdenPedidoDto {
  numeroOrden: number;
}

export interface UpdateOrdenPedidoDto {
  IdOrdenPedido: number;
  EstadoPago?: boolean;
  IdProveedor?: number;
  MontoCancelado?: number;
}

export interface InsertarOrdenPedidoResponse {
  idOrdenPedido?: number;
  mensajes: string[];
}

