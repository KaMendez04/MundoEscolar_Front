export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion: string;
}

export interface UpdateCategoriaDto {
  nombre: string;
  descripcion: string;
}