// components/TopClientesChart.tsx
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
import type { VentasPorCliente } from "../../types/datamart";


interface TopClientesChartProps {
  clientes: VentasPorCliente[];
}

const TopClientesChart: React.FC<TopClientesChartProps> = ({ clientes }) => {
  const chartData = useMemo(() => {
    if (!clientes || clientes.length === 0) return [];

    // Tomar los primeros 7 clientes y calcular estimados de productos/servicios
    return clientes.map((cliente) => {
      const total = cliente.montoTotalCompras;
      // Estimamos una distribución 60% productos, 40% servicios
      const productos = total * 0.6;
      const servicios = total * 0.4;

      // Acortar nombre si es muy largo
      const nombreCorto = cliente.nombreCliente.length > 15
        ? cliente.nombreCliente.substring(0, 15) + "..."
        : cliente.nombreCliente;

      return {
        nombre: nombreCorto,
        productos: Math.round(productos),
        servicios: Math.round(servicios),
      };
    });
  }, [clientes]);

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
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-700 capitalize">{entry.name}:</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-200">
            <span className="text-sm font-semibold text-slate-900">
              Total: {formatCurrency(total)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!clientes || clientes.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-slate-400">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="nombre"
          stroke="#64748b"
          tick={{ fontSize: 12 }}
          angle={-15}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="#64748b"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Bar
          dataKey="productos"
          fill="#4a9d9d"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="servicios"
          fill="#9d8560"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopClientesChart;