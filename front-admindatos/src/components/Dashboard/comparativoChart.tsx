import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ComparativoProductosServicios } from "../../types/datamart";


interface ComparativoChartProps {
  data: ComparativoProductosServicios[];
}

const ComparativoChart: React.FC<ComparativoChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .slice(0, 7)
      .reverse()
      .map((item) => ({
        mes: item.nombreMes.substring(0, 3),
        Productos: item.montoProductos,
        Servicios: item.montoServicios,
      }));
  }, [data]);

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `₡${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₡${Math.round(value / 1000)}K`;
    }
    return `₡${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...chartData.flatMap(d => [d.Productos, d.Servicios])
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData} 
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e5e7eb" 
          vertical={false}
        />
        <XAxis
          dataKey="mes"
          tick={{ fill: "#6b7280", fontSize: 13 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fill: "#6b7280", fontSize: 13 }}
          axisLine={false}
          tickLine={false}
          domain={[0, maxValue * 1.1]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar
          dataKey="Productos"
          fill="#5eead4"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="Servicios"
          fill="#a3907c"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComparativoChart;