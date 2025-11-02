// components/ModalCrearCliente.tsx
import { useState, useEffect, useCallback } from "react"
import { X, UserPlus, Search, User, ArrowLeft } from "lucide-react"
import type { Cliente, CreateClienteDto } from "../../types/cliente"

interface ModalCrearClienteProps {
  onClose: () => void
  onClienteCreado?: (cliente: Cliente) => void
  onClienteSeleccionado?: (cliente: Cliente) => void  // ← Agregado como alias
  createCliente: (data: CreateClienteDto) => Promise<Cliente | null>
  loading: boolean
  // Nuevas props para buscar clientes existentes
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

  // Cargar clientes al abrir (solo una vez y solo si hay función disponible)
  const cargarClientes = useCallback(async () => {
    if (fetchClientes && clientes.length === 0) {
      await fetchClientes()
    }
  }, [fetchClientes, clientes.length])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cedula.toString().includes(searchTerm)
  )

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
      onClienteCreado(cliente)
      onClose()
    } else {
      setError("Cliente no encontrado. ¿Desea crearlo?")
      setFormData({ ...formData, cedula })
      setModo("crear")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }
    if (!formData.apellido1.trim()) {
      newErrors.apellido1 = "El primer apellido es requerido"
    }
    if (!formData.apellido2.trim()) {
      newErrors.apellido2 = "El segundo apellido es requerido"
    }
    if (!formData.cedula || formData.cedula <= 0) {
      newErrors.cedula = "La cédula debe ser un número válido"
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

    try {
      const nuevoCliente = await createCliente(formData)
      if (nuevoCliente) {
        onClienteCreado(nuevoCliente)
        onClose()
      }
    } catch (error: any) {
      alert(`Error al crear cliente: ${error.message}`)
    }
  }

  const handleInputChange = (field: keyof CreateClienteDto, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {modo === "buscar" ? (
              <>
                <Search size={24} className="text-[#4a9d9d]" />
                Buscar Cliente
              </>
            ) : (
              <>
                <UserPlus size={24} className="text-[#4a9d9d]" />
                Crear Cliente
              </>
            )}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {/* MODO BUSCAR */}
          {modo === "buscar" && (fetchClientes || fetchClienteByCedula) && (
            <div className="p-6 space-y-6">
              {/* Búsqueda rápida por cédula */}
              {fetchClienteByCedula && (
                <div className="bg-gradient-to-br from-[#4a9d9d]/5 to-[#4a9d9d]/10 rounded-lg p-4 border border-[#4a9d9d]/20">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Search size={18} className="text-[#4a9d9d]" />
                    Búsqueda Rápida por Cédula
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={cedulaBuscada}
                      onChange={(e) => setCedulaBuscada(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && buscarPorCedula()}
                      placeholder="Ejemplo: 123456789"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white shadow-sm"
                    />
                    <button
                      onClick={buscarPorCedula}
                      className="px-5 py-2.5 bg-[#4a9d9d] text-white rounded-lg hover:bg-[#5aadad] transition font-medium shadow-sm flex items-center gap-2"
                    >
                      <Search size={18} />
                      Buscar
                    </button>
                  </div>
                  {error && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700 flex items-center gap-2">
                        <span>{error}</span>
                        <button
                          onClick={() => setModo("crear")}
                          className="underline font-semibold hover:text-orange-900 transition"
                        >
                          Crear nuevo cliente
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Separador */}
              {fetchClientes && fetchClienteByCedula && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">O buscar en la lista</span>
                  </div>
                </div>
              )}

              {/* Búsqueda en lista */}
              {fetchClientes && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buscar por nombre o apellido
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nombre, apellido o cédula..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Lista de clientes */}
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 text-sm">Cargando clientes...</p>
                      </div>
                    ) : clientesFiltrados.length === 0 ? (
                      <div className="text-center py-12">
                        <User size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No se encontraron clientes</p>
                        <p className="text-sm text-gray-400 mt-1">Intenta con otro término de búsqueda</p>
                      </div>
                    ) : (
                      clientesFiltrados.map((cliente) => (
                        <div
                          key={cliente.idCliente}
                          onClick={() => {
                            onClienteCreado(cliente)
                            onClose()
                          }}
                          className="p-4 border border-gray-200 rounded-lg hover:border-[#4a9d9d] hover:shadow-md cursor-pointer transition-all bg-white"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">
                                  {cliente.nombre} {cliente.apellido1} {cliente.apellido2}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  cliente.tipoCliente === "VIP"
                                    ? "bg-purple-100 text-purple-700"
                                    : cliente.tipoCliente === "Corporativo"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}>
                                  {cliente.tipoCliente}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Cédula:</span> {cliente.cedula}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {cliente.correoElectronico}
                              </p>
                              <p className="text-sm text-gray-600">vs
                                <span className="font-medium">Teléfono:</span> {cliente.contacto}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* MODO CREAR */}
          {modo === "crear" && (
            <div className="p-6">
              <div className="bg-[#4a9d9d]/5 rounded-lg p-4 mb-6 border border-[#4a9d9d]/20">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Nota:</span> Complete todos los campos marcados con 
                  <span className="text-red-500 font-bold"> *</span> para crear el nuevo cliente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.nombre ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="Juan"
                  />
                  {errors.nombre && <p className="text-xs text-red-600 mt-1 font-medium">{errors.nombre}</p>}
                </div>

                {/* Primer Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Primer Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellido1}
                    onChange={(e) => handleInputChange("apellido1", e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.apellido1 ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="Pérez"
                  />
                  {errors.apellido1 && <p className="text-xs text-red-600 mt-1 font-medium">{errors.apellido1}</p>}
                </div>

                {/* Segundo Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Segundo Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellido2}
                    onChange={(e) => handleInputChange("apellido2", e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.apellido2 ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="García"
                  />
                  {errors.apellido2 && <p className="text-xs text-red-600 mt-1 font-medium">{errors.apellido2}</p>}
                </div>

                {/* Cédula */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cédula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.cedula || ""}
                    onChange={(e) => handleInputChange("cedula", parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.cedula ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="123456789"
                  />
                  {errors.cedula && <p className="text-xs text-red-600 mt-1 font-medium">{errors.cedula}</p>}
                </div>

                {/* Tipo Cliente */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tipo de Cliente
                  </label>
                  <select
                    value={formData.tipoCliente}
                    onChange={(e) => handleInputChange("tipoCliente", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] bg-white shadow-sm"
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                    <option value="Corporativo">Corporativo</option>
                  </select>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contacto}
                    onChange={(e) => handleInputChange("contacto", e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.contacto ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="8888-8888"
                  />
                  {errors.contacto && <p className="text-xs text-red-600 mt-1 font-medium">{errors.contacto}</p>}
                </div>

                {/* Correo Electrónico */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.correoElectronico}
                    onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] transition ${
                      errors.correoElectronico ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.correoElectronico && <p className="text-xs text-red-600 mt-1 font-medium">{errors.correoElectronico}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          {modo === "buscar" ? (
            <button
              onClick={() => setModo("crear")}
              className="w-full px-4 py-3 bg-[#9d8560] text-white rounded-lg hover:bg-[#b89d7d] transition font-medium shadow-sm flex items-center justify-center gap-2"
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
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-[#4a9d9d] text-white rounded-lg hover:bg-[#5aadad] transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
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
