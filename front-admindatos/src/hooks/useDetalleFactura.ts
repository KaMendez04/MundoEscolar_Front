// hooks/useDetalleFactura.ts
import { useState } from 'react';
import { detalleFacturaService } from '../services/detalleFacturaService';
import type { CreateDetalleFacturaDto, DetalleFactura } from '../types/factura';

export const useDetalleFactura = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Agregar detalle a factura
  const addDetalleFactura = async (data: CreateDetalleFacturaDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await detalleFacturaService.addDetalleFactura(data);
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al agregar detalle';
      setError(errorMsg);
      console.error('Error adding detalle:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtener detalle por ID
  const fetchDetalleById = async (id: number): Promise<DetalleFactura | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await detalleFacturaService.getDetalleById(id);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al obtener detalle';
      setError(errorMsg);
      console.error('Error fetching detalle:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar detalle
  const updateDetalle = async (id: number, data: Partial<DetalleFactura>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await detalleFacturaService.updateDetalle(id, data);
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar detalle';
      setError(errorMsg);
      console.error('Error updating detalle:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar detalle
  const deleteDetalle = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await detalleFacturaService.deleteDetalle(id);
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al eliminar detalle';
      setError(errorMsg);
      console.error('Error deleting detalle:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addDetalleFactura,
    fetchDetalleById,
    updateDetalle,
    deleteDetalle,
    setError,
  };
};