import { useState, useEffect } from 'react';
import { detalleOrdenPedidoService } from '../services/detalleOrdenPedidoService';
import type { 
  DetalleOrdenPedido, 
  CreateDetalleOrdenPedidoDto, 
  UpdateDetalleOrdenPedidoDto 
} from '../types/detalleOrdenPedido';

export const useDetalleOrdenPedido = () => {
  const [detalles, setDetalles] = useState<DetalleOrdenPedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetalles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await detalleOrdenPedidoService.getAllDetalles();
      setDetalles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar detalles');
      console.error('Error fetching detalles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalles();
  }, []);

  const createDetalle = async (detalle: CreateDetalleOrdenPedidoDto) => {
    try {
      setError(null);
      const newDetalle = await detalleOrdenPedidoService.createDetalle(detalle);
      setDetalles([...detalles, newDetalle]);
      return newDetalle;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear detalle';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateDetalle = async (id: number, detalle: UpdateDetalleOrdenPedidoDto) => {
    try {
      setError(null);
      const updatedDetalle = await detalleOrdenPedidoService.updateDetalle(id, detalle);
      setDetalles(detalles.map(d => d.idDetalleOrdenPedido === id ? updatedDetalle : d));
      return updatedDetalle;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar detalle';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteDetalle = async (id: number) => {
    try {
      setError(null);
      await detalleOrdenPedidoService.deleteDetalle(id);
      setDetalles(detalles.filter(d => d.idDetalleOrdenPedido !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar detalle';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    detalles,
    loading,
    error,
    createDetalle,
    updateDetalle,
    deleteDetalle,
    fetchDetalles,
  };
};