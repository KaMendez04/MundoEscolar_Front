import type React from "react"
import { useState } from "react"
import { Plus, Search, Users, AlertCircle, X, Edit2, Trash2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useVendedores } from "../hooks/useVendedores"
import type { VendedorDto, AgregarVendedorDto, ActualizarVendedorRequest } from "../types/vendedor"

// Modal de confirmación reutilizable
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "danger" }: any) => {
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

const VendedoresModule = () => {
  const { vendedores, loading, error, createVendedor, updateVendedor, desactivarVendedor } = useVendedores()
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingVendedor, setEditingVendedor] = useState<VendedorDto | null>(null)
  const [formError, setFormError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState<AgregarVendedorDto>({
    cedula: "",
    nombre: "",
    apellido1: "",
    apellido2: null,
    telefono: null,
    correo: "",
    clave: "",
  })

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger" as "danger" | "success",
  })

  const filteredVendedores = (vendedores?.items || []).filter((v) => {
    const nombre = v?.nombre?.toLowerCase() || ""
    const apellido1 = v?.apellido1?.toLowerCase() || ""
    const apellido2 = v?.apellido2?.toLowerCase() || ""
    const cedula = v?.cedula?.toLowerCase() || ""
    const correo = v?.correo?.toLowerCase() || ""
    const termino = searchTerm.toLowerCase()

    return nombre.includes(termino) || apellido1.includes(termino) || 
           apellido2.includes(termino) || cedula.includes(termino) || 
           correo.includes(termino)
  })

  const handleOpenModal = (vendedor?: VendedorDto) => {
    if (vendedor) {
      setEditingVendedor(vendedor)
      setFormData({
        cedula: vendedor.cedula,
        nombre: vendedor.nombre,
        apellido1: vendedor.apellido1,
        apellido2: vendedor.apellido2,
        telefono: vendedor.telefono,
        correo: vendedor.correo,
        clave: "",
      })
    } else {
      setEditingVendedor(null)
      setFormData({
        cedula: "",
        nombre: "",
        apellido1: "",
        apellido2: null,
        telefono: null,
        correo: "",
        clave: "",
      })
    }
    setFormError("")
    setShowPassword(false)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVendedor(null)
    setFormError("")
    setShowPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    try {
      if (editingVendedor) {
        const updateData: ActualizarVendedorRequest = {
          nombre: formData.nombre,
          apellido1: formData.apellido1,
          apellido2: formData.apellido2,
          telefono: formData.telefono,
          correo: formData.correo,
          clave: formData.clave || null,
        }
        await updateVendedor(editingVendedor.idVendedor, updateData)
      } else {
        await createVendedor(formData)
      }
      handleCloseModal()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  const handleDesactivar = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "¿Desactivar Vendedor?",
      message: "Esta acción desactivará el vendedor del sistema.",
      type: "danger",
      onConfirm: async () => {
        try {
          await desactivarVendedor(id)
        } catch (err: any) {
          alert(err.message)
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Administración de vendedores</h1>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Vendedores</h2>
                <p className="text-sm text-gray-500 mt-0.5">Gestiona los vendedores del sistema</p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-[#4a9d9d] text-white px-4 py-2.5 rounded-lg hover:bg-[#5aadad] transition shadow-sm font-medium"
              >
                <Plus size={18} />
                Nuevo Vendedor
              </button>
            </div>

            {/* Buscador */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellidos, cédula o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
              />
            </div>

            {/* Tabla */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm">Cargando vendedores...</p>
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
                        Nombre Completo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Correo
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
                    {filteredVendedores.map((vendedor) => (
                      <tr key={vendedor.idVendedor} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{vendedor.cedula}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {`${vendedor.nombre} ${vendedor.apellido1}${vendedor.apellido2 ? ' ' + vendedor.apellido2 : ''}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{vendedor.telefono || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{vendedor.correo}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              vendedor.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {vendedor.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenModal(vendedor)}
                              className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDesactivar(vendedor.idVendedor)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition"
                              title="Desactivar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredVendedores.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No se encontraron vendedores</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Vendedor */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingVendedor ? "Editar Vendedor" : "Nuevo Vendedor"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cédula *</label>
                  <input
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                    disabled={!!editingVendedor}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Primer Apellido *</label>
                    <input
                      type="text"
                      value={formData.apellido1}
                      onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Segundo Apellido</label>
                    <input
                      type="text"
                      value={formData.apellido2 || ""}
                      onChange={(e) => setFormData({ ...formData, apellido2: e.target.value || null })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono || ""}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value || null })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {editingVendedor ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.clave}
                      onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white pr-10"
                      required={!editingVendedor}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    {editingVendedor ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        {...confirmModal}
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  )
}

export default VendedoresModule