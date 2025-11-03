import type React from "react"
import { useState } from "react"
import {
  Plus,
  Search,
  Users,
  FileText,
  X,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Filter,
  Trash2,
  ShoppingCart,
  Eye,
} from "lucide-react"
import { useCondicionesPagoProveedor, useProveedores } from "../hooks/useProveedores"
import { useOrdenPedidos } from "../hooks/useOrdenPedidos"
import { useDetalleOrdenPedido } from "../hooks/useDetalleOrdenPedido"
import { useProductos } from "../hooks/useProdutos"
import type { Proveedor, CreateProveedorDto, VistaProveedor } from "../types/proveedor"
import type { CreateOrdenPedidoDto, VistaOrdenPedido } from "../types/ordenPedido"
import type { CreateDetalleOrdenPedidoDto } from "../types/detalleOrdenPedido"

// Función para extraer mensaje de error de Axios
const getErrorMessage = (error: any): string => {
  // Verifica si es un error de Axios
  if (error?.response) {
    // Intenta obtener el mensaje del backend
    const data = error.response?.data
    
    // Si hay un array de mensajes (formato específico del backend)
    if (data?.mensajes && Array.isArray(data.mensajes)) {
      return data.mensajes.join(', ')
    }
    
    // Intentar otras propiedades comunes
    const backendMessage = data?.message || 
                          data?.error ||
                          data?.mensaje ||
                          data
    
    if (typeof backendMessage === 'string') {
      return backendMessage
    }
    
    // Si hay un array de errores
    if (Array.isArray(backendMessage)) {
      return backendMessage.join(', ')
    }
    
    // Si backendMessage es un objeto, intentar extraer información útil
    if (typeof backendMessage === 'object' && backendMessage !== null) {
      // Intentar obtener cualquier propiedad de mensaje del objeto
      const possibleMessage = backendMessage.message || 
                             backendMessage.error || 
                             backendMessage.mensaje ||
                             JSON.stringify(backendMessage)
      return typeof possibleMessage === 'string' ? possibleMessage : JSON.stringify(possibleMessage)
    }
    
    // Mensajes por código de estado solo si no hay mensaje del backend
    if (error.response?.status === 404) {
      return 'Recurso no encontrado.'
    }
    if (error.response?.status === 500) {
      return 'Error interno del servidor. Intente nuevamente.'
    }
    
    return error.message || 'Error de conexión con el servidor'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return String(error) || 'Ocurrió un error inesperado'
}

// Función para formatear cédula jurídica
const formatCedulaJuridica = (cedula: string): string => {
  // Eliminar cualquier caracter que no sea número
  const numbersOnly = cedula.replace(/\D/g, "")
  
  // Aplicar formato #-###-######
  if (numbersOnly.length === 10) {
    return `${numbersOnly.charAt(0)}-${numbersOnly.substring(1, 4)}-${numbersOnly.substring(4, 10)}`
  }
  
  // Si no tiene 10 dígitos, devolver tal cual
  return cedula
}

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }: any) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConfirm = async () => {
    setLoading(true)
    setError("")
    try {
      await onConfirm()
      setLoading(false)
      onClose()
    } catch (err: any) {
      console.error("Error en confirmación:", err)
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
                type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#4a9d9d] hover:bg-[#5aadad]"
              }`}
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProveedoresOrdenesModule = () => {
  const [activeTab, setActiveTab] = useState<"proveedores" | "ordenes" | "detalles">("proveedores")

  // Estados Proveedores
  const {
    proveedores,
    loading: loadingProveedores,
    error: errorProveedores,
    insertarProveedor,
    actualizarProveedor,
    desactivarProveedor,
    activarProveedor,
  } = useProveedores()

  const [showModalProveedor, setShowModalProveedor] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [formDataProveedor, setFormDataProveedor] = useState<CreateProveedorDto>({
    cedulaJuridica: "",
    nombre: "",
    telefono: "",
  })
  const [formErrorProveedor, setFormErrorProveedor] = useState("")
  const { insertarCondicionesPago} = useCondicionesPagoProveedor()
  // Estados Órdenes
  const {
    ordenes,
    loading: loadingOrdenes,
    error: errorOrdenes,
    insertarOrdenPedido,
    actualizarOrdenPedido,
    fetchOrdenPedidos,
    actualizarMontoCancelado,
    obtenerOrdenPedidoPorId
  } = useOrdenPedidos()

  const [showModalOrden, setShowModalOrden] = useState(false)
  const [formDataOrden, setFormDataOrden] = useState<CreateOrdenPedidoDto>({
    numeroOrden: 0,
  })
  const [formErrorOrden, setFormErrorOrden] = useState("")


  // Estados para el wizard de creación de orden
  const [showWizardModal, setShowWizardModal] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardOrder, setWizardOrder] = useState<CreateOrdenPedidoDto>({ numeroOrden: 0 })
  const [wizardDetails, setWizardDetails] = useState<CreateDetalleOrdenPedidoDto[]>([])
  const [wizardFinal, setWizardFinal] = useState({ idProveedor: 0, estadoPago: false, montoCancelado: 0, acepta:false })
  const [wizardOrderId, setWizardOrderId] = useState<number | null>(null)
  const [wizardError, setWizardError] = useState("")
  const [wizardLoading, setWizardLoading] = useState(false)
  const [wizardCalculatedTotals, setWizardCalculatedTotals] = useState<{
    subtotal: number
    descuento: number
    impuesto: number
    montoTotal: number
  } | null>(null)

  // Estado para modal de ver orden
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<VistaOrdenPedido | null>(null)

  // Estados Detalles
  const {
    loading: loadingDetalles,
    error: errorDetalles,
    createDetalle,
    updateDetalle,
  } = useDetalleOrdenPedido()

  const { productos } = useProductos()

  const [showModalDetalle, setShowModalDetalle] = useState(false)
  const [editingDetalle, setEditingDetalle] = useState<any | null>(null)
  const [formDataDetalle, setFormDataDetalle] = useState<CreateDetalleOrdenPedidoDto>({
    idOrdenPedido: 0,
    cantidad: 1,
    idProducto: 0,
  })
  const [formErrorDetalle, setFormErrorDetalle] = useState("")
  const [searchDetalles, setSearchDetalles] = useState("")

  // Estado para modal de actualizar monto
  const [showMontoModal, setShowMontoModal] = useState(false)
  const [selectedOrdenForMonto, setSelectedOrdenForMonto] = useState<VistaOrdenPedido | null>(null)
  const [montoInput, setMontoInput] = useState<number>(0)
  const [montoError, setMontoError] = useState("")
  const [montoLoading, setMontoLoading] = useState(false)

  // Estado para modal de confirmación
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void | Promise<void>
    type: "danger" | "success"
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  })

  interface VistaToProveedor {
    idProveedor: number;
    cedulaJuridica: string;
    nombre: string;
    telefono: string;
    estado: boolean;
  }

  // Handlers Proveedores
  const handleOpenModalProveedor = (proveedor?: VistaProveedor) => {
    if (proveedor) {
        const payload: VistaToProveedor = {
        idProveedor: proveedor.idProveedor,
         cedulaJuridica: proveedor.cedulaJuridica,
         nombre: proveedor.nombre,
         telefono: proveedor.telefono,
         estado: proveedor.estado === 'Activo',
       }
      setEditingProveedor(payload)
      setFormDataProveedor({
        cedulaJuridica: proveedor.cedulaJuridica,
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
      })
    } else {
      setEditingProveedor(null)
      setFormDataProveedor({
        cedulaJuridica: "",
        nombre: "",
        telefono: "",
      })
    }
    setFormErrorProveedor("")
    setShowModalProveedor(true)
  }

  const handleCloseModalProveedor = () => {
    setShowModalProveedor(false)
    setEditingProveedor(null)
    setFormErrorProveedor("")
  }

  const handleSubmitProveedor = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrorProveedor("")

    try {
      if (editingProveedor) {
        await actualizarProveedor(formDataProveedor)
      } else {
        await insertarProveedor(formDataProveedor)
      }
      handleCloseModalProveedor()
    } catch (err: any) {
      setFormErrorProveedor(getErrorMessage(err))
    }
  }

  const handleToggleEstadoProveedor = (proveedor: VistaProveedor) => {
    const esActivo = proveedor.estado === 'Activo'
    const accion = esActivo ? "desactivar" : "activar"
    setConfirmModal({
      isOpen: true,
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Proveedor?`,
      message: `¿Está seguro de ${accion} al proveedor "${proveedor.nombre}"?`,
      type: esActivo ? "danger" : "success",
      onConfirm: async () => {
        try {
          if (esActivo) {
            await desactivarProveedor(proveedor.cedulaJuridica)
          } else {
            await activarProveedor(proveedor.cedulaJuridica)
          }
        } catch (err: any) {
          alert(err.message)
        }
      },
    })
  }

  // Handlers Órdenes
  const handleOpenModalOrden = () => {
    setWizardStep(1)
    setWizardOrder({ numeroOrden: 0 })
    setWizardDetails([])
    setWizardFinal({ idProveedor: 0, estadoPago: false, montoCancelado: 0, acepta:false })
    setWizardOrderId(null)
    setWizardError("")
    setWizardCalculatedTotals(null)
    setShowWizardModal(true)
  }

  const handleCloseModalOrden = () => {
    setShowModalOrden(false)
    setFormErrorOrden("")
  }

  const handleCloseModalDetalle = () => {
    setShowModalDetalle(false)
    setEditingDetalle(null)
    setFormErrorDetalle("")
  }

  const handleCloseWizardModal = () => {
    if (wizardStep < 3) return // No cerrar hasta finalizar
    setShowWizardModal(false)
  }

  const handleWizardNext = async () => {
    setWizardLoading(true)
    setWizardError("")
    try {
      if (wizardStep === 1) {
        // Validar número de orden
        if (!wizardOrder.numeroOrden || wizardOrder.numeroOrden <= 0) {
          setWizardError("Debe ingresar un número de orden válido")
          setWizardLoading(false)
          return
        }
        // Solo avanzar al paso 2, sin insertar en BD
        setWizardStep(2)
      } else if (wizardStep === 2) {
        // Validar que haya al menos un detalle
        if (wizardDetails.length === 0) {
          setWizardError("Debe agregar al menos un producto a la orden")
          setWizardLoading(false)
          return
        }

        // Validar que todos los detalles tengan un producto seleccionado y cantidad > 0
        const detallesSinProducto = wizardDetails.filter(d => d.idProducto === 0)
        if (detallesSinProducto.length > 0) {
          setWizardError("Todos los productos deben estar seleccionados")
          setWizardLoading(false)
          return
        }

        const detallesSinCantidad = wizardDetails.filter(d => d.cantidad <= 0)
        if (detallesSinCantidad.length > 0) {
          setWizardError("Todos los productos deben tener una cantidad mayor a 0")
          setWizardLoading(false)
          return
        }

        // Calcular totales en frontend basado en los productos seleccionados
        let subtotalCalculado = 0
        let impuestoCalculado = 0
        let descuentoCalculado = 0

        wizardDetails.forEach(detail => {
          const producto = productos.find(p => p.idProducto === detail.idProducto)
          if (producto) {
            const cantidad = detail.cantidad
            const precioBase = producto.monto * cantidad
            const impuesto = (precioBase * (producto.impuesto / 100))
            const descuento = (precioBase * (producto.descuento / 100))
            
            // Subtotal NO incluye impuesto, solo precio base
            subtotalCalculado += precioBase
            impuestoCalculado += impuesto
            descuentoCalculado += descuento
          }
        })

        // MontoTotal = Subtotal + Impuesto - Descuento
        const montoTotalCalculado = subtotalCalculado + impuestoCalculado - descuentoCalculado

        // Guardar totales calculados para mostrar en paso 3
        setWizardCalculatedTotals({
          subtotal: subtotalCalculado,
          descuento: descuentoCalculado,
          impuesto: impuestoCalculado,
          montoTotal: montoTotalCalculado
        })

        // Avanzar al paso 3
        setWizardStep(3)
      } else if (wizardStep < 3) {
        setWizardStep(wizardStep + 1)
      }
    } catch (err: any) {
      setWizardError(getErrorMessage(err))
    } finally {
      setWizardLoading(false)
    }
  }

  const handleWizardBack = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1)
  }

  const handleWizardFinish = async () => {
    setWizardLoading(true)
    setWizardError("")
    try {
      // Validaciones finales
      if (wizardFinal.idProveedor <= 0) {
        setWizardError("Debe seleccionar un proveedor")
        setWizardLoading(false)
        return
      }

      // VALIDACIÓN OBLIGATORIA: Debe aceptar las condiciones de pago
      if (!wizardFinal.acepta) {
        setWizardError("Error El proveedor no ha aceptado la condición de pago. No se puede continuar.")
        setWizardLoading(false)
        return
      }

      // PASO 1: Crear la orden de pedido
      const response = await insertarOrdenPedido(wizardOrder)
      const orderId = response.idOrdenPedido
      
      if (!orderId || orderId === 0) {
        throw new Error("No se pudo crear la orden de pedido")
      }

      // PASO 2: Crear todos los detalles de la orden
      const detallesConOrden = wizardDetails.map(detail => ({
        ...detail,
        idOrdenPedido: orderId
      }))

      for (const detail of detallesConOrden) {
        await createDetalle(detail)
      }

      // PASO 3: Actualizar orden con proveedor, estado de pago y monto + condiciones de pago
      await Promise.all([
        insertarCondicionesPago(wizardFinal.idProveedor, wizardFinal.acepta),
        actualizarOrdenPedido({
          IdOrdenPedido: orderId,
          EstadoPago: wizardFinal.estadoPago,
          IdProveedor: wizardFinal.idProveedor,
          MontoCancelado: wizardFinal.montoCancelado,
        })
      ])

      // Solo después de que TODAS las peticiones terminen exitosamente, refrescar y cerrar
      await fetchOrdenPedidos()
      setShowWizardModal(false)
    } catch (err: any) {
      setWizardError(getErrorMessage(err))
    } finally {
      setWizardLoading(false)
    }
  }

  const handleAddWizardDetail = () => {
    // Ya no necesitamos validar wizardOrderId porque aún no se ha creado
    setWizardDetails([...wizardDetails, { idOrdenPedido: 0, cantidad: 1, idProducto: productos.length > 0 ? productos[0].idProducto : 0 }])
  }

  const handleUpdateWizardDetail = (index: number, field: string, value: any) => {
    const newDetails = [...wizardDetails]
    newDetails[index] = { ...newDetails[index], [field]: value }
    setWizardDetails(newDetails)
    setWizardError("") // Limpiar errores cuando se edita
  }

  const handleRemoveWizardDetail = (index: number) => {
    setWizardDetails(wizardDetails.filter((_, i) => i !== index))
    setWizardError("") // Limpiar errores cuando se elimina
  }

  const handleSubmitOrden = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrorOrden("")

    try {
      await insertarOrdenPedido(formDataOrden)
      await fetchOrdenPedidos()
      handleCloseModalOrden()
    } catch (err: any) {
      setFormErrorOrden(getErrorMessage(err))
    }
  }

  const handleactualizarOrdenPedido = (orden: VistaOrdenPedido) => {
    setSelectedOrdenForMonto(orden)
    setMontoInput(orden.montoCancelado || 0)
    setMontoError("")
    setShowMontoModal(true)
  }

  const handleSubmitMonto = async () => {
    setMontoLoading(true)
    setMontoError("")
    try {
      if (!selectedOrdenForMonto) return

      await actualizarMontoCancelado(selectedOrdenForMonto.idOrdenPedido, montoInput)
      await fetchOrdenPedidos()
      setShowMontoModal(false)
      setSelectedOrdenForMonto(null)
    } catch (err: any) {
      setMontoError(getErrorMessage(err))
    } finally {
      setMontoLoading(false)
    }
  }

  const handleViewOrder = (orden: VistaOrdenPedido) => {
    setSelectedOrder(orden)
    setShowViewModal(true)
  }


  // Handlers Detalles
  // ** MODIFICACIÓN 2: Recibir ordenId para inicializar el form **
  const handleOpenModalDetalle = (detalle?: any, ordenId?: number) => {
    if (detalle) {
      setEditingDetalle(detalle)
      setFormDataDetalle({
        idOrdenPedido: detalle.idOrdenPedido,
        cantidad: detalle.cantidad,
        idProducto: detalle.idProducto,
      })
    } else {
      setEditingDetalle(null)
      setFormDataDetalle({
        // Utiliza el ordenId si se proporciona, de lo contrario, usa la lógica anterior (primera orden en la lista).
        idOrdenPedido: ordenId || (ordenes.length > 0 ? ordenes[0].idOrdenPedido : 0),
        cantidad: 1,
        idProducto: productos.length > 0 ? productos[0].idProducto : 0,
      })
    }
    setFormErrorDetalle("")
    setShowModalDetalle(true)
  }

  const handleSubmitDetalle = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrorDetalle("")

    try {
      if (editingDetalle) {
        await updateDetalle(editingDetalle.idDetalleOrdenPedido, {
          cantidad: formDataDetalle.cantidad,
          idProducto: formDataDetalle.idProducto,
        })
      } else {
        await createDetalle(formDataDetalle)
      }
      
      await fetchOrdenPedidos()
      handleCloseModalDetalle()
    } catch (err: any) {
      setFormErrorDetalle(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Gestión de Compras</h1>
            <p className="text-sm text-gray-500 mt-1">Administra proveedores, órdenes de pedido y productos</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("proveedores")}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === "proveedores"
                  ? "bg-white text-[#4a9d9d] border-t-2 border-x border-[#4a9d9d] border-b-0"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Users size={18} />
              Proveedores
            </button>
            <button
              onClick={() => setActiveTab("ordenes")}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === "ordenes"
                  ? "bg-white text-[#4a9d9d] border-t-2 border-x border-[#4a9d9d] border-b-0"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <FileText size={18} />
              Órdenes de Pedido
            </button>
          </div>

          <div className="p-6">
            {/* Proveedores Tab */}
            {activeTab === "proveedores" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Proveedores</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona tus proveedores</p>
                  </div>
                  <button
                    onClick={() => handleOpenModalProveedor()}
                    className="flex items-center gap-2 bg-[#4a9d9d] text-white px-4 py-2.5 rounded-lg hover:bg-[#5aadad] transition shadow-sm font-medium"
                  >
                    <Plus size={18} />
                    Nuevo Proveedor
                  </button>
                </div>


                {errorProveedores && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorProveedores}</span>
                  </div>
                )}

                {loadingProveedores ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando proveedores...</p>
                  </div>
                ) : (
                  
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Cédula
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Nombre
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Teléfono
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {proveedores.map((proveedor : VistaProveedor) => (
                            <tr key={proveedor.idProveedor} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                {formatCedulaJuridica(proveedor.cedulaJuridica)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{proveedor.nombre}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{proveedor.telefono}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                    proveedor.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {proveedor.estado}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleOpenModalProveedor(proveedor)}
                                    className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleEstadoProveedor(proveedor)}
                                    className={`p-1.5 rounded-lg transition ${
                                      proveedor.estado === "Activo"
                                        ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                                        : "text-green-600 hover:text-green-800 hover:bg-green-50"
                                    }`}
                                    title={proveedor.estado === "Activo" ? "Desactivar" : "Activar"}
                                  >
                                    {proveedor.estado === "Activo" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {proveedores.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Users size={48} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">No se encontraron proveedores</p>
                        </div>
                      )}
                    </div>
           
                )}
              </>
            )}

            {/* Órdenes Tab */}
            {activeTab === "ordenes" && (
              <>
              {console.log("Órdenes Cargadas:", ordenes)}
              {console.log("Pestaña Activa:", activeTab)}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Órdenes de Pedido</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona las órdenes de compra</p>
                  </div>
                  <button
                    onClick={handleOpenModalOrden}
                    className="flex items-center gap-2 bg-[#4a9d9d] text-white px-4 py-2.5 rounded-lg hover:bg-[#5aadad] transition shadow-sm font-medium"
                  >
                    <Plus size={18} />
                    Nueva Orden
                  </button>
                </div>



                {errorOrdenes && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorOrdenes}</span>
                  </div>
                )}

                {loadingOrdenes ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando órdenes...</p>
                  </div>
                ) : (
                  
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Número
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Proveedor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Subtotal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Estado Pago
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ordenes.map((orden: VistaOrdenPedido) => (
                            <tr key={orden.idOrdenPedido} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-700 font-bold">#{orden.numeroOrden}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  {new Date(orden.fechaEmision).toLocaleDateString("es-ES")}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{orden.proveedor?.nombre || 'Sin proveedor'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">₡{orden.subtotal ? orden.subtotal.toFixed(2) : '0.00'}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-semibold">₡{orden.montoTotal ? orden.montoTotal.toFixed(2) : '0.00'}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                    orden.estadoPago === "Pagado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {orden.estadoPago}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewOrder(orden)}
                                    className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition"
                                    title="Ver detalles"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleactualizarOrdenPedido(orden)}
                                    className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                                    title="Actualizar monto cancelado"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {ordenes.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">No se encontraron órdenes</p>
                        </div>
                      )}
                    </div>
                
                )}
              </>
            )}


          </div>
        </div>
      </div>

      {/* Modal Proveedor */}
      {showModalProveedor && (
        <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h2>
              <button onClick={handleCloseModalProveedor} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorProveedor && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorProveedor}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProveedor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cédula Jurídica *</label>
                  <input
                    type="text"
                    value={formDataProveedor.cedulaJuridica}
                    onChange={(e) => {
                      setFormDataProveedor({ ...formDataProveedor, cedulaJuridica: e.target.value })
                      setFormErrorProveedor("") // Limpiar error al editar
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    disabled={!!editingProveedor}
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    value={formDataProveedor.nombre}
                    onChange={(e) => {
                      setFormDataProveedor({ ...formDataProveedor, nombre: e.target.value })
                      setFormErrorProveedor("") // Limpiar error al editar
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                  <input
                    type="text"
                    value={formDataProveedor.telefono}
                    onChange={(e) => {
                      setFormDataProveedor({ ...formDataProveedor, telefono: e.target.value })
                      setFormErrorProveedor("") // Limpiar error al editar
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    maxLength={8}
                  />
                </div>

                <div className="flex gap-3 pt-4">
           
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    {editingProveedor ? "Actualizar" : "Crear"}
                  </button>
                     <button
                    type="button"
                    onClick={handleCloseModalProveedor}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Orden */}
      {showModalOrden && (
        <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Nueva Orden de Pedido</h2>
              <button onClick={handleCloseModalOrden} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorOrden && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorOrden}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrden} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de Orden *</label>
                  <input
                    type="number"
                    value={formDataOrden.numeroOrden || ""}
                    onChange={(e) =>
                      setFormDataOrden({ ...formDataOrden, numeroOrden: Number.parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    La orden se creará sin proveedor y sin pago. El siguiente paso será agregar productos.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    Crear Orden
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModalOrden}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {showModalDetalle && (
        <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingDetalle ? "Editar Detalle" : "Agregar Producto a Orden"}
              </h2>
              <button onClick={handleCloseModalDetalle} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorDetalle && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorDetalle}</span>
                </div>
              )}

              <form onSubmit={handleSubmitDetalle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Orden de Pedido *</label>
                  <select
                    value={formDataDetalle.idOrdenPedido}
                    onChange={(e) =>
                      setFormDataDetalle({ ...formDataDetalle, idOrdenPedido: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    // ** MODIFICACIÓN 3: Deshabilitar si se está creando un detalle en una orden recién creada **
                    disabled={!!editingDetalle || (formDataDetalle.idOrdenPedido !== 0 && !editingDetalle)}
                  >
                    <option value={0}>Seleccione una orden</option>
                    {ordenes.map((orden: VistaOrdenPedido) => (
                      <option key={orden.idOrdenPedido} value={orden.idOrdenPedido}>
                        Orden #{orden.numeroOrden} - {orden.proveedor?.nombre || 'Sin proveedor'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Producto *</label>
                  <select
                    value={formDataDetalle.idProducto}
                    onChange={(e) => {
                      setFormDataDetalle({ ...formDataDetalle,idProducto: Number.parseInt(e.target.value) })
                      setFormErrorDetalle("") // Limpiar error al editar
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  >
                    <option value={0}>Seleccione un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.idProducto} value={producto.idProducto}>
                        {producto.nombre} - Stock: {producto.stock} - ₡{producto.monto.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad *</label>
                  <input
                    type="number"
                    value={formDataDetalle.cantidad}
                    onChange={(e) => {
                      setFormDataDetalle({ ...formDataDetalle, cantidad: Number.parseInt(e.target.value) || 1 })
                      setFormErrorDetalle("") // Limpiar error al editar
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    min="1"
                  />
                </div>

                {formDataDetalle.idProducto > 0 && (
                  <div className="bg-[#4a9d9d]/10 border border-[#4a9d9d]/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-[#4a9d9d] mb-2">Información del Producto</p>
                    {(() => {
                      const producto = productos.find((p) => p.idProducto === formDataDetalle.idProducto)
                      if (producto) {
                        return (
                          <div className="space-y-1 text-sm text-[#4a9d9d]">
                            <p>
                              <span className="font-medium">Stock disponible:</span> {producto.stock}
                            </p>
                            <p>
                              <span className="font-medium">Costo unitario:</span> ₡{producto.monto.toFixed(2)}
                            </p>
                            <p>
                              <span className="font-medium">Subtotal:</span> ₡
                              {(producto.monto * formDataDetalle.cantidad).toFixed(2)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    {editingDetalle ? "Actualizar" : "Agregar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModalDetalle}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Actualizar Monto */}
      {showMontoModal && selectedOrdenForMonto && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Actualizar Monto Cancelado</h2>
              <button 
                onClick={() => setShowMontoModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={montoLoading}
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-[#4a9d9d]/10 border border-[#4a9d9d]/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Orden:</span>
                  <span className="text-lg font-bold text-[#4a9d9d]">#{selectedOrdenForMonto.numeroOrden}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Proveedor:</span>
                  <span className="text-sm text-gray-900">{selectedOrdenForMonto.proveedor?.nombre || "Sin proveedor"}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monto Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₡{selectedOrdenForMonto.montoTotal.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Estado Actual:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrdenForMonto.estadoPago === "Pagado" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {selectedOrdenForMonto.estadoPago}
                  </span>
                </div>
              </div>

              {montoError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-red-700">{montoError}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Cancelado *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₡</span>
                  <input
                    type="number"
                    value={montoInput}
                    onChange={(e) => {
                      setMontoInput(Number(e.target.value) || 0)
                      setMontoError("")
                    }}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    min="0"
                    step="0.01"
                    disabled={montoLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Nota:</strong> El estado de pago se actualizará automáticamente según el monto ingresado.
                  {montoInput >= selectedOrdenForMonto.montoTotal && (
                    <span className="block text-green-600 font-medium mt-1">
                      ✓ El estado cambiará a "Pagado"
                    </span>
                  )}
                  {montoInput > 0 && montoInput < selectedOrdenForMonto.montoTotal && (
                    <span className="block text-yellow-600 font-medium mt-1">
                      ⚠ El estado será "Pendiente"
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMontoModal(false)}
                  disabled={montoLoading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitMonto}
                  disabled={montoLoading}
                  className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {montoLoading ? "Actualizando..." : "Actualizar Monto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Wizard Orden */}
      {showWizardModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Crear Orden de Pedido</h2>
              <button onClick={handleCloseWizardModal} className="text-gray-400 hover:text-gray-600 transition" disabled={wizardStep < 3}>
                <X size={22} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${wizardStep >= 1 ? 'text-[#4a9d9d]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${wizardStep >= 1 ? 'bg-[#4a9d9d] text-white' : 'bg-gray-200'}`}>1</div>
                  <span className="ml-2 text-sm font-medium">Crear Orden</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${wizardStep >= 2 ? 'bg-[#4a9d9d]' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${wizardStep >= 2 ? 'text-[#4a9d9d]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${wizardStep >= 2 ? 'bg-[#4a9d9d] text-white' : 'bg-gray-200'}`}>2</div>
                  <span className="ml-2 text-sm font-medium">Agregar Productos</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${wizardStep >= 3 ? 'bg-[#4a9d9d]' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${wizardStep >= 3 ? 'text-[#4a9d9d]' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${wizardStep >= 3 ? 'bg-[#4a9d9d] text-white' : 'bg-gray-200'}`}>3</div>
                  <span className="ml-2 text-sm font-medium">Finalizar</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {wizardError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{wizardError}</span>
                </div>
              )}

              {/* Step 1: Crear Orden */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de Orden *</label>
                    <input
                      type="number"
                      value={wizardOrder.numeroOrden || ""}
                      onChange={(e) => {
                        setWizardOrder({ ...wizardOrder, numeroOrden: Number.parseInt(e.target.value) || 0 })
                        setWizardError("") // Limpiar error al editar
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      required
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ingrese el número único para esta orden de pedido.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Agregar Detalles */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Productos en la Orden</h3>
                    <button
                      type="button"
                      onClick={handleAddWizardDetail}
                      disabled={wizardLoading}
                      className="flex items-center gap-2 bg-[#4a9d9d] text-white px-3 py-1.5 rounded-lg hover:bg-[#5aadad] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      Agregar Producto
                    </button>
                  </div>

                  {wizardDetails.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wizardDetails.map((detail, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-sm font-medium text-gray-700">Producto {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => handleRemoveWizardDetail(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Producto</label>
                              <select
                                value={detail.idProducto}
                                onChange={(e) => handleUpdateWizardDetail(index, 'idProducto', Number.parseInt(e.target.value))}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                              >
                                <option value={0}>Seleccione un producto</option>
                                {productos.map((producto) => (
                                  <option key={producto.idProducto} value={producto.idProducto}>
                                    {producto.nombre} - ₡{producto.monto.toFixed(2)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                              <input
                                type="number"
                                value={detail.cantidad}
                                onChange={(e) => handleUpdateWizardDetail(index, 'cantidad', Number.parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                                min="1"
                              />
                            </div>
                          </div>
                          {detail.idProducto > 0 && (
                            <div className="mt-3 text-xs text-[#4a9d9d]">
                              {(() => {
                                const producto = productos.find((p) => p.idProducto === detail.idProducto)
                                if (producto) {
                                  return (
                                    <p>
                                      <span className="font-medium">Subtotal:</span> ₡{(producto.monto * detail.cantidad).toFixed(2)}
                                    </p>
                                  )
                                }
                                return null
                              })()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Finalizar */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Finalizar Orden</h3>

                  {/* Mostrar totales calculados si están disponibles */}
                  {wizardCalculatedTotals && (
                    <div className="bg-gradient-to-r from-[#4a9d9d]/10 to-[#5aadad]/10 p-4 rounded-lg border border-[#4a9d9d]/20">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Resumen de la Orden</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium text-gray-900">₡{wizardCalculatedTotals.subtotal.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Impuesto:</span>
                          <span className="font-medium text-gray-900">₡{wizardCalculatedTotals.impuesto.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Descuento:</span>
                          <span className="font-medium text-red-600">-₡{wizardCalculatedTotals.descuento.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#4a9d9d]/20">
                          <span className="font-semibold text-gray-700">Total:</span>
                          <span className="font-bold text-[#4a9d9d] text-lg">₡{wizardCalculatedTotals.montoTotal.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Proveedor</label>
                      <select
                        value={wizardFinal.idProveedor}
                        onChange={(e) => setWizardFinal({ ...wizardFinal, idProveedor: Number.parseInt(e.target.value) })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      >
                        <option value={0}>Sin proveedor</option>
                        {proveedores.map((proveedor: VistaProveedor) => (
                          <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                            {proveedor.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado de Pago</label>
                      <select
                        value={wizardFinal.estadoPago.toString()}
                        onChange={(e) => setWizardFinal({ ...wizardFinal, estadoPago: e.target.value === 'true' })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      >
                        <option value="false">Pendiente</option>
                        <option value="true">Pagado</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Monto Cancelado (Opcional)</label>
                      <input
                        type="number"
                        value={wizardFinal.montoCancelado || ""}
                        onChange={(e) => setWizardFinal({ ...wizardFinal, montoCancelado: Number.parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Aceptar Términos y Condiciones</label>
                      <input
                        type="checkbox"
                        checked={wizardFinal.acepta}
                        onChange={(e) => setWizardFinal({ ...wizardFinal, acepta: e.target.checked })}
                        className="h-4 w-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#4a9d9d] bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleWizardBack}
                  disabled={wizardStep === 1 || wizardLoading}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <div className="flex gap-3">
                  {wizardStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleWizardNext}
                      disabled={wizardLoading || (wizardStep === 1 && wizardOrder.numeroOrden === 0)}
                      className="px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {wizardLoading ? 'Procesando...' : 'Siguiente'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleWizardFinish}
                      disabled={wizardLoading}
                      className="px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {wizardLoading ? 'Finalizando...' : 'Finalizar Orden'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ver Orden */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Detalles de la Orden #{selectedOrder.numeroOrden}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Información General */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Información General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Número de Orden</label>
                      <p className="text-sm text-gray-900 font-medium">#{selectedOrder.numeroOrden}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Fecha de Emisión</label>
                      <p className="text-sm text-gray-900">{new Date(selectedOrder.fechaEmision).toLocaleString("es-ES")}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Estado de Pago</label>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.estadoPago === "Pagado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {selectedOrder.estadoPago}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Monto Cancelado</label>
                      <p className="text-sm text-gray-900">₡{selectedOrder.montoCancelado?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>

                {/* Información Financiera */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Financiera</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Subtotal</label>
                      <p className="text-lg font-semibold text-gray-900">₡{selectedOrder.subtotal?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Impuestos</label>
                      <p className="text-lg font-semibold text-gray-900">₡{selectedOrder.impuesto?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Descuento</label>
                      <p className="text-lg font-semibold text-gray-900">₡{selectedOrder.descuento?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-600">Monto Total</label>
                      <p className="text-2xl font-bold text-[#4a9d9d]">₡{selectedOrder.montoTotal?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Proveedor */}
                {selectedOrder.proveedor && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Proveedor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Nombre</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedOrder.proveedor.nombre}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Cédula Jurídica</label>
                        <p className="text-sm text-gray-900">{selectedOrder.proveedor.cedulaJuridica}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                        <p className="text-sm text-gray-900">{selectedOrder.proveedor.telefono}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Estado</label>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder.proveedor.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {selectedOrder.proveedor.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detalles de Productos */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Productos en la Orden</h3>
                  {selectedOrder.detalles && selectedOrder.detalles.length > 0 ? (
                    <div className="space-y-3">
                      {selectedOrder.detalles.map((detalle, index) => (
                        <div key={detalle.idDetalleOrdenPedido || index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{detalle.producto?.nombre || 'Producto no disponible'}</h4>
                              <p className="text-sm text-gray-600">{detalle.producto?.descripcion || 'Sin descripción'}</p>
                            </div>
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Cantidad</label>
                              <p className="font-medium">{detalle.cantidad}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Precio Unitario</label>
                              <p className="font-medium">₡{detalle.producto?.monto?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Subtotal</label>
                              <p className="font-medium">₡{detalle.subtotal?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Impuesto</label>
                              <p className="font-medium">₡{detalle.impuesto?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Descuento</label>
                              <p className="font-medium">₡{detalle.descuento?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Stock Disponible</label>
                              <p className="font-medium">{detalle.producto?.stock || 0}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Categoría</label>
                              <p className="font-medium">{detalle.producto?.categoria?.nombre || 'Sin categoría'}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">Estado Producto</label>
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                detalle.producto?.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {detalle.producto?.estado ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No hay productos en esta orden</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />
    </div>
  )
}

export default ProveedoresOrdenesModule