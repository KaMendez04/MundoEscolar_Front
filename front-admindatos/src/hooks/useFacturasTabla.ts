// src/hooks/useFacturas.ts
import { useEffect, useState } from 'react';
import { facturasService, type FacturaUpdateDto } from '../services/facturasTablaService';
import type { Factura } from '../types/facturas';

export function useFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await facturasService.getAllFacturas();
      setFacturas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  const updateFactura = async (dto: FacturaUpdateDto) => {
    try {
      const response = await facturasService.updateFactura(dto);
      // Recargar las facturas después de actualizar
      await loadFacturas();
      return { success: true, mensaje: response.mensaje };
    } catch (err) {
      console.error(err);
      return { success: false, mensaje: 'Error al actualizar la factura' };
    }
  };

  return { facturas, loading, error, updateFactura, refreshFacturas: loadFacturas };
}