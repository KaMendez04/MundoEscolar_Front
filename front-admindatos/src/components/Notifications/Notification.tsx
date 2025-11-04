import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

export type NotificationType = "success" | "error" | "warning" | "info"

export interface NotificationProps {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const Notification = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) => {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Actualizar barra de progreso
    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      
      if (remaining <= 0) {
        clearInterval(progressInterval)
      }
    }, 50)

    // Auto-cerrar después de la duración
    const closeTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(closeTimer)
      clearInterval(progressInterval)
    }
  }, [duration, id])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  // Configuración de estilos por tipo de notificación
  const notificationConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-gradient-to-r green",
      borderColor: "border-emerald-500",
      iconBgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      progressColor: "bg-emerald-500",
      titleColor: "text-emerald-900",
      messageColor: "text-emerald-700",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      borderColor: "border-red-500",
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      progressColor: "bg-red-500",
      titleColor: "text-red-900",
      messageColor: "text-red-700",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-gradient-to-r white",
      borderColor: "border-amber-500",
      iconBgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      progressColor: "bg-amber-500",
      titleColor: "text-amber-900",
      messageColor: "text-amber-700",
    },
    info: {
      icon: Info,
      bgColor: "bg-gradient-to-r blue",
      borderColor: "border-blue-500",
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      progressColor: "bg-blue-500",
      titleColor: "text-blue-900",
      messageColor: "text-blue-700",
    },
  }

  const config = notificationConfig[type]
  const Icon = config.icon

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor}
        border-l-4 rounded-lg shadow-lg backdrop-blur-sm
        w-96 overflow-hidden
        transform transition-all duration-300 ease-out
        ${
          isExiting
            ? "translate-x-full opacity-0 scale-95"
            : "translate-x-0 opacity-100 scale-100"
        }
      `}
      style={{
        animation: isExiting ? undefined : "slideInRight 0.3s ease-out",
      }}
    >
      {/* Contenido Principal */}
      <div className="p-4 flex items-start gap-3">
        {/* Icono Animado */}
        <div 
          className={`
            ${config.iconBgColor} ${config.iconColor}
            p-2 rounded-lg flex-shrink-0
            transform transition-transform duration-500
            hover:scale-110
          `}
          style={{
            animation: "scaleIn 0.3s ease-out",
          }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${config.titleColor} text-sm mb-0.5`}>
            {title}
          </h4>
          {message && (
            <p className={`text-sm ${config.messageColor} leading-relaxed`}>
              {message}
            </p>
          )}
        </div>

        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white/50 rounded"
          aria-label="Cerrar notificación"
        >
          <X size={18} />
        </button>
      </div>

      {/* Barra de Progreso */}
      <div className="h-1 bg-gray-200/30">
        <div
          className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Estilos de animación inline para evitar CSS externo */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Notification
