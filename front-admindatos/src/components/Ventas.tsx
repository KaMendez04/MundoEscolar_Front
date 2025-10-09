import { useVentas } from '../hooks/useVentas';

export const Ventas = () => {
  const { ventas, filtroEstado, setFiltroEstado, totalVentas, cantidadVentas, actualizarEstado } = useVentas();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pendiente':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelada':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className=" bg-slate-50 p-6">
      <div className=" mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-slate-800 mb-2">Ventas</h1>
          <p className="text-slate-500">Gestión y seguimiento de ventas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Total de Ventas</p>
            <p className="text-2xl font-light text-slate-800">${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Cantidad de Ventas</p>
            <p className="text-2xl font-light text-slate-800">{cantidadVentas}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Ticket Promedio</p>
            <p className="text-2xl font-light text-slate-800">
              ${cantidadVentas > 0 ? (totalVentas / cantidadVentas).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFiltroEstado('todos')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filtroEstado === 'todos'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroEstado('completada')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filtroEstado === 'completada'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Completadas
              </button>
              <button
                onClick={() => setFiltroEstado('pendiente')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filtroEstado === 'pendiente'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFiltroEstado('cancelada')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filtroEstado === 'cancelada'
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Canceladas
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Fecha</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Cliente</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Productos</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Subtotal</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Descuento</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Total</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Método Pago</th>
                  <th className="text-center py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-slate-800">{venta.id}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {new Date(venta.fecha).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-800">{venta.cliente}</td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {venta.productos.map((prod) => (
                          <div key={prod.id} className="text-sm text-slate-600">
                            {prod.nombre} <span className="text-slate-400">x{prod.cantidad}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 text-right">
                      ${venta.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 text-right">
                      ${venta.descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-800 text-right">
                      ${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{venta.metodoPago}</td>
                    <td className="py-4 px-6">
                      <select
                        value={venta.estado}
                        onChange={(e) => actualizarEstado(venta.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer ${getEstadoColor(venta.estado)}`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;