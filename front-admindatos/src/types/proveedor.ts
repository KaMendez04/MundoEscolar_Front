// types/proveedor.ts
export interface Proveedor {
  idProveedor: number;
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
  estado: boolean;
}

export interface CreateProveedorDto {
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
}

export interface UpdateProveedorDto {
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
}

export interface FiltrosProveedor {
  buscar?: string;
  estado?: boolean;
  page: number;
  pageSize: number;
}

export interface ResultadoPaginadoProveedor {
  proveedores: Proveedor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
