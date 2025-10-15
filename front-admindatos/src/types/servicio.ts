// types/servicio.ts
export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  monto: number;
  impuesto: number;
  descuento: number;
  estado: boolean;
}

export interface CreateServicioDto {
  nombre: string;
  descripcion: string;
  monto: number;
  impuesto: number;
  descuento: number;
  estado: boolean;
}

export interface UpdateServicioDto {
  idServicio: number;
  nombre: string;
  descripcion: string;
  monto: number;
  impuesto: number;
  descuento: number;
  estado: boolean;
}

// types/venta.ts
export interface ItemVenta {
  id: string; // ID temporal para el carrito
  tipo: 'producto' | 'servicio';
  idItem: number;
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Venta {
  items: ItemVenta[];
  total: number;
  fecha: Date;
}