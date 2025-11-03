// src/hooks/useCounts.ts
import { useState, useEffect } from "react";
import { productosService } from "../services/produtoService";
import { serviciosService } from "../services/servicioService";

type Delta = {
  absolute: number;     // diferencia absoluta (actual - mesPasado)
  percent: number;      // porcentaje relativo (si mesPasado = 0 -> 100 si actual>0)
  message: string;      // texto listo para mostrar en UI
};

const makeMessage = (abs: number, pct: number) => {
  if (abs === 0 && pct === 0) return "Igual que el mes pasado";
  const sign = abs > 0 ? "+" : "";
  const absText = `${sign}${abs}`;
  const pctText = `${abs === 0 && pct === 0 ? "0%" : `${sign}${Math.round(pct)}%`}`;
  return `${absText} (${pctText}) ${abs > 0 ? "más" : abs < 0 ? "menos" : "que"} el mes pasado`;
};

const countByMonthFromArray = (items: any[], dateKeys: string[], year: number, monthIndex: number) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((acc, item) => {
    for (const key of dateKeys) {
      const raw = item[key];
      if (!raw) continue;
      const date = new Date(raw);
      if (isNaN(date.getTime())) continue;
      if (date.getFullYear() === year && date.getMonth() === monthIndex) {
        return acc + 1;
      }
    }
    return acc;
  }, 0);
};

export const useCounts = () => {
  const [totalProductos, setTotalProductos] = useState<number>(0);
  const [totalServicios, setTotalServicios] = useState<number>(0);
  const [prodDelta, setProdDelta] = useState<Delta>({ absolute: 0, percent: 0, message: "No disponible" });
  const [servDelta, setServDelta] = useState<Delta>({ absolute: 0, percent: 0, message: "No disponible" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Traer listas completas (fallback si no hay endpoint por mes)
        const [productos, servicios] = await Promise.all([
          productosService.getAllProductos(),
          serviciosService.getAllServicios(),
        ]);

        const prodArray = Array.isArray(productos) ? productos : [];
        const servArray = Array.isArray(servicios) ? servicios : [];

        setTotalProductos(prodArray.length);
        setTotalServicios(servArray.length);

        // preparar fechas: mes actual y mes pasado
        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth(); // 0-indexed
        const prevYear = (thisMonth === 0) ? thisYear - 1 : thisYear;
        const prevMonth = (thisMonth === 0) ? 11 : thisMonth - 1;

        // keys posibles donde pueda venir la fecha en tus objetos
        const possibleDateKeys = ["createdAt", "fechaCreacion", "fechaRegistro", "created_at", "fecha"];

        // 2) Intentar contar por fechas en cliente (si los objetos tienen fecha)
        const prodThisMonth = countByMonthFromArray(prodArray, possibleDateKeys, thisYear, thisMonth);
        const prodPrevMonth = countByMonthFromArray(prodArray, possibleDateKeys, prevYear, prevMonth);

        const servThisMonth = countByMonthFromArray(servArray, possibleDateKeys, thisYear, thisMonth);
        const servPrevMonth = countByMonthFromArray(servArray, possibleDateKeys, prevYear, prevMonth);

        // función para calcular delta
        const calcDelta = (current: number, previous: number): Delta => {
          const absolute = current - previous;
          const percent = previous === 0 ? (current === 0 ? 0 : 100) : (absolute / previous) * 100;
          return { absolute, percent, message: makeMessage(absolute, percent) };
        };

        // Si al menos uno de los meses arrojó conteo válido (no 0 por falta de fecha), lo usamos
        const prodHasDates = prodThisMonth > 0 || prodPrevMonth > 0;
        const servHasDates = servThisMonth > 0 || servPrevMonth > 0;

        if (prodHasDates) {
          setProdDelta(calcDelta(prodThisMonth, prodPrevMonth));
          // preferir mostrar conteo del mes actual si quieres (opcional)
          setTotalProductos(prodArray.length);
        } else {
          // 3) Si no hay fechas en los objetos, intentar endpoint por mes (si existe)
          try {
            // Estos endpoints son opcionales: impleméntalos en backend si quieres
            // productosService.getCountsByMonth(year, month) -> { count: number }
            if (typeof (productosService as any).getCountsByMonth === "function") {
              const currentCountRes = await (productosService as any).getCountsByMonth(thisYear, thisMonth + 1);
              const prevCountRes = await (productosService as any).getCountsByMonth(prevYear, prevMonth + 1);
              const c = currentCountRes?.count ?? 0;
              const p = prevCountRes?.count ?? 0;
              setProdDelta(calcDelta(c, p));
            } else {
              setProdDelta({ absolute: 0, percent: 0, message: "Comparación mensual no disponible" });
            }
          } catch (err) {
            setProdDelta({ absolute: 0, percent: 0, message: "Comparación mensual no disponible" });
          }
        }

        if (servHasDates) {
          setServDelta(calcDelta(servThisMonth, servPrevMonth));
          setTotalServicios(servArray.length);
        } else {
          try {
            if (typeof (serviciosService as any).getCountsByMonth === "function") {
              const currentCountRes = await (serviciosService as any).getCountsByMonth(thisYear, thisMonth + 1);
              const prevCountRes = await (serviciosService as any).getCountsByMonth(prevYear, prevMonth + 1);
              const c = currentCountRes?.count ?? 0;
              const p = prevCountRes?.count ?? 0;
              setServDelta(calcDelta(c, p));
            } else {
              setServDelta({ absolute: 0, percent: 0, message: "Comparación mensual no disponible" });
            }
          } catch (err) {
            setServDelta({ absolute: 0, percent: 0, message: "Comparación mensual no disponible" });
          }
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || err?.message || "Error al obtener conteos");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // refetch útil después de crear/eliminar producto/servicio
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productos, servicios] = await Promise.all([
        productosService.getAllProductos(),
        serviciosService.getAllServicios(),
      ]);
      setTotalProductos(Array.isArray(productos) ? productos.length : 0);
      setTotalServicios(Array.isArray(servicios) ? servicios.length : 0);
      // opcional: recalcular deltas (por simplicidad invocamos efecto repetido)
      // Podrías extraer la lógica anterior a una función reutilizable y llamarla aquí.
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Error al obtener conteos");
    } finally {
      setLoading(false);
    }
  };

  return {
    totalProductos,
    totalServicios,
    prodDelta,
    servDelta,
    loading,
    error,
    refetch,
  };
};
