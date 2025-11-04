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

export interface VistaProveedor {
  idProveedor: number;
  cedulaJuridica: string;
  nombre: string;
  telefono: string;
  estado: string;
}


export interface CondicionPagoProveedor {
    idProveedor: number,
    cedulaJuridica: string,
    nombre: string,
    idCondicionesPagoProveedor: number,
    condicion: string,
    fecha: string
  }

export interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}
