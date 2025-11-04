// src/hooks/useFacturasTabla.ts
import { useState, useEffect } from "react";
import { facturasService } from "../services/facturasTablaService";
import type { Factura } from "../types/facturasTabla";

export function useFacturasTabla(tamanoPagina = 10) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadoPago, setEstadoPago] = useState<boolean | undefined>(undefined);

  const fetchFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await facturasService.getFacturasPaginadas(
        paginaActual,
        tamanoPagina,
        estadoPago
      );
      setFacturas(data.facturas);
      setTotalPaginas(data.totalPaginas);
      setTotalRegistros(data.totalRegistros);
    } catch (err) {
      setError("No se pudieron cargar las facturas.");
    } finally {
      setLoading(false);
    }
  };

  // recargar cuando cambia página o filtro
  useEffect(() => {
    fetchFacturas();
  }, [paginaActual, estadoPago]);

  return {
    facturas,
    loading,
    error,
    paginaActual,
    totalPaginas,
    totalRegistros,
    setPaginaActual,
    estadoPago,
    setEstadoPago, // 👈 necesario para el select del frontend
  };
}
