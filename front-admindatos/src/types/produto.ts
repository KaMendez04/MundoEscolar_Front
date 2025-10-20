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
  estado?: boolean;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion: string;
  stock: number;
  monto: number;
  impuesto: number;
  descuento: number;
  idCategoria: number;
}

export interface UpdateProductoDto {
  nombre: string;
  descripcion: string;
  stock: number;
  monto: number;
  impuesto: number;
  descuento: number;
  idCategoria: number;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}