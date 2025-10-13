import client from '../Client/ConfigClient';
import type { Servicio, CreateServicioDto, UpdateServicioDto } from '../types/servicio';

export const serviciosService = {
  getAllServicios: async (): Promise<Servicio[]> => {
    const response = await client.get<Servicio[]>('/Servicio');
    return response.data;
  },

  getServicioById: async (id: number): Promise<Servicio> => {
    const response = await client.get<Servicio>(`/Servicio/${id}`);
    return response.data;
  },

  createServicio: async (servicio: CreateServicioDto): Promise<Servicio> => {
    const response = await client.post<Servicio>('/Servicio', servicio);
    return response.data;
  },

  updateServicio: async (id: number, servicio: UpdateServicioDto): Promise<Servicio> => {
    const response = await client.put<Servicio>(`/Servicio/${id}`, {
      ...servicio,
      idServicio: id
    });
    return response.data;
  },

  deleteServicio: async (id: number): Promise<void> => {
    await client.delete(`/Servicio/${id}`);
  },
};