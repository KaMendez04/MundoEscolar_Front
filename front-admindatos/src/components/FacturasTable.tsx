import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  X,
  AlertCircle,
  Calendar,
  User,
  Eye,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { useFacturasTabla } from "../hooks/useFacturasTabla";
import { facturasService } from "../services/facturasTablaService";
import type { Factura } from "../types/facturasTabla";

// 💰 Modal para editar monto cancelado
const EditarMontoModal = ({
  factura,
  onClose,
  onSuccess,
}: {
  factura: Factura | null;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (factura) {
      setMonto(factura.montoCancelado.toString());
    }
  }, [factura]);

  if (!factura) return null;

  const saldoPendiente = factura.montoTotal - factura.montoCancelado;
  const nuevoMonto = parseFloat(monto) || 0;
  const nuevoSaldo = factura.montoTotal - nuevoMonto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const montoNum = parseFloat(monto);

    if (isNaN(montoNum) || montoNum < 0) {
      setError("Ingrese un monto válido (mayor o igual a 0)");
      return;
    }

    if (montoNum > factura.montoTotal) {
      setError("El monto cancelado no puede ser mayor al monto total");
      return;
    }

    setLoading(true);

    try {
      await facturasService.updateMontoCancelado(factura.idFactura, montoNum);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.Mensaje || err.message || "Error al actualizar el monto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4a9d9d]/10 flex items-center justify-center">
              <DollarSign className="text-[#4a9d9d]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Actualizar Monto Cancelado
              </h2>
              <p className="text-sm text-gray-500">
                Factura #{factura.numeroFactura}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Monto Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ₡{factura.montoTotal.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Cancelado Actual</p>
                <p className="text-lg font-bold text-green-600">
                  ₡{factura.montoCancelado.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Saldo Pendiente Actual</p>
                <p className="text-lg font-bold text-amber-600">
                  ₡{saldoPendiente.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Monto Cancelado
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₡
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={factura.montoTotal}
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] text-lg font-semibold"
                placeholder="0.00"
                disabled={loading || success}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ingrese el monto total que ha sido cancelado hasta el momento
            </p>
          </div>

          {!isNaN(nuevoMonto) && nuevoMonto >= 0 && nuevoMonto <= factura.montoTotal && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 font-medium mb-2">
                Vista Previa del Cambio:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">Nuevo Cancelado</p>
                  <p className="text-lg font-bold text-blue-900">
                    ₡{nuevoMonto.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-600">Nuevo Saldo</p>
                  <p className="text-lg font-bold text-blue-900">
                    ₡{nuevoSaldo.toFixed(2)}
                  </p>
                </div>
              </div>
              {nuevoSaldo === 0 && (
                <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                  <CheckCircle size={14} />
                  La factura quedará como PAGADA
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle size={18} />
              <span className="text-sm">¡Monto actualizado correctamente!</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              disabled={loading || success}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading || success || isNaN(nuevoMonto) || nuevoMonto < 0 || nuevoMonto > factura.montoTotal}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Actualizando...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={18} />
                  Actualizado
                </>
              ) : (
                "Actualizar Monto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 🧾 Modal de detalles de factura
const DetalleFacturaModal = ({
  factura,
  onClose,
  onEditMonto,
}: {
  factura: Factura | null;
  onClose: () => void;
  onEditMonto: () => void;
}) => {
  if (!factura) return null;

  const saldoPendiente = factura.montoTotal - factura.montoCancelado;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4a9d9d]/10 flex items-center justify-center">
              <FileText className="text-[#4a9d9d]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Factura #{factura.numeroFactura}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(factura.fechaEmision).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="text-[#4a9d9d]" size={16} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Cliente
                </h3>
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
                  <p className="text-base text-gray-700">
                    {factura.cliente?.cedula || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contacto</p>
                  <p className="text-base text-gray-700">
                    {factura.cliente?.contacto || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="text-base text-gray-700">
                    {factura.cliente?.correoElectronico || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="text-[#4a9d9d]" size={16} />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Vendedor
                </h3>
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
                  <p className="text-base text-gray-700">
                    {(factura.vendedor as any)?.cedula || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-base text-gray-700">
                    {factura.vendedor?.telefono || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="text-base text-gray-700">
                    {factura.vendedor?.correo || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Información Financiera
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₡{factura.subtotal.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Impuesto</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₡{factura.impuesto.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Descuento</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₡{factura.descuento.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-lg font-bold text-[#4a9d9d]">
                  ₡{factura.montoTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Cancelado</p>
                <p className="text-xl font-bold text-green-600">
                  ₡{factura.montoCancelado.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Pendiente</p>
                <p className="text-xl font-bold text-amber-600">
                  ₡{saldoPendiente.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    factura.montoCancelado >= factura.montoTotal
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {factura.montoCancelado >= factura.montoTotal ? "Pagada" : "Pendiente"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onEditMonto}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition shadow-sm flex items-center gap-2"
            >
              <DollarSign size={18} />
              Actualizar Monto
            </button>
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
  );
};

// ✅ Tabla principal
export default function FacturasTable() {
  const {
    facturas,
    todasLasFacturas,
    loading,
    error,
    paginaActual,
    totalPaginas,
    totalRegistros,
    setPaginaActual,
    estadoPago,
    setEstadoPago,
  } = useFacturasTabla(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Factura | null>(null);
  const [editingMonto, setEditingMonto] = useState<Factura | null>(null);

  // Reset a primera página al cambiar filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, estadoPago]);

  // 🔍 Buscar en TODAS las facturas, no solo en la página actual
  const facturasFiltradas = facturas.filter((factura) => {
    if (!searchTerm) return true;
    
    const matchesSearch =
      factura.numeroFactura.toString().includes(searchTerm) ||
      (factura.cliente &&
        `${factura.cliente.nombre} ${factura.cliente.apellido1} ${
          factura.cliente.apellido2 || ""
        }`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (factura.vendedor &&
        `${factura.vendedor.nombre} ${factura.vendedor.apellido1}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // 🎯 Si hay búsqueda, buscar también en TODAS las facturas
  const facturasEncontradas = searchTerm && todasLasFacturas.length > 0
    ? todasLasFacturas.filter((factura) => {
        // Aplicar filtro de estado si existe
        if (estadoPago !== undefined) {
          const estaPagada = factura.montoCancelado >= factura.montoTotal;
          if ((estadoPago && !estaPagada) || (!estadoPago && estaPagada)) {
            return false;
          }
        }

        const matchesSearch =
          factura.numeroFactura.toString().includes(searchTerm) ||
          (factura.cliente &&
            `${factura.cliente.nombre} ${factura.cliente.apellido1} ${
              factura.cliente.apellido2 || ""
            }`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (factura.vendedor &&
            `${factura.vendedor.nombre} ${factura.vendedor.apellido1}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));
        return matchesSearch;
      })
    : facturasFiltradas;

  const facturasAMostrar = searchTerm ? facturasEncontradas : facturasFiltradas;

  const handleEditMonto = () => {
    setEditingMonto(selected);
    setSelected(null);
  };

  const handleMontoSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Gestión de Facturas
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Administra y consulta todas las facturas registradas
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative md:col-span-2">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente o vendedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                />
              </div>
              <select
                value={estadoPago === undefined ? "" : estadoPago.toString()}
                onChange={(e) =>
                  setEstadoPago(
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
              >
                <option value="">Todos los estados</option>
                <option value="true">Pagadas</option>
                <option value="false">Pendientes</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm">
                  {estadoPago !== undefined ? "Cargando todas las facturas filtradas..." : "Cargando facturas..."}
                </p>
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
                        Total
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
                    {facturasAMostrar.map((factura) => (
                      <tr
                        key={factura.idFactura}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-sm font-bold text-gray-700">
                          #{factura.numeroFactura}
                        </td>
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
                              factura.montoCancelado >= factura.montoTotal
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {factura.montoCancelado >= factura.montoTotal ? "Pagada" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(
                              factura.fechaEmision
                            ).toLocaleDateString("es-ES")}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => setSelected(factura)}
                            className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition inline-flex items-center gap-1"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                  <p className="text-sm text-gray-600">
                    {estadoPago !== undefined ? (
                      <>Mostrando {facturasFiltradas.length} facturas {estadoPago ? "pagadas" : "pendientes"}</>
                    ) : (
                      <>Mostrando {facturasFiltradas.length} de {totalRegistros} facturas (Página {paginaActual} de {totalPaginas})</>
                    )}
                  </p>
                  {estadoPago === undefined && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                        disabled={paginaActual === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          paginaActual === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-[#4a9d9d] border-[#4a9d9d] hover:bg-[#4a9d9d]/10"
                        }`}
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          setPaginaActual((p) => Math.min(p + 1, totalPaginas))
                        }
                        disabled={paginaActual === totalPaginas}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          paginaActual === totalPaginas
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-[#4a9d9d] border-[#4a9d9d] hover:bg-[#4a9d9d]/10"
                        }`}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetalleFacturaModal 
        factura={selected} 
        onClose={() => setSelected(null)} 
        onEditMonto={handleEditMonto}
      />

      <EditarMontoModal
        factura={editingMonto}
        onClose={() => setEditingMonto(null)}
        onSuccess={handleMontoSuccess}
      />
    </div>
  );
}