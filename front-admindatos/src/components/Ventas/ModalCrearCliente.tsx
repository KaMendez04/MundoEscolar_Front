// components/ModalCrearCliente.tsx
import { useState } from "react"
import { X, UserPlus } from "lucide-react"
import type { Cliente, CreateClienteDto } from "../../types/cliente"

interface ModalCrearClienteProps {
  onClose: () => void
  onClienteCreado: (cliente: Cliente) => void
  createCliente: (data: CreateClienteDto) => Promise<Cliente | null>
  loading: boolean
}

const ModalCrearCliente = ({ onClose, onClienteCreado, createCliente, loading }: ModalCrearClienteProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <UserPlus size={24} className="text-[#4a9d9d]" />
            Crear Nuevo Cliente
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Juan"
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>

            {/* Primer Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primer Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.apellido1}
                onChange={(e) => handleInputChange("apellido1", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] ${
                  errors.apellido1 ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Pérez"
              />
              {errors.apellido1 && <p className="text-xs text-red-500 mt-1">{errors.apellido1}</p>}
            </div>

            {/* Segundo Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segundo Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.apellido2}
                onChange={(e) => handleInputChange("apellido2", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] ${
                  errors.apellido2 ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="García"
              />
              {errors.apellido2 && <p className="text-xs text-red-500 mt-1">{errors.apellido2}</p>}
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cédula <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.cedula || ""}
                onChange={(e) => handleInputChange("cedula", parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] ${
                  errors.cedula ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="123456789"
              />
              {errors.cedula && <p className="text-xs text-red-500 mt-1">{errors.cedula}</p>}
            </div>

            {/* Tipo Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Cliente</label>
              <select
                value={formData.tipoCliente}
                onChange={(e) => handleInputChange("tipoCliente", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d]"
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Corporativo">Corporativo</option>
              </select>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.contacto}
                onChange={(e) => handleInputChange("contacto", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] ${
                  errors.contacto ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="88888888"
              />
              {errors.contacto && <p className="text-xs text-red-500 mt-1">{errors.contacto}</p>}
            </div>

            {/* Correo Electrónico */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.correoElectronico}
                onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] ${
                  errors.correoElectronico ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ejemplo@correo.com"
              />
              {errors.correoElectronico && <p className="text-xs text-red-500 mt-1">{errors.correoElectronico}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#4a9d9d] text-white rounded-lg hover:bg-[#5aadad] transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Crear Cliente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCrearCliente