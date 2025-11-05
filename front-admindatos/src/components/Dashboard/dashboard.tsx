import { motion } from "framer-motion";
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
  const { totalProductos, totalServicios,} = useCounts();

  if (loadingMetricas || loadingComparativo || loadingClientes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div 
          className="text-lg text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Cargando dashboard...
        </motion.div>
      </div>
    );
  }

  if (errorMetricas || errorComparativo || errorClientes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div 
          className="text-lg text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Error: {errorMetricas || errorComparativo || errorClientes}
        </motion.div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div 
          className="text-lg text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No hay datos disponibles
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Cards superiores con animación */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <DashboardCards
            metricas={metricas}
            totalProductos={totalProductos}
            totalServicios={totalServicios}
          />
        </motion.div>

        {/* Gráficos con animación staggered */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de barras - Top Clientes */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
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
          </motion.div>

          {/* Gráfico de pastel - Productos vs Servicios */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
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
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;