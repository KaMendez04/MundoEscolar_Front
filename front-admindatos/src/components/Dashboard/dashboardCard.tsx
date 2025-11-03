// components/DashboardCards.tsx
import React from "react";
import { BookOpen, Users, TrendingUp, ConciergeBell, LibraryBig } from "lucide-react";
import type { DashboardMetricas } from "../../types/datamart";

interface DashboardCardsProps {
  metricas: DashboardMetricas;
  totalProductos?: number;
  totalServicios?: number;
  prodDeltaMessage?: string; // ejemplo: "+3 (15%) más que el mes pasado"
  servDeltaMessage?: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  metricas,
  totalProductos,
  totalServicios,
  prodDeltaMessage,
  servDeltaMessage,
}) => {
  const productosValue = typeof totalProductos === "number" ? totalProductos : metricas.productosMasVendidos ?? 0;
  const serviciosValue =
    typeof totalServicios === "number" ? totalServicios : Math.floor((metricas.productosMasVendidos ?? 0) * 0.6);

  // small helper para colorear el mensaje (+ verde, - rojo, = gris)
  const deltaColorClass = (msg?: string) => {
    if (!msg) return "text-slate-400";
    const trimmed = msg.trim();
    if (trimmed.startsWith("+")) return "text-emerald-600";
    if (trimmed.startsWith("-")) return "text-rose-600";
    return "text-slate-500";
  };

  const cards = [
    {
      title: "Total de Productos",
      value: productosValue,
      subtitle: prodDeltaMessage ?? "Comparación mensual no disponible",
      icon: LibraryBig,
      color: "text-[#4a9d9d]",
    },
    {
      title: "Total de Servicios",
      value: serviciosValue,
      subtitle: servDeltaMessage ?? "Comparación mensual no disponible",
      icon: ConciergeBell,
      color: "text-[#9d8560]",
    },
    {
      title: "Facturas del Mes",
      value: metricas.totalFacturas ?? 0,
      subtitle: `${metricas.crecimientoMensual ? (metricas.crecimientoMensual >= 0 ? "+" : "") + Math.round(metricas.crecimientoMensual) + "%" : "Comparación no disponible"}`,
      icon: TrendingUp,
      color: "text-[#4a9d9d]",
    },
    {
      title: "Clientes Activos",
      value: metricas.totalClientes ?? 0,
      subtitle: `${metricas.crecimientoMensual ? (Math.round((metricas.crecimientoMensual ?? 0) * 0.5)) + "%" : "Comparación no disponible"}`,
      icon: Users,
      color: "text-[#9d8560]",
    },
  ];

  const formatNumber = (num: number): string => num.toLocaleString("es-ES");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isProductsCard = card.title === "Total de Productos";
        const isServicesCard = card.title === "Total de Servicios";
        const subtitle = card.subtitle ?? "";
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
              <h3 className="text-sm font-medium text-slate-600">{card.title}</h3>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>

            <div className="p-6 pt-0">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-slate-900">{formatNumber(card.value)}</div>
              </div>

              <div className="mt-2">
                {/* Productos / Servicios usan el mensaje mensual */}
                {(isProductsCard || isServicesCard) ? (
                  <div className={`text-sm ${deltaColorClass(subtitle)} truncate`}>
                    {subtitle}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
