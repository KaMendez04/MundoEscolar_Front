// services/proveedorService.ts
import client from '../Client/ConfigClient';
import type { 
  Proveedor, 
  CreateProveedorDto, 
  UpdateProveedorDto, 
  FiltrosProveedor, 
  ResultadoPaginadoProveedor 
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

  obtenerProveedores: async (filtros: FiltrosProveedor): Promise<ResultadoPaginadoProveedor> => {
    const response = await client.get<ResultadoPaginadoProveedor>('/Proveedor', { params: filtros });
    return response.data;
  },

  obtenerProveedorPorCedula: async (cedulaJuridica: string): Promise<Proveedor> => {
    const response = await client.get<Proveedor>(`/Proveedor/${cedulaJuridica}`);
    return response.data;
  },
};