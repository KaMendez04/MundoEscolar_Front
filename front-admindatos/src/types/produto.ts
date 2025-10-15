export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  stock: number;
  costo: number;
  idCategoria: number;
  nombreCategoria?: string;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion: string;
  stock: number;
  costo: number;
  idCategoria: number;
}

export interface UpdateProductoDto {
  nombre: string;
  descripcion: string;
  stock: number;
  costo: number;
  idCategoria: number;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}