// components/PieChartComparativo.tsx
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ComparativoProductosServicios } from "../../types/datamart";


interface PieChartComparativoProps {
  data: ComparativoProductosServicios[];
}

const PieChartComparativo: React.FC<PieChartComparativoProps> = ({ data }) => {
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const totalProductos = data.reduce((sum, item) => sum + item.montoProductos, 0);
    const totalServicios = data.reduce((sum, item) => sum + item.montoServicios, 0);
    const total = totalProductos + totalServicios;

    const productosPercentage = total > 0 ? Math.round((totalProductos / total) * 100) : 0;
    const serviciosPercentage = total > 0 ? Math.round((totalServicios / total) * 100) : 0;

    return [
      {
        name: "Productos",
        value: totalProductos,
        percentage: productosPercentage,
        color: "#4a9d9d",
      },
      {
        name: "Servicios",
        value: totalServicios,
        percentage: serviciosPercentage,
        color: "#9d8560",
      },
    ];
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-slate-400">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda */}
      <div className="mt-4 space-y-2">
        {pieData.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-slate-700 font-medium">
                {category.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {category.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComparativo;