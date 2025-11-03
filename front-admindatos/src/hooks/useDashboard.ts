import { useState, useEffect } from "react";
import dataMartService from "../services/datamartService";
import type { DashboardMetricas } from "../types/datamart";

export const useDashboard = (anio?: number, mes?: number) => {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getDashboard(anio, mes);
        setMetricas(data);
      } catch (err: any) {
        console.error("Error al cargar dashboard:", err);
        setError(err?.response?.data?.error || "Error al cargar métricas del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [anio, mes]);

  return { metricas, loading, error };
};