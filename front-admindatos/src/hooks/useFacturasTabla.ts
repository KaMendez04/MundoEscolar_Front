// src/hooks/useFacturasTabla.ts
import { useState, useEffect } from "react";
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

  // 🎯 Cargar TODAS las facturas una sola vez al inicio
  const cargarTodasLasFacturas = async () => {
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
  };

  const fetchFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todas las facturas si aún no están cargadas
      let todas = todasLasFacturas;
      if (todas.length === 0) {
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
  };

  // Recargar cuando cambia página o filtro
  useEffect(() => {
    fetchFacturas();
  }, [paginaActual, estadoPago]);

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
  };
}