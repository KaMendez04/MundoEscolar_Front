import { useState } from "react"
import {
  Search,
  FileText,
  X,
  AlertCircle,
  Calendar,
  User,
  Eye,
} from "lucide-react"
import { useFacturas } from "../hooks/useFacturasTabla"
import type { Factura } from "../types/facturasTabla"

// Modal de Detalles
const DetalleFacturaModal = ({ factura, onClose }: { factura: Factura | null; onClose: () => void }) => {
  if (!factura) return null

  const saldoPendiente = factura.montoTotal - factura.montoCancelado

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4a9d9d]/10 flex items-center justify-center">
              <FileText className="text-[#4a9d9d]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Factura #{factura.numeroFactura}</h2>
              <p className="text-sm text-gray-500">
                {new Date(factura.fechaEmision).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          {/* Grid de información */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Cliente */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="text-[#4a9d9d]" size={16} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Cliente</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="text-base font-medium text-gray-900">
                    {factura.cliente
                      ? `${factura.cliente.nombre} ${factura.cliente.apellido1} ${factura.cliente.apellido2 || ""}`
                      : "No asignado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cédula</p>
                  <p className="text-base text-gray-700">{factura.cliente?.cedula || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contacto</p>
                  <p className="text-base text-gray-700">{factura.cliente?.contacto || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="text-base text-gray-700">{factura.cliente?.correoElectronico || "—"}</p>
                </div>
              </div>
            </div>

            {/* Vendedor */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="text-[#4a9d9d]" size={16} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Vendedor</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="text-base font-medium text-gray-900">
                    {factura.vendedor
                      ? `${factura.vendedor.nombre} ${factura.vendedor.apellido1} ${factura.vendedor.apellido2 || ""}`
                      : "No asignado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cédula</p>
                  <p className="text-base text-gray-700">{(factura.vendedor as any)?.cedula || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-base text-gray-700">{factura.vendedor?.telefono || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="text-base text-gray-700">{factura.vendedor?.correo || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Financiera */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Información Financiera
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                <p className="text-lg font-semibold text-gray-900">₡{factura.subtotal.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Impuesto</p>
                <p className="text-lg font-semibold text-gray-900">₡{factura.impuesto.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Descuento</p>
                <p className="text-lg font-semibold text-gray-900">₡{factura.descuento.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-lg font-bold text-[#4a9d9d]">₡{factura.montoTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Cancelado</p>
                <p className="text-xl font-bold text-green-600">₡{factura.montoCancelado.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Pendiente</p>
                <p className="text-xl font-bold text-amber-600">₡{saldoPendiente.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    factura.estadoPago ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {factura.estadoPago ? "Pagada" : "Pendiente"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FacturasTable() {
  const { facturas, loading, error } = useFacturas()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstadoPago, setFiltroEstadoPago] = useState<boolean | undefined>(undefined)
  const [selected, setSelected] = useState<Factura | null>(null)

  // Filtrar facturas
  const facturasFiltradas = facturas.filter((factura) => {
    const matchesSearch =
      factura.numeroFactura.toString().includes(searchTerm) ||
      (factura.cliente &&
        `${factura.cliente.nombre} ${factura.cliente.apellido1} ${factura.cliente.apellido2 || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (factura.vendedor &&
        `${factura.vendedor.nombre} ${factura.vendedor.apellido1}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))

    const matchesEstado = filtroEstadoPago === undefined || factura.estadoPago === filtroEstadoPago

    return matchesSearch && matchesEstado
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Gestión de Facturas</h1>
            <p className="text-sm text-gray-500 mt-1">Administra y consulta todas las facturas registradas</p>
          </div>

          <div className="p-6">
            {/* Descripción */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Facturas Registradas</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {facturasFiltradas.length} {facturasFiltradas.length === 1 ? "factura encontrada" : "facturas encontradas"}
                </p>
              </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente o vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                />
              </div>
              <select
                value={filtroEstadoPago === undefined ? "" : filtroEstadoPago.toString()}
                onChange={(e) => setFiltroEstadoPago(e.target.value === "" ? undefined : e.target.value === "true")}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
              >
                <option value="">Todos los estados</option>
                <option value="true">Pagadas</option>
                <option value="false">Pendientes</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm">Cargando facturas...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        # Factura
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Vendedor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Monto Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cancelado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facturasFiltradas.map((factura) => (
                      <tr key={factura.idFactura} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-bold text-gray-700">#{factura.numeroFactura}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {factura.cliente
                            ? `${factura.cliente.nombre} ${factura.cliente.apellido1}`
                            : "No asignado"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {factura.vendedor
                            ? `${factura.vendedor.nombre} ${factura.vendedor.apellido1}`
                            : "No asignado"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                          ₡{factura.montoTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#4a9d9d] font-medium">
                          ₡{factura.montoCancelado.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              factura.estadoPago ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {factura.estadoPago ? "Pagada" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(factura.fechaEmision).toLocaleDateString("es-ES")}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => setSelected(factura)}
                            className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition inline-flex items-center gap-1"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {facturasFiltradas.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No se encontraron facturas</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      <DetalleFacturaModal factura={selected} onClose={() => setSelected(null)} />
    </div>
  )
}