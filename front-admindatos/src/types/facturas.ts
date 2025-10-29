// src/types/facturas.types.ts

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  tipoCliente?: string;
  cedula: number;
  contacto?: string;
  correoElectronico?: string;
}

export interface Vendedor {
  cedulaVendedor: number;
  idVendedor: number;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo?: string;
  estado: boolean;
}

export interface DetalleFactura {
  idDetalleFactura: number;
  cantidad: number;
  subtotal: number;
  descuento: number;
  impuesto: number;
  idProducto?: number;
  idServicio?: number;
  idFactura: number;
}

export interface Factura {
  idFactura: number;
  subtotal: number;
  impuesto: number;
  descuento: number;
  montoTotal: number;
  montoCancelado: number;
  fechaEmision: string;
  estadoPago: boolean;
  numeroFactura: number;
  idCliente?: number;
  idVendedor?: number;
  cliente?: Cliente;
  vendedor?: Vendedor;
}
