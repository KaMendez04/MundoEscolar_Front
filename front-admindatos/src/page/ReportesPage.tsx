// pages/ReportesPage.tsx
// Página de Reportes y Análisis (SIN dashboard)

import { useState } from "react";
import {
  useTopProductos,
  useTopServicios,
  useTopClientes,
  useVendedores,
  useCategorias,
  useVentasPorPeriodo,
  useComparativoProductosServicios,
} from "../hooks/useDataMart";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function ReportesPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeTab, setActiveTab] = useState<"productos" | "clientes" | "vendedores" | "analisis">("productos");

  const { productos, loading: loadingProductos } = useTopProductos(10);
  const { servicios, loading: loadingServicios } = useTopServicios(10);
  const { clientes, loading: loadingClientes } = useTopClientes(10);
  const { vendedores, loading: loadingVendedores } = useVendedores();
  const { categorias, loading: loadingCategorias } = useCategorias();
  const { ventas, loading: loadingVentas } = useVentasPorPeriodo(selectedYear);
  const { comparativo, loading: loadingComparativo } = useComparativoProductosServicios(selectedYear);

  const tabs = [
    { id: "productos", label: "Productos y Servicios" },
    { id: "clientes", label: "Clientes" },
    { id: "vendedores", label: "Vendedores" },
    { id: "analisis", label: "Análisis" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">
            Información detallada sobre ventas, productos y rendimiento
          </p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full md:w-auto"
        >
          <option value={currentYear}>{currentYear}</option>
          <option value={currentYear - 1}>{currentYear - 1}</option>
          <option value={currentYear - 2}>{currentYear - 2}</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido por Tab */}
      <div className="mt-6">
        {/* Tab: Productos y Servicios */}
        {activeTab === "productos" && (
          <div className="space-y-6">
            {/* Top Productos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Top 10 Productos Más Vendidos
              </h2>
              {loadingProductos ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidades</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productos.map((producto, index) => (
                        <tr key={producto.productoKey} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-full">
                              <span className="text-teal-700 font-bold text-sm">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{producto.nombreProducto}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                              {producto.nombreCategoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {producto.totalVentas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {producto.unidadesVendidas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(producto.montoTotalVentas)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(producto.ventaPromedio)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top Servicios */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Top 10 Servicios Más Solicitados
              </h2>
              {loadingServicios ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidades</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {servicios.map((servicio, index) => (
                        <tr key={servicio.servicioKey} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                              <span className="text-blue-700 font-bold text-sm">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{servicio.nombreServicio}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {servicio.totalVentas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {servicio.unidadesVendidas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(servicio.montoTotalVentas)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(servicio.ventaPromedio)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Categorías */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ventas por Categoría
              </h2>
              {loadingCategorias ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorias.map((categoria) => (
                    <div
                      key={categoria.categoriaKey}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium text-gray-900 mb-3">{categoria.nombreCategoria}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total ventas:</span>
                          <span className="font-medium">{formatCurrency(categoria.montoTotalVentas)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unidades:</span>
                          <span className="font-medium">{categoria.unidadesVendidas}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Productos:</span>
                          <span className="font-medium">{categoria.productosDiferentes}</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">% del total:</span>
                            <span className="text-teal-600 font-bold text-lg">
                              {categoria.porcentajeVentasTotales.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Clientes */}
        {activeTab === "clientes" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Top 10 Mejores Clientes
            </h2>
            {loadingClientes ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facturas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidades</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Compras</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Compra</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientes.map((cliente, index) => (
                      <tr key={cliente.clienteKey} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <span className="text-green-700 font-bold text-sm">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{cliente.nombreCliente}</div>
                          <div className="text-sm text-gray-500">{cliente.correo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              cliente.tipoCliente === "VIP"
                                ? "bg-purple-100 text-purple-800"
                                : cliente.tipoCliente === "Premium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {cliente.tipoCliente || "Regular"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cliente.totalFacturas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cliente.totalUnidades}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(cliente.montoTotalCompras)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cliente.compraPromedio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cliente.ultimaCompra).toLocaleDateString("es-CR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Vendedores */}
        {activeTab === "vendedores" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Rendimiento de Vendedores
            </h2>
            {loadingVendedores ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facturas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clientes Atendidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Ventas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicios</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendedores
                      .sort((a, b) => b.montoTotalVentas - a.montoTotalVentas)
                      .map((vendedor, index) => (
                        <tr key={vendedor.vendedorKey} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
                              <span className="text-amber-700 font-bold text-sm">#{index + 1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{vendedor.nombreVendedor}</div>
                            <div className="text-sm text-gray-500">{vendedor.correo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vendedor.totalFacturas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vendedor.clientesAtendidos}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(vendedor.montoTotalVentas)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(vendedor.ventaPromedio)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(vendedor.ventasProductos)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(vendedor.ventasServicios)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Análisis */}
        {activeTab === "analisis" && (
          <div className="space-y-6">
            {/* Ventas por Período */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ventas Mensuales {selectedYear}
              </h2>
              {loadingVentas ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facturas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidades</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuentos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impuestos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ventas
                        .slice()
                        .reverse()
                        .map((venta) => (
                          <tr key={`${venta.anio}-${venta.mes}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {venta.nombreMes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {venta.totalFacturas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {venta.totalUnidades}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(venta.totalSubtotal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              -{formatCurrency(venta.totalDescuentos)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(venta.totalImpuestos)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(venta.totalVentas)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Comparativo Productos vs Servicios */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Comparativo: Productos vs Servicios {selectedYear}
              </h2>
              {loadingComparativo ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas Productos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Productos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventas Servicios</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Servicios</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {comparativo
                        .slice()
                        .reverse()
                        .map((comp) => (
                          <tr key={`${comp.anio}-${comp.mes}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {comp.nombreMes}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {comp.ventasProductos} ventas
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 font-medium">
                              {formatCurrency(comp.montoProductos)}
                              <span className="text-xs text-gray-500 ml-2">
                                ({comp.porcentajeMontoProductos.toFixed(0)}%)
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {comp.ventasServicios} ventas
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                              {formatCurrency(comp.montoServicios)}
                              <span className="text-xs text-gray-500 ml-2">
                                ({comp.porcentajeMontoServicios.toFixed(0)}%)
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {formatCurrency(comp.montoTotal)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}