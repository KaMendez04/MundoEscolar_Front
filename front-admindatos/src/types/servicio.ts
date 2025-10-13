// types/servicio.ts
export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  costo: number;
}

export interface CreateServicioDto {
  nombre: string;
  descripcion: string;
  costo: number;
}

export interface UpdateServicioDto {
  nombre: string;
  descripcion: string;
  costo: number;
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