import { AlertCircle, CheckCircle, Edit2, Plus, Search, Shield, Trash2, X } from "lucide-react"
import type { AgregarRolDto, Rol } from "../types/rol"
import { useState } from "react"
import { useRoles } from "../hooks/useRoles"

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
  
  const RolesModule = () => {
    const { roles, loading, error, createRol, updateRol, desactivarRol } = useRoles()
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingRol, setEditingRol] = useState<Rol | null>(null)
    const [formError, setFormError] = useState("")
  
    const [formData, setFormData] = useState<AgregarRolDto>({
      nombre: "",
      descripcion: "",
    })
  
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      type: "danger" as "danger" | "success",
    })
  
    const filteredRoles = (roles || []).filter((r) => {
      const nombre = r?.nombre?.toLowerCase() || ""
      const descripcion = r?.descripcion?.toLowerCase() || ""
      const termino = searchTerm.toLowerCase()
  
      return nombre.includes(termino) || descripcion.includes(termino)
    })
  
    const handleOpenModal = (rol?: Rol) => {
      if (rol) {
        setEditingRol(rol)
        setFormData({
          nombre: rol.nombre,
          descripcion: rol.descripcion,
        })
      } else {
        setEditingRol(null)
        setFormData({
          nombre: "",
          descripcion: "",
        })
      }
      setFormError("")
      setShowModal(true)
    }
  
    const handleCloseModal = () => {
      setShowModal(false)
      setEditingRol(null)
      setFormError("")
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setFormError("")
  
      try {
        if (editingRol) {
          await updateRol(editingRol.idRol, formData)
        } else {
          await createRol(formData)
        }
        handleCloseModal()
      } catch (err: any) {
        setFormError(err.message)
      }
    }
  
    const handleDelete = (id: number) => {
      setConfirmModal({
        isOpen: true,
        title: "¿Eliminar Rol?",
        message: "Esta acción no se puede deshacer. El rol será eliminado del sistema.",
        type: "danger",
        onConfirm: async () => {
          try {
            await desactivarRol(id)
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
              <h1 className="text-2xl font-semibold text-gray-800">Administración de roles</h1>
            </div>
  
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Roles</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Gestiona los roles del sistema</p>
                </div>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 bg-[#4a9d9d] text-white px-4 py-2.5 rounded-lg hover:bg-[#5aadad] transition shadow-sm font-medium"
                >
                  <Plus size={18} />
                  Nuevo Rol
                </button>
              </div>
  
              {/* Buscador */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
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
                  <p className="mt-4 text-gray-600 text-sm">Cargando roles...</p>
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
                          Descripción
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
                      {filteredRoles.map((rol) => (
                        <tr key={rol.idRol} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{rol.nombre}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rol.descripcion}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                rol.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {rol.estado ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenModal(rol)}
                                className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(rol.idRol)}
                                className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredRoles.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Shield size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No se encontraron roles</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Modal Rol */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingRol ? "Editar Rol" : "Nuevo Rol"}
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
  
                <div className="space-y-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción *</label>
                    <textarea
                      value={formData.descripcion || ""}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      rows={3}
                      required
                    />
                  </div>
  
                  {/* <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                      className="h-4 w-4 text-[#4a9d9d] border-gray-300 rounded focus:ring-[#4a9d9d]"
                    />
                    <label className="text-sm text-gray-700">Activo</label>
                  </div> */}
  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                    >
                      {editingRol ? "Actualizar" : "Crear"}
                    </button>
                  </div>
                </div>
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
  
  export default RolesModule