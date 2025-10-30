// types/factura.ts

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  tipoCliente: string;
  cedula: number;
  contacto: string;
  correoElectronico: string;
}

export interface Vendedor {
  idVendedor: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  correo: string;
  clave?: string;
  estado: boolean;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  monto: number;
  impuesto: number;
  descuento: number;
  idCategoria: number;
  nombreCategoria?: string;
  estado: boolean;
}

export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  monto: number;
  impuesto: number;
  descuento: number;
  estado: boolean;
}

export interface DetalleFactura {
  idDetalleFactura: number;
  cantidad: number;
  subtotal: number;
  descuento: number;
  impuesto: number;
  idProducto: number | null;
  idServicio: number | null;
  idFactura: number;
  producto?: Producto | null;
  servicio?: Servicio | null;
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
  idCliente: number | null;
  idVendedor: number | null;
  cliente?: Cliente | null;
  vendedor?: Vendedor | null;
  detalles: DetalleFactura[];
}

export interface CreateFacturaResponse {
  idFactura: number;
  numeroFactura: number;
  fechaEmision: string;
}

export interface UpdateFacturaDto {
  idFactura: number;
  idCliente?: number | null;
  idVendedor?: number | null;
  estadoPago?: boolean | null;
  montoCancelado?: number | null;
}

export interface CreateDetalleFacturaDto {
  idFactura: number;
  cantidad: number;
  idProducto?: number | null;
  idServicio?: number | null;
}