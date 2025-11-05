// src/hooks/useFacturasTabla.ts
import { useState, useEffect, useCallback } from "react";
import { facturasService } from "../services/facturasTablaService";
import type { Factura } from "../types/facturasTabla";

export function useFacturasTabla(tamanoPagina = 10) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [todasLasFacturas, setTodasLasFacturas] = useState<Factura[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadoPago, setEstadoPago] = useState<boolean | undefined>(undefined);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // 🎯 Cargar TODAS las facturas una sola vez al inicio
  const cargarTodasLasFacturas = useCallback(async () => {
    try {
      const data = await facturasService.getFacturasPaginadas(1, 10, undefined);
      const totalPags = data.totalPaginas;
      
      const promesas = [];
      for (let i = 1; i <= totalPags; i++) {
        promesas.push(facturasService.getFacturasPaginadas(i, 10, undefined));
      }
      
      const resultados = await Promise.all(promesas);
      const todas = resultados.flatMap(r => r.facturas);
      setTodasLasFacturas(todas);
      return todas;
    } catch (err) {
      console.error("Error cargando todas las facturas:", err);
      return [];
    }
  }, []);

  const fetchFacturas = useCallback(async (forzarRecarga = false) => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todas las facturas si aún no están cargadas o se fuerza la recarga
      let todas = todasLasFacturas;
      if (todas.length === 0 || forzarRecarga) {
        todas = await cargarTodasLasFacturas();
      }

      // 🎯 Si hay filtro de estado, filtrar localmente
      if (estadoPago !== undefined) {
        const facturasFiltradas = todas.filter(factura => {
          const estaPagada = factura.montoCancelado >= factura.montoTotal;
          return estadoPago ? estaPagada : !estaPagada;
        });
        
        setFacturas(facturasFiltradas);
        setTotalRegistros(facturasFiltradas.length);
        setTotalPaginas(1);
      } else {
        // Sin filtro: paginación normal
        const data = await facturasService.getFacturasPaginadas(
          paginaActual,
          tamanoPagina,
          undefined
        );
        setFacturas(data.facturas);
        setTotalPaginas(data.totalPaginas);
        setTotalRegistros(data.totalRegistros);
      }
    } catch (err) {
      setError("No se pudieron cargar las facturas.");
    } finally {
      setLoading(false);
    }
  }, [paginaActual, estadoPago, tamanoPagina, todasLasFacturas, cargarTodasLasFacturas]);

  // Función para refrescar los datos después de actualizar
  const refetchData = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  // Recargar cuando cambia página, filtro o trigger
  useEffect(() => {
    const forzarRecarga = refetchTrigger > 0;
    fetchFacturas(forzarRecarga);
  }, [paginaActual, estadoPago, refetchTrigger]);

  return {
    facturas,
    todasLasFacturas,
    loading,
    error,
    paginaActual,
    totalPaginas,
    totalRegistros,
    setPaginaActual,
    estadoPago,
    setEstadoPago,
    refetchData, // Nueva función para refrescar datos
  };
}