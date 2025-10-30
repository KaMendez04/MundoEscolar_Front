// hooks/useFacturas.ts
import { useState } from 'react';
import { facturaService } from '../services/facturaService';
import type { Factura, CreateFacturaResponse, UpdateFacturaDto } from '../types/factura';

export const useFacturas = () => {
  const [factura, setFactura] = useState<Factura | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear factura vacía
  const createFactura = async (): Promise<CreateFacturaResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const nuevaFactura = await facturaService.createFactura();
      return nuevaFactura;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al crear factura';
      setError(errorMsg);
      console.error('Error creating factura:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener factura por ID
  const fetchFacturaById = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await facturaService.getFacturaById(id);
      setFactura(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al obtener factura';
      setError(errorMsg);
      console.error('Error fetching factura:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las facturas
  const fetchAllFacturas = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await facturaService.getAllFacturas();
      setFacturas(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al obtener facturas';
      setError(errorMsg);
      console.error('Error fetching facturas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar factura
  const updateFactura = async (data: UpdateFacturaDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await facturaService.updateFactura(data);
      // Refrescar la factura actual si existe
      if (factura && factura.idFactura === data.idFactura) {
        await fetchFacturaById(data.idFactura);
      }
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar factura';
      setError(errorMsg);
      console.error('Error updating factura:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar monto cancelado
  const updateMontoCancelado = async (idFactura: number, montoCancelado: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await facturaService.updateMontoCancelado(idFactura, montoCancelado);
      // Refrescar la factura
      if (factura && factura.idFactura === idFactura) {
        await fetchFacturaById(idFactura);
      }
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar monto cancelado';
      setError(errorMsg);
      console.error('Error updating monto cancelado:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    factura,
    facturas,
    loading,
    error,
    createFactura,
    fetchFacturaById,
    fetchAllFacturas,
    updateFactura,
    updateMontoCancelado,
    setFactura,
    setError,
  };
};