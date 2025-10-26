import type React from "react"
import { useState } from "react"
import { Search, Users, Edit2, X, AlertCircle } from "lucide-react"
import { useClientes } from "../hooks/useClientes"
import type { Cliente } from "../types/cliente"

// Modal de Confirmación (reutilizado del estilo del producto)
const  ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }: any) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {type === "danger" ? (
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <AlertCircle className="text-green-600" size={24} />
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
                type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
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

const ClientesModule = () => {
  const { clientes, loading, error, updateCliente } = useClientes()
  const [searchTerm, setSearchTerm] = useState("")
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState<Partial<Cliente>>({})
  const [formError, setFormError] = useState("")

  // Filtro de búsqueda
  const filteredClientes = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.apellido2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cedula.toString().includes(searchTerm),
  )

  // Handlers para modal de edición
  const handleOpenEditModal = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData(cliente)
    setShowModalEdit(true)
    setFormError("")
  }

  const handleCloseEditModal = () => {
    setShowModalEdit(false)
    setEditingCliente(null)
    setFormError("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target
    const name = target.name
    let value: string | number | boolean = target.value

    if (target.type === "checkbox") {
      value = (target as HTMLInputElement).checked
    } else if (target.type === "number") {
      value = Number.parseInt(value as string) || 0
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!editingCliente || !formData) return

    try {
      await updateCliente(formData as Cliente)
      handleCloseEditModal()
    } catch (err: any) {
      setFormError(err.message || "Error al actualizar el cliente")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Administración de Clientes</h1>
          </div>

          <div className="p-6">
            {/* Descripción */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Clientes</h2>
                <p className="text-sm text-gray-500 mt-0.5">Gestiona la información de tus clientes</p>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
              />
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
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm">Cargando clientes...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Apellido 1
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Apellido 2
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cédula
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Correo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClientes.map((cliente) => (
                      <tr key={cliente.idCliente} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{cliente.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cliente.apellido1}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cliente.apellido2}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{cliente.cedula}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cliente.tipoCliente}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cliente.contacto}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cliente.correoElectronico}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleOpenEditModal(cliente)}
                            className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredClientes.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No se encontraron clientes</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showModalEdit && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Editar Cliente</h2>
              <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido 1 *</label>
                  <input
                    type="text"
                    name="apellido1"
                    value={formData.apellido1 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido 2 *</label>
                  <input
                    type="text"
                    name="apellido2"
                    value={formData.apellido2 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo Cliente *</label>
                  <input
                    type="text"
                    name="tipoCliente"
                    value={formData.tipoCliente || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cédula *</label>
                  <input
                    type="number"
                    name="cedula"
                    value={formData.cedula || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contacto *</label>
                  <input
                    type="text"
                    name="contacto"
                    value={formData.contacto || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="correoElectronico"
                    value={formData.correoElectronico || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientesModule
