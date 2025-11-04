import { useState, useEffect, useCallback, useRef } from "react";
import notificacionService from "../services/notificatcionService";
import { toast } from "react-hot-toast";
import type { ContadorNotificaciones, NotificacionStockBajo } from "../types/notifications";

interface UseNotificacionesResult {
  notificaciones: NotificacionStockBajo[];
  contador: ContadorNotificaciones;
  loading: boolean;
  cargarNotificaciones: () => Promise<void>;
  refetch: () => Promise<void>;
  marcarComoLeida: (idNotificacion: number) => Promise<void>;
  marcarTodasComoLeidas: () => Promise<void>;
}

export const useNotificaciones = (
  pollingInterval: number = 30000 // 30 segundos
): UseNotificacionesResult => {
  const [notificaciones, setNotificaciones] = useState<NotificacionStockBajo[]>([]);
  const [contador, setContador] = useState<ContadorNotificaciones>({
    totalNoLeidas: 0,
    criticas: 0,
    advertencias: 0
  });
  const [loading, setLoading] = useState(false);
  const previousCountRef = useRef<number>(0);

  const cargarNotificaciones = useCallback(async () => {
    try {
      const [notifData, contadorData] = await Promise.all([
        notificacionService.obtenerNotificaciones(true),
        notificacionService.obtenerContador()
      ]);

      setNotificaciones(notifData.data);
      setContador(contadorData.data);

      // Mostrar toast si hay nuevas notificaciones
      const currentCount = contadorData.data.totalNoLeidas;
      if (currentCount > previousCountRef.current && previousCountRef.current > 0) {
        const nuevas = currentCount - previousCountRef.current;
        
        if (contadorData.data.criticas > 0) {
          toast.error(
            `🚨 ${nuevas} nueva${nuevas > 1 ? 's' : ''} alerta${nuevas > 1 ? 's' : ''} crítica${nuevas > 1 ? 's' : ''} de stock`,
            { duration: 5000 }
          );
        } else {
          toast(
            `⚠️ ${nuevas} nueva${nuevas > 1 ? 's' : ''} alerta${nuevas > 1 ? 's' : ''} de stock bajo`,
            { duration: 4000, icon: '⚠️' }
          );
        }
      }
      
      previousCountRef.current = currentCount;
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  }, []);

  const marcarComoLeida = useCallback(async (idNotificacion: number) => {
    try {
      await notificacionService.marcarComoLeida({ idNotificacion });
      await cargarNotificaciones();
    } catch (error) {
      console.error("Error al marcar notificación:", error);
      toast.error("Error al marcar la notificación");
    }
  }, [cargarNotificaciones]);

  const marcarTodasComoLeidas = useCallback(async () => {
    try {
      setLoading(true);
      await notificacionService.marcarTodasComoLeidas();
      await cargarNotificaciones();
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (error) {
      console.error("Error al marcar todas:", error);
      toast.error("Error al marcar las notificaciones");
    } finally {
      setLoading(false);
    }
  }, [cargarNotificaciones]);

  // Cargar notificaciones al montar
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Polling
  useEffect(() => {
    const interval = setInterval(() => {
      cargarNotificaciones();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval, cargarNotificaciones]);

  return {
    notificaciones,
    contador,
    loading,
    cargarNotificaciones,
    // Alias para compatibilidad con consumidores que esperan `refetch`
    refetch: cargarNotificaciones,
    marcarComoLeida,
    marcarTodasComoLeidas
  };
};