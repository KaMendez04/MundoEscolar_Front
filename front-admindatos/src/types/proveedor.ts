// types/proveedor.ts
export interface Proveedor {
  idProveedor: number;
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
  condicionesPago: boolean;
  estado: boolean;
}

export interface CreateProveedorDto {
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
  condicionesPago: boolean;
}

export interface UpdateProveedorDto {
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
  condicionesPago: boolean;
}

export interface FiltrosProveedor {
  buscar?: string;
  estado?: boolean;
  condicionesPago?: boolean;
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
