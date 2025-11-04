// services/proveedorService.ts
import client from '../Client/ConfigClient';
import type { 
  Proveedor, 
  CreateProveedorDto, 
  UpdateProveedorDto, 
  VistaProveedor,
  CondicionPagoProveedor,
  PaginatedResponse,
} from '../types/proveedor';

export const proveedorService = {
  insertarProveedor: async (proveedor: CreateProveedorDto): Promise<string[]> => {
    const response = await client.post<string[]>('/Proveedor/', proveedor);
    return response.data;
  },

  actualizarProveedor: async (proveedor: UpdateProveedorDto): Promise<string[]> => {
    const response = await client.put<string[]>('/Proveedor/', proveedor);
    return response.data;
  },

  desactivarProveedor: async (cedulaJuridica: string): Promise<string[]> => {
    const response = await client.patch<string[]>(`/Proveedor/Desactivar/${cedulaJuridica}`);
    return response.data;
  },

  activarProveedor: async (cedulaJuridica: string): Promise<string[]> => {
    const response = await client.patch<string[]>(`/Proveedor/Activar/${cedulaJuridica}`);
    return response.data;
  },

  obtenerProveedores: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    nombre?: string;
    cedulaJuridica?: string;
    telefono?: string;
    estado?: string;
  }): Promise<PaginatedResponse<VistaProveedor>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.nombre) queryParams.append('nombre', params.nombre);
    if (params?.cedulaJuridica) queryParams.append('cedulaJuridica', params.cedulaJuridica);
    if (params?.telefono) queryParams.append('telefono', params.telefono);
    if (params?.estado) queryParams.append('estado', params.estado);
    
    const url = `/Proveedor${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await client.get<PaginatedResponse<VistaProveedor>>(url);
    return response.data;
  },

  obtenerProveedorPorCedula: async (cedulaJuridica: string): Promise<Proveedor> => {
    const response = await client.get<Proveedor>(`/Proveedor/${cedulaJuridica}`);
    return response.data;
  },
};

export const condicionsPagoProveedorService = {
  obtenerCondicionesPago: async (idProveedor: number): Promise<CondicionPagoProveedor> => {
    const response = await client.get<CondicionPagoProveedor>(`/CondicionesPagoProveedor/${idProveedor}`);
    return response.data;
  },


  crearActualizarCondicionesPago: async (idProveedor: number, acepta: boolean, condiciones?: string[]): Promise<string[]> => {
    const response = await client.post<string[]>(`/CondicionesPagoProveedor/`, { idProveedor, acepta, condiciones });
    return response.data;
  }
};