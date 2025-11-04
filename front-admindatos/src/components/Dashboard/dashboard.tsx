import { useCounts } from "../../hooks/useCount";
import { useDashboard } from "../../hooks/useDashboard";
import { useComparativoProductosServicios, useTopClientes } from "../../hooks/useDataMart";
import DashboardCards from "./dashboardCard";
import PieChartComparativo from "./pieChartComparativoCard";
import TopClientesChart from "./topClientes";


const Dashboard: React.FC = () => {
  const { metricas, loading: loadingMetricas, error: errorMetricas } = useDashboard();
  const { comparativo, loading: loadingComparativo, error: errorComparativo } = useComparativoProductosServicios();
  const { clientes, loading: loadingClientes, error: errorClientes } = useTopClientes(7);
  const { totalProductos, totalServicios, loading: loadingCounts } = useCounts();

  if (loadingMetricas || loadingComparativo || loadingClientes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-lg text-slate-600">Cargando dashboard...</div>
      </div>
    );
  }

  if (errorMetricas || errorComparativo || errorClientes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-lg text-red-600">
          Error: {errorMetricas || errorComparativo || errorClientes}
        </div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-lg text-slate-600">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Título */}
        <div className="space-y-2">
          <p className="text-slate-600">Monitorea el rendimiento y las métricas clave de tu librería</p>
        </div>

        {/* Cards superiores */}
         <DashboardCards
        metricas={metricas}
        totalProductos={totalProductos}
        totalServicios={totalServicios}
      />

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de barras - Top Clientes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold leading-none tracking-tight text-slate-900">
                  Top Clientes por Compras
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Productos y servicios adquiridos
                </p>
              </div>
              <div className="p-6 pt-0">
                <TopClientesChart clientes={clientes} />
              </div>
            </div>
          </div>

          {/* Gráfico de pastel - Productos vs Servicios */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold leading-none tracking-tight text-slate-900">
                  Distribución de Ventas
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Productos vs Servicios
                </p>
              </div>
              <div className="p-6 pt-0">
                <PieChartComparativo data={comparativo} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;