export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  monto: number;
  impuesto: number;
  descuento: number;
  idCategoria: number;
  estado?: boolean;
  categoria?: Categoria;
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
  descripcion: string;
  estado: boolean;
}