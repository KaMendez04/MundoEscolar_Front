import { useState, useEffect } from 'react';
import { serviciosService } from '../services/servicioService';
import type { Servicio, CreateServicioDto, UpdateServicioDto } from '../types/servicio';

export const useServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviciosService.getAllServicios();
      setServicios(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar servicios');
      console.error('Error fetching servicios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const createServicio = async (servicio: CreateServicioDto) => {
    try {
      setError(null);
      await serviciosService.createServicio(servicio);
      // Vuelve a traer todos los servicios del backend
      await fetchServicios();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear servicio';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateServicio = async (id: number, servicio: UpdateServicioDto) => {
    try {
      setError(null);
      await serviciosService.updateServicio(id, servicio);
      //  Refresca la lista con los datos actualizados
      await fetchServicios();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar servicio';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteServicio = async (id: number) => {
    try {
      setError(null);
      await serviciosService.deleteServicio(id);
      // 👇 También recarga después de eliminar
      await fetchServicios();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar servicio';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    servicios,
    loading,
    error,
    createServicio,
    updateServicio,
    deleteServicio,
    fetchServicios,
  };
};
