// components/Ventas/ModalCrearCliente.tsx
import { useState, useEffect, useCallback } from "react"
import { X, UserPlus, Search, User, ArrowLeft } from "lucide-react"
import type { Cliente, CreateClienteDto } from "../../types/cliente"
import { useCedulaLookup } from "../../hooks/useCedulaLookup" // 👈 NUEVO IMPORT

interface ModalCrearClienteProps {
  onClose: () => void
  onClienteCreado?: (cliente: Cliente) => void
  onClienteSeleccionado?: (cliente: Cliente) => void
  createCliente: (data: CreateClienteDto) => Promise<Cliente | null>
  loading: boolean
  clientes?: Cliente[]
  fetchClientes?: () => Promise<void>
  fetchClienteByCedula?: (cedula: number) => Promise<Cliente | null>
}

const ModalCrearCliente = ({ 
  onClose, 
  onClienteCreado, 
  createCliente, 
  loading,
  clientes = [],
  fetchClientes,
  fetchClienteByCedula,
}: ModalCrearClienteProps) => {
  const [modo, setModo] = useState<"buscar" | "crear">("buscar")
  const [searchTerm, setSearchTerm] = useState("")
  const [cedulaBuscada, setCedulaBuscada] = useState("")
  const [error, setError] = useState("")
  const [creandoCliente, setCreandoCliente] = useState(false)

  // 👇 NUEVO: Hook para búsqueda de cédula en API externa
  const { lookup, isLoading: loadingCedula } = useCedulaLookup()

  const [formData, setFormData] = useState<CreateClienteDto>({
    nombre: "",
    apellido1: "",
    apellido2: "",
    tipoCliente: "Regular",
    cedula: 0,
    contacto: "",
    correoElectronico: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar clientes al abrir
  const cargarClientes = useCallback(async () => {
    if (fetchClientes && clientes.length === 0) {
      await fetchClientes()
    }
  }, [fetchClientes, clientes.length])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  // Filtrar clientes (manejo seguro de valores nulos)
  const clientesFiltrados = clientes.filter((c) => {
    const searchLower = searchTerm.toLowerCase()
    const nombre = c.nombre?.toLowerCase() || ""
    const apellido1 = c.apellido1?.toLowerCase() || ""
    const apellido2 = c.apellido2?.toLowerCase() || ""
    const cedula = c.cedula?.toString() || ""
    
    return (
      nombre.includes(searchLower) ||
      apellido1.includes(searchLower) ||
      apellido2.includes(searchLower) ||
      cedula.includes(searchTerm)
    )
  })

  // Buscar por cédula
  const buscarPorCedula = async () => {
    if (!cedulaBuscada || cedulaBuscada.length < 3) return
    if (!fetchClienteByCedula) {
      alert("Función de búsqueda no disponible")
      return
    }
    
    setError("")
    const cedula = parseInt(cedulaBuscada)
    if (isNaN(cedula)) return

    const cliente = await fetchClienteByCedula(cedula)
    if (cliente) {
      onClienteCreado?.(cliente)
      onClose()
    } else {
      setError("Cliente no encontrado. ¿Desea crearlo?")
      setFormData({ ...formData, cedula })
      setModo("crear")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.cedula || formData.cedula <= 0) {
      newErrors.cedula = "La cédula debe ser un número válido"
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }
    if (!formData.apellido1.trim()) {
      newErrors.apellido1 = "El primer apellido es requerido"
    }
    if (!formData.apellido2.trim()) {
      newErrors.apellido2 = "El segundo apellido es requerido"
    }
    if (!formData.contacto.trim()) {
      newErrors.contacto = "El teléfono es requerido"
    }
    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
      newErrors.correoElectronico = "Correo electrónico inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setCreandoCliente(true)
    try {
      const resultado = await createCliente(formData)
      console.log("✅ Respuesta del servidor:", resultado)
      
      // Recargar la lista de clientes SIEMPRE después de crear
      if (fetchClientes) {
        console.log("🔄 Recargando lista de clientes...")
        await fetchClientes()
      }
      
      // Si el backend devolvió un objeto cliente válido, usarlo
      if (resultado && typeof resultado === 'object' && 'idCliente' in resultado) {
        console.log("📢 Notificando cliente al padre:", resultado)
        onClienteCreado?.(resultado)
      } 
      // Si solo devolvió un mensaje, buscar el cliente recién creado por cédula
      else if (resultado && fetchClienteByCedula) {
        console.log("🔍 Buscando cliente por cédula:", formData.cedula)
        const clienteCreado = await fetchClienteByCedula(formData.cedula)
        if (clienteCreado) {
          console.log("✅ Cliente encontrado:", clienteCreado)
          onClienteCreado?.(clienteCreado)
        } else {
          console.warn("⚠️ No se pudo encontrar el cliente recién creado")
          alert("Cliente creado, pero no se pudo seleccionar automáticamente. Por favor, búsquelo manualmente.")
        }
      }
      // Si no hay forma de obtener el cliente, solo notificar que se creó
      else {
        alert("Cliente creado exitosamente. Por favor, búsquelo en la lista.")
      }
      
      // Cerrar el modal
      onClose()
    } catch (error: any) {
      console.error("❌ Error al crear cliente:", error)
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
      alert(`Error al crear cliente: ${errorMessage}`)
    } finally {
      setCreandoCliente(false)
    }
  }

  const handleInputChange = (field: keyof CreateClienteDto, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  // 👇 NUEVA FUNCIÓN: Manejar cambio de cédula con búsqueda automática
  const handleCedulaChange = async (value: string) => {
    const cedula = parseInt(value) || 0
    handleInputChange("cedula", cedula)
    
    // Solo buscar si la cédula tiene entre 9 y 12 dígitos
    if (/^\d{9,12}$/.test(value)) {
      const resultado = await lookup(value)
      if (resultado) {
        // Autocompletar los campos con los datos obtenidos
        setFormData(prev => ({
          ...prev,
          nombre: resultado.firstname || "",
          apellido1: resultado.lastname1 || "",
          apellido2: resultado.lastname2 || ""
        }))
      }
    }
  }

  // Si no hay funciones de búsqueda, ir directo a crear
  useEffect(() => {
    if (!fetchClientes && !fetchClienteByCedula) {
      setModo("crear")
    }
  }, [fetchClientes, fetchClienteByCedula])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#4a9d9d] to-[#5aadad] px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {modo === "buscar" ? (
              <>
                <Search size={22} />
                Buscar Cliente
              </>
            ) : (
              <>
                <UserPlus size={22} />
                Crear Nuevo Cliente
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto">
          {/* MODO BUSCAR */}
          {modo === "buscar" && (
            <div className="p-6">
              {/* Buscar por cédula */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar por Cédula
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cedulaBuscada}
                    onChange={(e) => setCedulaBuscada(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscarPorCedula()}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    placeholder="Ingrese número de cédula"
                  />
                  <button
                    onClick={buscarPorCedula}
                    className="px-6 py-2.5 bg-[#4a9d9d] text-white rounded-lg hover:bg-[#5aadad] transition font-semibold shadow-sm"
                  >
                    Buscar
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-orange-600 mt-2 font-medium bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                    {error}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  O buscar en la lista de clientes
                </label>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    placeholder="Buscar por nombre, apellidos o cédula..."
                  />
                </div>

                {/* Lista de clientes */}
                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-3 text-gray-600 text-sm">Cargando clientes...</p>
                  </div>
                )}

                {!loading && clientesFiltrados.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <User size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-600 font-medium">No se encontraron clientes</p>
                    <p className="text-sm text-gray-500 mt-1">Intente con otro término de búsqueda</p>
                  </div>
                )}

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {!loading && clientesFiltrados.map((cliente) => (
                    <button
                      key={cliente.idCliente}
                      onClick={() => {
                        onClienteCreado?.(cliente)
                        onClose()
                      }}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-[#4a9d9d] hover:bg-[#4a9d9d]/5 transition text-left group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#4a9d9d] transition">
                            {cliente.nombre} {cliente.apellido1} {cliente.apellido2}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">Cédula: {cliente.cedula}</p>
                          {cliente.contacto && (
                            <p className="text-xs text-gray-500 mt-1">📞 {cliente.contacto}</p>
                          )}
                        </div>
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#4a9d9d]/10 text-[#4a9d9d]">
                          {cliente.tipoCliente}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODO CREAR */}
          {modo === "crear" && (
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Importante:</span> Complete todos los campos marcados con 
                  <span className="text-red-600 font-bold"> *</span> para crear el nuevo cliente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 👇 CÉDULA AHORA ES EL PRIMER CAMPO CON BÚSQUEDA AUTOMÁTICA */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cédula <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cedula || ""}
                      onChange={(e) => handleCedulaChange(e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                        errors.cedula ? "border-red-500 bg-red-50" : "border-gray-300 bg-white focus:border-[#4a9d9d]"
                      }`}
                      placeholder="Ingrese número de cédula (se autocompletará el nombre)"
                      disabled={loadingCedula}
                    />
                    {loadingCedula && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {loadingCedula && (
                    <p className="text-xs text-[#4a9d9d] mt-1.5 font-medium">🔍 Buscando información de la cédula...</p>
                  )}
                  {errors.cedula && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.cedula}</p>}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.nombre ? "border-red-500 bg-red-50" : "border-gray-300 bg-white focus:border-[#4a9d9d]"
                    }`}
                    placeholder="Juan"
                  />
                  {errors.nombre && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.nombre}</p>}
                </div>

                {/* Primer Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primer Apellido <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellido1}
                    onChange={(e) => handleInputChange("apellido1", e.target.value)}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.apellido1 ? "border-red-500 bg-red-50" : "border-gray-300 bg-white focus:border-[#4a9d9d]"
                    }`}
                    placeholder="Pérez"
                  />
                  {errors.apellido1 && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.apellido1}</p>}
                </div>

                {/* Segundo Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Segundo Apellido <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellido2}
                    onChange={(e) => handleInputChange("apellido2", e.target.value)}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.apellido2 ? "border-red-500 bg-red-50" : "border-gray-300 bg-white focus:border-[#4a9d9d]"
                    }`}
                    placeholder="García"
                  />
                  {errors.apellido2 && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.apellido2}</p>}
                </div>

                {/* Tipo Cliente */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Cliente
                  </label>
                  <select
                    value={formData.tipoCliente}
                    onChange={(e) => handleInputChange("tipoCliente", e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                    <option value="Corporativo">Corporativo</option>
                  </select>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contacto}
                    onChange={(e) => handleInputChange("contacto", e.target.value)}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.contacto ? "border-red-500 bg-red-50" : "border-gray-300 bg-white focus:border-[#4a9d9d]"
                    }`}
                    placeholder="8888-8888"
                  />
                  {errors.contacto && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.contacto}</p>}
                </div>

                {/* Correo Electrónico */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.correoElectronico}
                    onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.correoElectronico ? "border-red-500 bg-red-50" : "border-gray-300 bg-white focus:border-[#4a9d9d]"
                    }`}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.correoElectronico && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.correoElectronico}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          {modo === "buscar" ? (
            <button
              onClick={() => setModo("crear")}
              className="w-full px-4 py-3 bg-[#9d8560] text-white rounded-lg hover:bg-[#b89d7d] transition font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Crear Nuevo Cliente
            </button>
          ) : (
            <div className="flex gap-3">
              {(fetchClientes || fetchClienteByCedula) && (
                <button
                  type="button"
                  onClick={() => setModo("buscar")}
                  disabled={creandoCliente}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creandoCliente || loading}
                className="flex-1 px-4 py-3 bg-[#4a9d9d] text-white rounded-lg hover:bg-[#5aadad] transition font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creandoCliente ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Creando...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Crear y Seleccionar
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalCrearCliente