import { useState } from 'react';
import { detalleOrdenPedidoService } from '../services/detalleOrdenPedidoService';
import type { 
  CreateDetalleOrdenPedidoDto, 
  UpdateDetalleOrdenPedidoDto 
} from '../types/detalleOrdenPedido';

export const useDetalleOrdenPedido = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createDetalle = async (detalle: CreateDetalleOrdenPedidoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newDetalle = await detalleOrdenPedidoService.createDetalle(detalle);
      return newDetalle;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al crear detalle';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateDetalle = async (id: number, detalle: UpdateDetalleOrdenPedidoDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDetalle = await detalleOrdenPedidoService.updateDetalle(id, detalle);
      return updatedDetalle;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar detalle';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createDetalle,
    updateDetalle,
  };
};