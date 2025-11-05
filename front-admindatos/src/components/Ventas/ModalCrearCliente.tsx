// components/Ventas/ModalCrearCliente.tsx
import { useState, useEffect, useCallback } from "react"
import { X, UserPlus, Search, User, ArrowLeft, FileText, CheckCircle } from "lucide-react"
import type { Cliente, CreateClienteDto } from "../../types/cliente"
import { useCedulaLookup } from "../../hooks/useCedulaLookup"
import { useCondicionPago } from "../../hooks/useCondicionPago"

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

  // Hooks
  const { lookup, isLoading: loadingCedula } = useCedulaLookup()
  const { registrarCondicion, isLoading: loadingCondicion } = useCondicionPago()

  // Estado para la condición de pago
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false)
  const [mostrarCondiciones, setMostrarCondiciones] = useState(false)

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

  // Texto de las condiciones
  const TEXTO_CONDICIONES = `Por medio de la presente, el cliente autoriza expresamente a la empresa para:

1. RECOPILACIÓN DE DATOS: Recolectar, almacenar y procesar sus datos personales (nombre completo, número de cédula, información de contacto y correo electrónico) con el único propósito de gestionar la relación comercial.

2. CONDICIONES DE PAGO: Realizar el pago total de las facturas dentro de los 30 días naturales siguientes a la fecha de emisión. En caso de retraso en el pago, se aplicará un recargo del 2% mensual sobre el saldo pendiente.

3. MÉTODOS DE PAGO: El pago podrá efectuarse mediante transferencia bancaria, depósito, tarjeta de crédito o débito, o cualquier otro medio autorizado por la empresa.

4. PROTECCIÓN DE DATOS: Los datos personales serán tratados con estricta confidencialidad y de acuerdo con la Ley de Protección de Datos Personales. No serán compartidos con terceros sin consentimiento expreso, salvo obligación legal.

Al aceptar estas condiciones, el cliente confirma haber leído, comprendido y estar de acuerdo con todos los términos establecidos.`

  const cargarClientes = useCallback(async () => {
    if (fetchClientes && clientes.length === 0) {
      await fetchClientes()
    }
  }, [fetchClientes, clientes.length])

  useEffect(() => {
    cargarClientes()
  }, [cargarClientes])

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

    if (!aceptaCondiciones) {
      newErrors.condiciones = "Debe aceptar las condiciones de pago y tratamiento de datos"
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
      console.log("✅ Cliente creado:", resultado)
      
      if (fetchClientes) {
        console.log("🔄 Recargando lista de clientes...")
        await fetchClientes()
      }
      
      let clienteCreado: Cliente | null = null
      
      if (resultado && typeof resultado === 'object' && 'idCliente' in resultado) {
        clienteCreado = resultado
      } else if (resultado && fetchClienteByCedula) {
        console.log("🔍 Buscando cliente por cédula:", formData.cedula)
        clienteCreado = await fetchClienteByCedula(formData.cedula)
      }

      if (clienteCreado && clienteCreado.idCliente) {
        try {
          console.log("📝 Registrando condición de pago para cliente:", clienteCreado.idCliente)
          await registrarCondicion({
            idCliente: clienteCreado.idCliente,
            acepta: aceptaCondiciones
          })
          console.log("✅ Condición de pago registrada")
        } catch (condicionError: any) {
          console.error("⚠️ Error al registrar condición de pago:", condicionError)
          alert(`Cliente creado exitosamente, pero hubo un problema al registrar las condiciones: ${condicionError.message}`)
        }
        
        onClienteCreado?.(clienteCreado)
      } else {
        alert("Cliente creado exitosamente. Por favor, búsquelo en la lista.")
      }
      
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

  const handleCedulaChange = async (value: string) => {
    const cedula = parseInt(value) || 0
    handleInputChange("cedula", cedula)
    
    if (/^\d{9,12}$/.test(value)) {
      const resultado = await lookup(value)
      if (resultado) {
        setFormData(prev => ({
          ...prev,
          nombre: resultado.firstname || "",
          apellido1: resultado.lastname1 || "",
          apellido2: resultado.lastname2 || ""
        }))
      }
    }
  }

  useEffect(() => {
    if (!fetchClientes && !fetchClienteByCedula) {
      setModo("crear")
    }
  }, [fetchClientes, fetchClienteByCedula])

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-[#4a9d9d] px-6 py-4 flex justify-between items-center border-b border-[#3d8a8a]">
          <h2 className="text-lg font-semibold text-white">
            {modo === "buscar" ? "Buscar Cliente" : "Nuevo Cliente"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* MODO BUSCAR */}
          {modo === "buscar" && (
            <div className="space-y-5">
              {/* Buscar por cédula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por Cédula
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cedulaBuscada}
                    onChange={(e) => setCedulaBuscada(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && buscarPorCedula()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                    placeholder="Ingrese número de cédula"
                  />
                  <button
                    onClick={buscarPorCedula}
                    className="px-5 py-2 bg-[#4a9d9d] text-white rounded hover:bg-[#3d8a8a] transition font-medium"
                  >
                    Buscar
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-orange-600 mt-2">{error}</p>
                )}
              </div>

              <div className="border-t pt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar en lista de clientes
                </label>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                    placeholder="Buscar por nombre, apellidos o cédula..."
                  />
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-2 text-gray-600 text-sm">Cargando clientes...</p>
                  </div>
                )}

                {!loading && clientesFiltrados.length === 0 && (
                  <div className="text-center py-12 bg-white border border-gray-200 rounded">
                    <User size={40} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-600">No se encontraron clientes</p>
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
                      className="w-full p-3 bg-white border border-gray-200 rounded hover:border-[#4a9d9d] hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {cliente.nombre} {cliente.apellido1} {cliente.apellido2}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">Cédula: {cliente.cedula}</p>
                          {cliente.contacto && (
                            <p className="text-xs text-gray-500 mt-0.5">{cliente.contacto}</p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
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
            <div className="space-y-5">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-800">
                Complete todos los campos marcados con <span className="text-red-600 font-semibold">*</span>
              </div>

              <div className="bg-white border border-gray-200 rounded p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CÉDULA */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.cedula || ""}
                        onChange={(e) => handleCedulaChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                          errors.cedula 
                            ? "border-red-400 focus:ring-red-400" 
                            : "border-gray-300 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                        }`}
                        placeholder="Número de cédula"
                        disabled={loadingCedula}
                      />
                      {loadingCedula && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {loadingCedula && <p className="text-xs text-[#4a9d9d] mt-1">Buscando información...</p>}
                    {errors.cedula && <p className="text-xs text-red-600 mt-1">{errors.cedula}</p>}
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                        errors.nombre 
                          ? "border-red-400 focus:ring-red-400" 
                          : "border-gray-300 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                      }`}
                      placeholder="Nombre"
                    />
                    {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
                  </div>

                  {/* Primer Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primer Apellido <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.apellido1}
                      onChange={(e) => handleInputChange("apellido1", e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                        errors.apellido1 
                          ? "border-red-400 focus:ring-red-400" 
                          : "border-gray-300 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                      }`}
                      placeholder="Primer apellido"
                    />
                    {errors.apellido1 && <p className="text-xs text-red-600 mt-1">{errors.apellido1}</p>}
                  </div>

                  {/* Segundo Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Segundo Apellido <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.apellido2}
                      onChange={(e) => handleInputChange("apellido2", e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                        errors.apellido2 
                          ? "border-red-400 focus:ring-red-400" 
                          : "border-gray-300 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                      }`}
                      placeholder="Segundo apellido"
                    />
                    {errors.apellido2 && <p className="text-xs text-red-600 mt-1">{errors.apellido2}</p>}
                  </div>

                  {/* Tipo Cliente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Cliente
                    </label>
                    <select
                      value={formData.tipoCliente}
                      onChange={(e) => handleInputChange("tipoCliente", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                    >
                      <option value="Regular">Regular</option>
                      <option value="VIP">VIP</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contacto}
                      onChange={(e) => handleInputChange("contacto", e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                        errors.contacto 
                          ? "border-red-400 focus:ring-red-400" 
                          : "border-gray-300 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                      }`}
                      placeholder="Teléfono"
                    />
                    {errors.contacto && <p className="text-xs text-red-600 mt-1">{errors.contacto}</p>}
                  </div>

                  {/* Correo Electrónico */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.correoElectronico}
                      onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${
                        errors.correoElectronico 
                          ? "border-red-400 focus:ring-red-400" 
                          : "border-gray-300 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
                      }`}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.correoElectronico && <p className="text-xs text-red-600 mt-1">{errors.correoElectronico}</p>}
                  </div>

                  {/* CONDICIONES DE PAGO */}
                  <div className="md:col-span-2 border-t pt-4 mt-2">
                    <div className="bg-amber-50 border border-amber-200 rounded p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <FileText className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            Condiciones de Pago y Tratamiento de Datos
                          </h3>
                          <p className="text-xs text-gray-700">
                            El cliente debe aceptar las condiciones comerciales y autorizar el tratamiento de sus datos personales.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMostrarCondiciones(!mostrarCondiciones)}
                        className="text-xs text-[#4a9d9d] hover:text-[#3d8a8a] font-medium underline mb-3"
                      >
                        {mostrarCondiciones ? "Ocultar" : "Leer"} condiciones completas
                      </button>

                      {mostrarCondiciones && (
                        <div className="bg-white border border-amber-200 rounded p-3 mb-3 max-h-60 overflow-y-auto text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                          {TEXTO_CONDICIONES}
                        </div>
                      )}

                      <label className={`flex items-start gap-3 cursor-pointer p-3 rounded border ${
                        aceptaCondiciones 
                          ? "bg-green-50 border-green-400" 
                          : errors.condiciones
                          ? "bg-red-50 border-red-400"
                          : "bg-white border-gray-300 hover:border-amber-400"
                      }`}>
                        <input
                          type="checkbox"
                          checked={aceptaCondiciones}
                          onChange={(e) => {
                            setAceptaCondiciones(e.target.checked)
                            if (errors.condiciones) {
                              setErrors({ ...errors, condiciones: "" })
                            }
                          }}
                          className="mt-0.5 h-4 w-4 text-[#4a9d9d] rounded border-gray-300 focus:ring-[#4a9d9d]"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 text-sm block mb-0.5">
                            {aceptaCondiciones ? (
                              <span className="flex items-center gap-1.5 text-green-700">
                                <CheckCircle size={16} />
                                Condiciones aceptadas
                              </span>
                            ) : (
                              "Acepto las condiciones"
                            )}
                          </span>
                          <span className="text-xs text-gray-600">
                            Condiciones de pago (30 días, recargo 2% por mora) y tratamiento de datos personales.
                          </span>
                        </div>
                      </label>

                      {errors.condiciones && (
                        <p className="text-xs text-red-600 mt-2 font-medium">{errors.condiciones}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          {modo === "buscar" ? (
            <button
              onClick={() => setModo("crear")}
              className="w-full px-4 py-2.5 bg-[#9d8560] text-white rounded hover:bg-[#8a7555] transition font-medium flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Crear Nuevo Cliente
            </button>
          ) : (
            <div className="flex gap-3">
              {(fetchClientes || fetchClienteByCedula) && (
                <button
                  type="button"
                  onClick={() => setModo("buscar")}
                  disabled={creandoCliente || loadingCondicion}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creandoCliente || loading || loadingCondicion}
                className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded hover:bg-[#3d8a8a] transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creandoCliente || loadingCondicion ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {loadingCondicion ? "Registrando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
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