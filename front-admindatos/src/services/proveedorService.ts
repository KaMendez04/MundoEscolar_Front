// services/proveedorService.ts
import client from '../Client/ConfigClient';
import type { 
  Proveedor, 
  CreateProveedorDto, 
  UpdateProveedorDto, 
  VistaProveedor,
  CondicionPagoProveedor
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

  obtenerProveedores: async (): Promise<VistaProveedor[]> => {
    const response = await client.get<VistaProveedor[]>('/Proveedor');
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