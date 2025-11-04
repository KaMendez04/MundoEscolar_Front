import { useState, useRef, useEffect } from "react";
import { Bell, Check, AlertCircle, AlertTriangle, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNotification } from "../../context/NotificationContext";
import type { NotificacionStockBajo } from "../../types/notifications";

interface NotificationDropdownProps {
  notificaciones: NotificacionStockBajo[];
  contador: {
    totalNoLeidas: number;
    criticas: number;
    advertencias: number;
  };
  onMarcarLeida: (id: number) => void;
  onMarcarTodas: () => void;
  onRefetch?: () => Promise<void>;
  loading?: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notificaciones,
  contador,
  onMarcarLeida,
  onMarcarTodas,
  onRefetch,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifiedIdsRef = useRef<Set<number>>(new Set());
  
  const notification = useNotification();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Si se abre el dropdown, permitir que el padre solicite una recarga
  useEffect(() => {
    if (isOpen && onRefetch) {
      void onRefetch();
    }
  }, [isOpen, onRefetch]);

  // 🚨 MOSTRAR TOAST PARA NOTIFICACIONES NUEVAS
  useEffect(() => {
    if (!notificaciones || notificaciones.length === 0) return;

    const notificacionesNuevas = notificaciones.filter(
      (notif) => !notif.leida && !notifiedIdsRef.current.has(notif.idNotificacion)
    );

    notificacionesNuevas.forEach((notif) => {
      const mensaje = getMensajeStockParaToast(notif);

      if (notif.stockActual === 0) {
        notification.error("🚨 PRODUCTO SIN STOCK", mensaje);
      } else if (notif.stockActual <= 2) {
        notification.error("⚠️ STOCK CRÍTICO", mensaje);
      } else if (notif.stockActual <= 5) {
        notification.warning("⚠️ STOCK BAJO", mensaje);
      } else {
        notification.info("ℹ️ Alerta de Stock", mensaje);
      }

      notifiedIdsRef.current.add(notif.idNotificacion);
    });
  }, [notificaciones, notification]);

  const formatFecha = (fecha: string) => {
    try {
      return formatDistanceToNow(new Date(fecha), {
        addSuffix: true,
        locale: es
      });
    } catch {
      return "Hace un momento";
    }
  };

  const getIconoNotificacion = (stockActual: number) => {
    if (stockActual === 0) {
      return (
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
      );
    } else if (stockActual <= 2) {
      return (
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
      );
    } else if (stockActual <= 5) {
      return (
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-gray-500" />
      </div>
    );
  };

  const getMensajeStock = (notif: NotificacionStockBajo) => {
    if (notif.stockActual === 0) {
      return `SIN STOCK: ${notif.nombreProducto}`;
    } else if (notif.stockActual === 1) {
      return `STOCK CRÍTICO: ${notif.nombreProducto} - Queda ${notif.stockActual} unidad`;
    } else if (notif.stockActual <= 2) {
      return `STOCK CRÍTICO: ${notif.nombreProducto} - Quedan ${notif.stockActual} unidades`;
    } else if (notif.stockActual <= 5) {
      return `STOCK BAJO: ${notif.nombreProducto} - Quedan ${notif.stockActual} unidades`;
    }
    return `${notif.nombreProducto} - Stock: ${notif.stockActual}`;
  };

  const handleMarcarLeida = (idNotificacion: number) => {
    notifiedIdsRef.current.delete(idNotificacion);
    onMarcarLeida(idNotificacion);
  };

  const handleMarcarTodas = () => {
    notifiedIdsRef.current.clear();
    onMarcarTodas();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campana - MEJORADO */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-gray-100/80 rounded-xl transition-all duration-200 group"
        aria-label="Notificaciones"
      >
        <Bell className={`w-5 h-5 transition-colors ${
          contador.totalNoLeidas > 0 
            ? 'text-[#4a9d9d] animate-pulse' 
            : 'text-gray-500 group-hover:text-gray-700'
        }`} />
        {contador.totalNoLeidas > 0 && (
          <>
            {/* Badge con animación */}
            <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
              {contador.totalNoLeidas > 9 ? "9+" : contador.totalNoLeidas}
            </span>
            {/* Efecto de pulso */}
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-400 rounded-full animate-ping opacity-75"></span>
          </>
        )}
      </button>

      {/* Dropdown - REDISEÑADO */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header con gradiente suave */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4a9d9d]/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-[#4a9d9d]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notificaciones
                  </h3>
                  {contador.totalNoLeidas > 0 && (
                    <span className="px-2 py-0.5 bg-[#4a9d9d]/10 text-[#4a9d9d] text-xs font-semibold rounded-full">
                      {contador.totalNoLeidas} nueva{contador.totalNoLeidas > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {(contador.criticas > 0 || contador.advertencias > 0) && (
                  <div className="flex gap-2 text-xs">
                    {contador.criticas > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {contador.criticas} crítica{contador.criticas > 1 ? "s" : ""}
                      </span>
                    )}
                    {contador.advertencias > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-medium">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        {contador.advertencias} advertencia{contador.advertencias > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {contador.totalNoLeidas > 0 && (
                <button
                  onClick={handleMarcarTodas}
                  disabled={loading}
                  className="px-3 py-1.5 hover:bg-white rounded-lg transition-all duration-200 text-xs text-gray-600 hover:text-[#4a9d9d] font-medium flex items-center gap-1.5 border border-transparent hover:border-gray-200 disabled:opacity-50"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas</span>
                </button>
              )}
            </div>
          </div>

          {/* Lista de notificaciones - MEJORADA */}
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {notificaciones.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No hay notificaciones
                </p>
                <p className="text-xs text-gray-500">
                  Te notificaremos cuando haya alertas de stock
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notificaciones.map((notif) => (
                  <div
                    key={notif.idNotificacion}
                    className={`px-5 py-4 transition-all duration-200 ${
                      !notif.leida 
                        ? "bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 hover:to-blue-50/30" 
                        : "hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex gap-3.5">
                      <div className="flex-shrink-0">
                        {getIconoNotificacion(notif.stockActual)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium mb-1.5 leading-relaxed">
                          {getMensajeStock(notif)}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            {formatFecha(notif.fechaNotificacion)}
                          </p>
                          {!notif.leida && (
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      {!notif.leida && (
                        <button
                          onClick={() => handleMarcarLeida(notif.idNotificacion)}
                          className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-200"
                          title="Marcar como leída"
                        >
                          <Check className="w-4 h-4 text-gray-400 group-hover:text-[#4a9d9d]" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con estadísticas */}
          {notificaciones.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">
                  {notificaciones.length} notificación{notificaciones.length > 1 ? "es" : ""} total{notificaciones.length > 1 ? "es" : ""}
                </span>
                {contador.totalNoLeidas > 0 && (
                  <span className="flex items-center gap-1.5 text-[#4a9d9d] font-semibold">
                    <div className="w-2 h-2 bg-[#4a9d9d] rounded-full animate-pulse"></div>
                    {contador.totalNoLeidas} sin leer
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estilos personalizados para scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

// 📝 Función helper para generar mensajes de toast
function getMensajeStockParaToast(notif: NotificacionStockBajo): string {
  if (notif.stockActual === 0) {
    return `${notif.nombreProducto} - AGOTADO`;
  } else if (notif.stockActual === 1) {
    return `${notif.nombreProducto} - Queda ${notif.stockActual} unidad`;
  } else {
    return `${notif.nombreProducto} - Quedan ${notif.stockActual} unidades`;
  }
}