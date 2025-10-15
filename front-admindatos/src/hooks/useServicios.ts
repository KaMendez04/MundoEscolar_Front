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
      const newServicio = await serviciosService.createServicio(servicio);
      setServicios([...servicios, newServicio]);
      return newServicio;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear servicio';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateServicio = async (id: number, servicio: UpdateServicioDto) => {
    try {
      setError(null);
      const updatedServicio = await serviciosService.updateServicio(id, servicio);
      setServicios(servicios.map(s => s.idServicio === id ? updatedServicio : s));
      return updatedServicio;
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
      setServicios(servicios.filter(s => s.idServicio !== id));
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