import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Minus, Trash2, Package, Briefcase, Search, X, ShoppingBag, User, Receipt } from "lucide-react"
import { useProductos } from "../hooks/useProdutos"
import { useServicios } from "../hooks/useServicios"
import { useFacturas } from "../hooks/useFacturas"
import { useDetalleFactura } from "../hooks/useDetalleFactura"

type ItemVenta = {
  id: string
  tipo: "producto" | "servicio"
  idItem: number
  nombre: string
  descripcion: string
  precioUnitario: number
  cantidad: number
  subtotal: number
  stockDisponible?: number
}

const VentasModule = () => {
  const { productos, loading: loadingProductos } = useProductos()
  const { servicios, loading: loadingServicios } = useServicios()
  const { factura, createFactura, fetchFacturaById, updateFactura, loading: loadingFactura } = useFacturas()
  const { addDetalleFactura, loading: loadingDetalle } = useDetalleFactura()

  const [carrito, setCarrito] = useState<ItemVenta[]>([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [tipoModal, setTipoModal] = useState<"producto" | "servicio">("producto")
  const [searchTerm, setSearchTerm] = useState("")
  const [idFacturaActual, setIdFacturaActual] = useState<number | null>(null)
  const [idVendedor, setIdVendedor] = useState<string>("")
  const [idCliente, setIdCliente] = useState<string>("")
  const [montoCancelado, setMontoCancelado] = useState<string>("")
  const [mostrarResumenFinal, setMostrarResumenFinal] = useState(false)

  // Filtrar productos/servicios
  const itemsFiltrados =
    tipoModal === "producto"
      ? productos.filter(
          (p) =>
            p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : servicios.filter(
          (s) =>
            s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
        )

  // Crear factura al agregar primer item
  const inicializarFactura = async () => {
    if (!idFacturaActual) {
      const nuevaFactura = await createFactura()
      if (nuevaFactura) {
        setIdFacturaActual(nuevaFactura.idFactura)
        console.log("Factura creada:", nuevaFactura)
      }
    }
  }

  // Agregar item al carrito
  const agregarAlCarrito = async (item: any, tipo: "producto" | "servicio") => {
    const itemId = `${tipo}-${tipo === "producto" ? item.idProducto : item.idServicio}`
    const existente = carrito.find((i) => i.id === itemId)

    if (existente) {
      if (tipo === "producto" && existente.cantidad >= item.stock) {
        alert("No hay suficiente stock disponible")
        return
      }

      const nuevaCantidad = existente.cantidad + 1
      setCarrito(
        carrito.map((i) =>
          i.id === itemId ? { ...i, cantidad: nuevaCantidad, subtotal: nuevaCantidad * i.precioUnitario } : i,
        ),
      )

      // Actualizar en backend si ya existe la factura
      if (idFacturaActual) {
        await addDetalleFactura({
          idFactura: idFacturaActual,
          cantidad: 1,
          idProducto: tipo === "producto" ? item.idProducto : null,
          idServicio: tipo === "servicio" ? item.idServicio : null,
        })
      }
    } else {
      // Inicializar factura si no existe
      await inicializarFactura()

      const nuevoItem: ItemVenta = {
        id: itemId,
        tipo,
        idItem: tipo === "producto" ? item.idProducto : item.idServicio,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precioUnitario: item.monto ?? item.precio ?? 0,
        cantidad: 1,
        subtotal: item.monto ?? item.precio ?? 0,
        stockDisponible: tipo === "producto" ? item.stock : undefined,
      }
      setCarrito([...carrito, nuevoItem])

      // Agregar detalle a la factura en backend
      if (idFacturaActual) {
        await addDetalleFactura({
          idFactura: idFacturaActual,
          cantidad: 1,
          idProducto: tipo === "producto" ? item.idProducto : null,
          idServicio: tipo === "servicio" ? item.idServicio : null,
        })
      }
    }

    setMostrarModal(false)
    setSearchTerm("")
  }

  // Actualizar cantidad
  const actualizarCantidad = async (itemId: string, cambio: number) => {
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
          ? {
              ...i,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * i.precioUnitario,
            }
          : i,
      ),
    )

    // Agregar diferencia al backend
    if (idFacturaActual && cambio > 0) {
      await addDetalleFactura({
        idFactura: idFacturaActual,
        cantidad: cambio,
        idProducto: item.tipo === "producto" ? item.idItem : null,
        idServicio: item.tipo === "servicio" ? item.idItem : null,
      })
    }
  }

  // Eliminar item del carrito
  const eliminarDelCarrito = (itemId: string) => {
    setCarrito(carrito.filter((item) => item.id !== itemId))
    // Nota: Para eliminar del backend necesitarías implementar un endpoint de eliminación
  }

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + item.subtotal, 0)
  }

  // Procesar venta
  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío")
      return
    }

    if (!idVendedor) {
      alert("Debe ingresar el ID del vendedor")
      return
    }

    if (!idFacturaActual) {
      alert("No se ha creado una factura")
      return
    }

    // Actualizar factura con vendedor, cliente y monto cancelado
    const success = await updateFactura({
      idFactura: idFacturaActual,
      idVendedor: parseInt(idVendedor),
      idCliente: idCliente ? parseInt(idCliente) : null,
      montoCancelado: montoCancelado ? parseFloat(montoCancelado) : 0,
      estadoPago: true,
    })

    if (success) {
      // Obtener factura completa con todos los detalles
      await fetchFacturaById(idFacturaActual)
      setMostrarResumenFinal(true)
    } else {
      alert("Error al procesar la venta")
    }
  }

  // Resetear venta
  const nuevaVenta = () => {
    setCarrito([])
    setIdFacturaActual(null)
    setIdVendedor("")
    setIdCliente("")
    setMontoCancelado("")
    setMostrarResumenFinal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modal Resumen Final */}
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
                {/* Info General */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Fecha:</span>
                      <p className="font-medium">{new Date(factura.fechaEmision).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <p className="font-medium">{factura.estadoPago ? "✅ Pagado" : "⏳ Pendiente"}</p>
                    </div>
                  </div>
                </div>

                {/* Cliente y Vendedor */}
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

                {/* Detalles */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Detalles de la Venta</h3>
                  <div className="space-y-2">
                    {factura.detalles.map((detalle, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <div className="flex-1">
                          <p className="font-medium">
                            {detalle.producto?.nombre || detalle.servicio?.nombre}
                          </p>
                          <p className="text-xs text-gray-600">Cantidad: {detalle.cantidad}</p>
                        </div>
                        <p className="font-semibold">₡{detalle.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="border-t border-gray-300 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₡{factura.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento:</span>
                    <span>-₡{factura.descuento.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuesto:</span>
                    <span>₡{factura.impuesto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-[#4a9d9d]">₡{factura.montoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Monto Cancelado:</span>
                    <span>₡{factura.montoCancelado.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Acciones */}
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

              {/* Información de Venta */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <User size={18} />
                  Datos de Venta
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ID Vendedor *</label>
                    <input
                      type="number"
                      value={idVendedor}
                      onChange={(e) => setIdVendedor(e.target.value)}
                      placeholder="Ej: 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">ID Cliente (Opcional)</label>
                    <input
                      type="number"
                      value={idCliente}
                      onChange={(e) => setIdCliente(e.target.value)}
                      placeholder="Ej: 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                    />
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
                </div>
              </div>

              {/* Resumen del Carrito */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Resumen</h3>
                <div className="space-y-2 text-sm">
                  {idFacturaActual && (
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Factura #:</span>
                      <span className="font-medium text-[#4a9d9d]">{idFacturaActual}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Items:</span>
                    <span className="font-medium">{carrito.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Cantidad total:</span>
                    <span className="font-medium">{carrito.reduce((sum, item) => sum + item.cantidad, 0)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-[#4a9d9d]">₡{calcularTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={procesarVenta}
                  disabled={carrito.length === 0 || !idVendedor || loadingFactura}
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

          {/* Carrito de Compras */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingCart size={24} className="text-[#4a9d9d]" />
                  Carrito de Venta
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {carrito.length === 0 ? "No hay items en el carrito" : `${carrito.length} items agregados`}
                </p>
              </div>

              <div className="p-6">
                {carrito.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">El carrito está vacío</p>
                    <p className="text-gray-400 text-sm mt-2">Agrega productos o servicios para comenzar</p>
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
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{item.nombre}</h3>
                              <p className="text-sm text-gray-500 truncate">{item.descripcion}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">₡{item.precioUnitario.toFixed(2)} c/u</span>
                                {item.tipo === "producto" && (
                                  <span className="text-xs text-gray-500">Stock: {item.stockDisponible}</span>
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
                            <span className="font-medium text-gray-900 w-8 text-center">{item.cantidad}</span>
                            <button
                              onClick={() => actualizarCantidad(item.id, 1)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="text-right min-w-24">
                            <p className="font-semibold text-gray-900">₡{item.subtotal.toFixed(2)}</p>
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
      </div>

      {/* Modal para Agregar Items */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {tipoModal === "producto" ? (
                  <>
                    <Package size={24} className="text-[#4a9d9d]" />
                    Seleccionar Producto
                  </>
                ) : (
                  <>
                    <Briefcase size={24} className="text-[#9d8560]" />
                    Seleccionar Servicio
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                      <div className="flex items-center justify-between">
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
  )
}

export default VentasModule