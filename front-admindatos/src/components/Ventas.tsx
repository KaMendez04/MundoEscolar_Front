// components/VentasModule.tsx
import { useState } from "react"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  Briefcase,
  Search,
  X,
  ShoppingBag,
  User,
  Receipt,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { useProductos } from "../hooks/useProdutos"
import { useServicios } from "../hooks/useServicios"
import { useFacturas } from "../hooks/useFacturas"
import { useDetalleFactura } from "../hooks/useDetalleFactura"
import { useClientes } from "../hooks/useClientes"
import { useMiVendedor } from "../hooks/useMiVendedor"
import type { Cliente } from "../types/cliente"
import ModalCliente from "../components/Ventas/ModalCrearCliente"

type ItemVenta = {
  id: string
  tipo: "producto" | "servicio"
  idItem: number
  nombre: string
  descripcion: string
  precioUnitario: number
  cantidad: number
  subtotal: number
  impuesto: number
  descuento: number
  stockDisponible?: number
}

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }: any) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {type === "danger" ? (
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#4a9d9d]/10 flex items-center justify-center">
                <CheckCircle className="text-[#4a9d9d]" size={24} />
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6 ml-15">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition ${
                type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#4a9d9d] hover:bg-[#5aadad]"
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const VentasModule = () => {
  const { productos, loading: loadingProductos } = useProductos()
  const { servicios, loading: loadingServicios } = useServicios()
  const { factura, createFactura, fetchFacturaById, updateFactura, loading: loadingFactura } = useFacturas()
  const { addDetalleFactura } = useDetalleFactura()
  const {
    clientes = [],
    fetchClientes,
    fetchClienteByCedula,
    createCliente,
    loading: loadingClientes,
  } = useClientes()
  const { vendedor, loading: loadingVendedor, error: errorVendedor } = useMiVendedor()

  const [carrito, setCarrito] = useState<ItemVenta[]>([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false)
  const [mostrarModalConfirm, setMostrarModalConfirm] = useState(false)
  const [tipoModal, setTipoModal] = useState<"producto" | "servicio">("producto")
  const [searchTerm, setSearchTerm] = useState("")
  const [idFacturaActual, setIdFacturaActual] = useState<number | null>(null)
  const [numeroFactura, setNumeroFactura] = useState<number | null>(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [montoCancelado, setMontoCancelado] = useState<string>("")
  const [mostrarResumenFinal, setMostrarResumenFinal] = useState(false)

  // Filtrar productos/servicios
  const itemsFiltrados = tipoModal === "producto"
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : servicios.filter(
        (s) =>
          s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )

  // AGREGAR AL CARRITO - Solo frontend, sin crear detalles aún
  const agregarAlCarrito = (item: any, tipo: "producto" | "servicio") => {
    const itemId = `${tipo}-${tipo === "producto" ? item.idProducto : item.idServicio}`
    const existente = carrito.find((i) => i.id === itemId)

    if (tipo === "producto" && existente && existente.cantidad >= item.stock) {
      alert("No hay suficiente stock disponible")
      return
    }

    const precioUnitario = item.monto ?? item.precio ?? 0
    const impuesto = item.impuesto ?? 0
    const descuento = item.descuento ?? 0

    if (existente) {
      // Incrementar cantidad
      const nuevaCantidad = existente.cantidad + 1
      const nuevoSubtotal = nuevaCantidad * existente.precioUnitario
      
      setCarrito(
        carrito.map((i) =>
          i.id === itemId ? { ...i, cantidad: nuevaCantidad, subtotal: nuevoSubtotal } : i
        )
      )
    } else {
      // Nuevo item en el carrito
      const nuevoItem: ItemVenta = {
        id: itemId,
        tipo,
        idItem: tipo === "producto" ? item.idProducto : item.idServicio,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precioUnitario,
        cantidad: 1,
        subtotal: precioUnitario,
        impuesto,
        descuento,
        stockDisponible: tipo === "producto" ? item.stock : undefined,
      }
      setCarrito([...carrito, nuevoItem])
    }

    setMostrarModal(false)
    setSearchTerm("")
  }

  // ACTUALIZAR CANTIDAD - Solo frontend
  const actualizarCantidad = (itemId: string, cambio: number) => {
    const item = carrito.find((i) => i.id === itemId)
    if (!item) return

    const nuevaCantidad = Math.max(1, item.cantidad + cambio)
    
    if (item.tipo === "producto" && item.stockDisponible && nuevaCantidad > item.stockDisponible) {
      alert("No hay suficiente stock disponible")
      return
    }

    setCarrito(
      carrito.map((i) =>
        i.id === itemId
          ? { ...i, cantidad: nuevaCantidad, subtotal: nuevaCantidad * i.precioUnitario }
          : i
      )
    )
  }

  // ELIMINAR ITEM - Solo frontend
  const eliminarDelCarrito = (itemId: string) => {
    setCarrito(carrito.filter((item) => item.id !== itemId))
  }

  // CALCULAR TOTALES ESTIMADOS - Basados en el carrito frontend
  const calcularTotales = () => {
    let subtotal = 0
    let totalImpuesto = 0
    let totalDescuento = 0
    
    carrito.forEach((item) => {
      const itemSubtotal = item.cantidad * item.precioUnitario
      const itemImpuesto = (itemSubtotal * item.impuesto) / 100
      const itemDescuento = (itemSubtotal * item.descuento) / 100
      
      subtotal += itemSubtotal
      totalImpuesto += itemImpuesto
      totalDescuento += itemDescuento
    })
    
    const total = subtotal + totalImpuesto - totalDescuento
    
    return { subtotal, impuesto: totalImpuesto, descuento: totalDescuento, total }
  }

  // CALCULAR TOTALES REALES desde la factura del backend
  const calcularTotalesReales = (facturaData: any) => {
    let subtotal = 0
    let totalImpuesto = 0
    let totalDescuento = 0
    
    if (facturaData?.detalles) {
      facturaData.detalles.forEach((detalle: any) => {
        subtotal += detalle.subtotal || 0
        totalImpuesto += detalle.impuesto || 0
        totalDescuento += detalle.descuento || 0
      })
    }
    
    const total = subtotal + totalImpuesto - totalDescuento
    return { subtotal, impuesto: totalImpuesto, descuento: totalDescuento, total }
  }

  // PROCESAR VENTA - Crear factura, agregar todos los detalles y actualizar
  const procesarVenta = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío")
    if (!vendedor) return alert("No se pudo obtener la información del vendedor")

    try {
      // 1. Crear factura si no existe
      let facturaId = idFacturaActual
      if (!facturaId) {
        const nuevaFactura = await createFactura()
        if (!nuevaFactura) {
          alert("Error al crear la factura")
          return
        }
        facturaId = nuevaFactura.idFactura
        setIdFacturaActual(nuevaFactura.idFactura)
        setNumeroFactura(nuevaFactura.numeroFactura)
      }

      // 2. Agregar todos los detalles al carrito
      console.log("🛒 Agregando detalles de carrito:", carrito)
      
      for (const item of carrito) {
        const success = await addDetalleFactura({
          idFactura: facturaId,
          cantidad: item.cantidad, // Cantidad total del item
          idProducto: item.tipo === "producto" ? item.idItem : null,
          idServicio: item.tipo === "servicio" ? item.idItem : null,
        })

        if (!success) {
          alert(`Error al agregar ${item.nombre} a la factura`)
          return
        }
      }

      // 3. Esperar un momento para que el backend procese los detalles
      await new Promise(resolve => setTimeout(resolve, 500))

      // 4. Actualizar la factura con vendedor, cliente y monto
      const montoIngresado = montoCancelado ? parseFloat(montoCancelado) : 0

      console.log("💰 Actualizando factura:", {
        idFactura: facturaId,
        idVendedor: vendedor.idVendedor,
        idCliente: clienteSeleccionado?.idCliente || null,
        montoCancelado: montoIngresado,
        estadoPago: true,
      })

      const success = await updateFactura({
        idFactura: facturaId,
        idVendedor: vendedor.idVendedor,
        idCliente: clienteSeleccionado?.idCliente || null,
        montoCancelado: montoIngresado,
        estadoPago: true,
      })

      if (success) {
        // 5. Esperar y recargar la factura completa
        setTimeout(async () => {
          await fetchFacturaById(facturaId!)
          setMostrarResumenFinal(true)
        }, 1000)
      } else {
        alert("Error al procesar la venta")
      }
    } catch (error: any) {
      console.error("❌ Error procesando venta:", error)
      alert(`Error al procesar la venta: ${error.response?.data?.message || error.message || 'Error desconocido'}`)
    }
  }

  // NUEVA VENTA
  const nuevaVenta = () => {
    setCarrito([])
    setIdFacturaActual(null)
    setNumeroFactura(null)
    setClienteSeleccionado(null)
    setMontoCancelado("")
    setMostrarResumenFinal(false)
  }

  const totales = calcularTotales()

  // Mostrar error si no se puede cargar el vendedor
  if (errorVendedor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Error de Autenticación</h2>
          </div>
          <p className="text-gray-600 mb-4">{errorVendedor}</p>
          <p className="text-sm text-gray-500">Por favor, inicie sesión nuevamente.</p>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras carga el vendedor
  if (loadingVendedor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4a9d9d] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando información del vendedor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* MODAL CONFIRMACIÓN */}
        <ConfirmModal
          isOpen={mostrarModalConfirm}
          onClose={() => setMostrarModalConfirm(false)}
          onConfirm={procesarVenta}
          title="Confirmar Venta"
          message="¿Está seguro de procesar esta venta? Esta acción no se puede deshacer."
          type="success"
        />

        {/* MODAL RESUMEN FINAL */}
        {mostrarResumenFinal && factura && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Receipt size={28} className="text-[#4a9d9d]" />
                  Factura #{factura.numeroFactura}
                </h2>
                <button
                  onClick={nuevaVenta}
                  className="bg-[#4a9d9d] text-white px-4 py-2 rounded-lg hover:bg-[#5aadad] transition"
                >
                  Nueva Venta
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Fecha:</span>
                      <p className="font-medium">
                        {new Date(factura.fechaEmision).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <p className="font-medium">{factura.estadoPago ? "Pagado" : "Pendiente"}</p>
                    </div>
                  </div>
                </div>
                {(factura.cliente || factura.vendedor) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {factura.cliente && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Cliente</h3>
                        <p className="text-sm">
                          {factura.cliente.nombre} {factura.cliente.apellido1}
                        </p>
                        <p className="text-xs text-gray-600">Cédula: {factura.cliente.cedula}</p>
                      </div>
                    )}
                    {factura.vendedor && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Vendedor</h3>
                        <p className="text-sm">
                          {factura.vendedor.nombre} {factura.vendedor.apellido1}
                        </p>
                        <p className="text-xs text-gray-600">Cédula: {factura.vendedor.cedula}</p>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Detalles de la Venta</h3>
                  <div className="space-y-2">
                    {factura.detalles.map((detalle, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-gray-200 pb-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {detalle.producto?.nombre || detalle.servicio?.nombre}
                          </p>
                          <p className="text-xs text-gray-600">
                            Cantidad: {detalle.cantidad} x ₡
                            {((detalle.subtotal / detalle.cantidad) || 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">₡{detalle.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {(() => {
                  const totalesReales = calcularTotalesReales(factura)
                  return (
                    <div className="border-t border-gray-300 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₡{totalesReales.subtotal.toFixed(2)}</span>
                      </div>
                      {totalesReales.descuento > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Descuento:</span>
                          <span>-₡{totalesReales.descuento.toFixed(2)}</span>
                        </div>
                      )}
                      {totalesReales.impuesto > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Impuesto:</span>
                          <span>₡{totalesReales.impuesto.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-[#4a9d9d]">₡{totalesReales.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Monto Cancelado:</span>
                        <span>₡{factura.montoCancelado.toFixed(2)}</span>
                      </div>
                      {factura.montoCancelado < totalesReales.total && (
                        <div className="flex justify-between text-sm text-red-600 font-semibold">
                          <span>Saldo Pendiente:</span>
                          <span>₡{(totalesReales.total - factura.montoCancelado).toFixed(2)}</span>
                        </div>
                      )}
                      {factura.montoCancelado > totalesReales.total && (
                        <div className="flex justify-between text-sm text-green-600 font-semibold">
                          <span>Cambio:</span>
                          <span>₡{(factura.montoCancelado - totalesReales.total).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* MODAL CLIENTE INTELIGENTE */}
        {mostrarModalCliente && (
          <ModalCliente
            onClose={() => setMostrarModalCliente(false)}
            onClienteCreado={(cliente: Cliente) => {
              setClienteSeleccionado(cliente)
              setMostrarModalCliente(false)
            }}
            clientes={clientes}
            fetchClientes={fetchClientes}
            fetchClienteByCedula={fetchClienteByCedula}
            createCliente={createCliente}
            loading={loadingClientes}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PANEL DE ACCIONES */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag size={24} className="text-[#4a9d9d]" />
                  Agregar Items
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setTipoModal("producto")
                      setMostrarModal(true)
                      setSearchTerm("")
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#4a9d9d] text-white px-4 py-3 rounded-lg hover:bg-[#5aadad] transition font-medium shadow-sm"
                  >
                    <Package size={20} />
                    Agregar Producto
                  </button>
                  <button
                    onClick={() => {
                      setTipoModal("servicio")
                      setMostrarModal(true)
                      setSearchTerm("")
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#9d8560] text-white px-4 py-3 rounded-lg hover:bg-[#b89d7d] transition font-medium shadow-sm"
                  >
                    <Briefcase size={20} />
                    Agregar Servicio
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <User size={18} />
                  Información de Venta
                </h3>
                <div className="space-y-3">
                  {/* INFORMACIÓN DEL VENDEDOR AUTENTICADO */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Vendedor</label>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                      <div className="text-sm">
                        <p className="font-medium">
                          {vendedor?.nombre} {vendedor?.apellido1}
                        </p>
                        <p className="text-xs text-gray-600">
                          Cédula: {vendedor?.cedula}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SELECCIÓN DE CLIENTE */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Cliente (Opcional)</label>
                    {clienteSeleccionado ? (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                        <div className="text-sm">
                          <p className="font-medium">
                            {clienteSeleccionado.nombre} {clienteSeleccionado.apellido1}
                          </p>
                          <p className="text-xs text-gray-600">
                            Cédula: {clienteSeleccionado.cedula}
                          </p>
                        </div>
                        <button
                          onClick={() => setClienteSeleccionado(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMostrarModalCliente(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#4a9d9d] text-white px-3 py-2 rounded-lg hover:bg-[#5aadad] transition text-sm font-medium"
                      >
                        <User size={18} />
                        Seleccionar Cliente
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Resumen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items:</span>
                    <span className="font-medium">{carrito.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Cantidad total:</span>
                    <span className="font-medium">
                      {carrito.reduce((s, i) => s + i.cantidad, 0)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₡{totales.subtotal.toFixed(2)}</span>
                    </div>
                    {totales.descuento > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuento:</span>
                        <span>-₡{totales.descuento.toFixed(2)}</span>
                      </div>
                    )}
                    {totales.impuesto > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Impuesto:</span>
                        <span>₡{totales.impuesto.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-[#4a9d9d]">₡{totales.total.toFixed(2)}</span>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Monto Cancelado</label>
                      <input
                        type="number"
                        value={montoCancelado}
                        onChange={(e) => setMontoCancelado(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                      />
                    </div>

                    {montoCancelado && parseFloat(montoCancelado) > 0 && (
                      <div className="text-xs space-y-1">
                        {parseFloat(montoCancelado) >= totales.total ? (
                          <div className="flex justify-between text-green-600 font-semibold">
                            <span>Cambio:</span>
                            <span>₡{(parseFloat(montoCancelado) - totales.total).toFixed(2)}</span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-red-600 font-semibold">
                            <span>Faltante:</span>
                            <span>₡{(totales.total - parseFloat(montoCancelado)).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

               <button
                  onClick={() => setMostrarModalConfirm(true)}
                  disabled={carrito.length === 0 || loadingFactura}
                  className="w-full mt-4 bg-[#9d8560] text-white px-4 py-3 rounded-lg hover:bg-[#b89d7d] transition font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingFactura ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Receipt size={20} />
                      Procesar Venta
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CARRITO DE COMPRAS */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingCart size={24} className="text-[#4a9d9d]" />
                  Carrito de Venta
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {carrito.length === 0
                    ? "No hay items en el carrito"
                    : `${carrito.length} items agregados`}
                </p>
              </div>

              <div className="p-6">
                {carrito.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">El carrito está vacío</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Agrega productos o servicios para comenzar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {carrito.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            item.tipo === "producto" ? "bg-[#4a9d9d]/10" : "bg-[#9d8560]/10"
                          }`}
                        >
                          {item.tipo === "producto" ? (
                            <Package className="text-[#4a9d9d]" size={24} />
                          ) : (
                            <Briefcase className="text-[#9d8560]" size={24} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.nombre}</h3>
                          <p className="text-sm text-gray-500 truncate">{item.descripcion}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">
                              ₡{item.precioUnitario.toFixed(2)} c/u
                            </span>
                            {item.tipo === "producto" && (
                              <span className="text-xs text-gray-500">
                                Stock: {item.stockDisponible}
                              </span>
                            )}
                            {item.impuesto > 0 && (
                              <span className="text-xs text-blue-600">
                                IVA: {item.impuesto}%
                              </span>
                            )}
                            {item.descuento > 0 && (
                              <span className="text-xs text-green-600">
                                Desc: {item.descuento}%
                              </span>
                            )}
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.tipo === "producto"
                                  ? "bg-[#4a9d9d]/10 text-[#4a9d9d]"
                                  : "bg-[#9d8560]/10 text-[#9d8560]"
                              }`}
                            >
                              {item.tipo === "producto" ? "Producto" : "Servicio"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-2 py-1">
                            <button
                              onClick={() => actualizarCantidad(item.id, -1)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                              disabled={item.cantidad <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-medium text-gray-900 w-8 text-center">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => actualizarCantidad(item.id, 1)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-right min-w-24">
                            <p className="font-semibold text-gray-900">
                              ₡{item.subtotal.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL PRODUCTOS/SERVICIOS */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {tipoModal === "producto" ? (
                    <>
                      <Package size={24} className="text-[#4a9d9d]" /> Seleccionar Producto
                    </>
                  ) : (
                    <>
                      <Briefcase size={24} className="text-[#9d8560]" /> Seleccionar Servicio
                    </>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setMostrarModal(false)
                    setSearchTerm("")
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {(tipoModal === "producto" ? loadingProductos : loadingServicios) ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando...</p>
                  </div>
                ) : itemsFiltrados.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No se encontraron {tipoModal === "producto" ? "productos" : "servicios"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {itemsFiltrados.map((item: any) => (
                      <div
                        key={tipoModal === "producto" ? item.idProducto : item.idServicio}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#4a9d9d] hover:shadow-md transition cursor-pointer"
                        onClick={() => agregarAlCarrito(item, tipoModal)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{item.nombre}</h3>
                          <span className="text-[#4a9d9d] font-semibold">
                            ₡{(item.monto ?? item.precio ?? 0).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.descripcion}</p>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          {tipoModal === "producto" && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                item.stock > 10
                                  ? "bg-green-100 text-green-700"
                                  : item.stock > 0
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              Stock: {item.stock}
                            </span>
                          )}
                          {item.impuesto > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              IVA: {item.impuesto}%
                            </span>
                          )}
                          {item.descuento > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                              Desc: {item.descuento}%
                            </span>
                          )}
                          <button className="text-sm text-[#4a9d9d] hover:text-[#5aadad] font-medium ml-auto">
                            Agregar +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VentasModule