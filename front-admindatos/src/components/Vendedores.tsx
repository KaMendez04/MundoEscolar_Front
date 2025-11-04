import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Search, Users, AlertCircle, X, Edit2, Trash2, CheckCircle, Eye, EyeOff, Shield, UserCog } from "lucide-react"
import { useVendedores } from "../hooks/useVendedores"
import type { VendedorActivoDto, AgregarVendedorDto, ActualizarVendedorRequest } from "../types/vendedor"
import type { Vendedor_RolDto } from "../types/vendedor_rol"
import { rolesService } from "../services/rolService"
import type { Rol } from "../types/rol"
import { useVendedor_Rol } from "../hooks/useVendedor_Rol"
import { useCedulaLookup } from "../hooks/useCedulaLookup"

// Interfaz para roles disponibles (temporal - ajustar según tu API de roles)
const useRolesDisponibles = () => {
  const [roles, setRoles] = useState<Rol[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await rolesService.getAllRoles()
        setRoles(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Error al cargar roles")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { roles, loading, error }
}


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

// Modal para gestionar roles del vendedor
const RolesModal = ({ 
  isOpen, 
  onClose, 
  vendedor, 
  rolesDisponibles,
  vendedorRoles,
  onAsignarRol,
  onEliminarRol
}: any) => {
  if (!isOpen || !vendedor) return null

  // Obtener los roles actuales del vendedor desde vendedorRoles
  const rolesAsignados = vendedorRoles
    .filter((vr: any) => vr.idVendedor === vendedor.idVendedor)
    .map((vr: any) => vr.idRol)

  const [selectedRoles, setSelectedRoles] = useState<number[]>(rolesAsignados)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSelectedRoles(rolesAsignados)
  }, [vendedorRoles, vendedor])

  const toggleRol = (idRol: number) => {
    if (selectedRoles.includes(idRol)) {
      setSelectedRoles(selectedRoles.filter(r => r !== idRol))
    } else {
      setSelectedRoles([...selectedRoles, idRol])
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Roles a agregar (están seleccionados pero no asignados)
      const rolesAAgregar = selectedRoles.filter(r => !rolesAsignados.includes(r))
      
      // Roles a eliminar (están asignados pero no seleccionados)
      const rolesAEliminar = rolesAsignados.filter((r: number) => !selectedRoles.includes(r))

      // Agregar nuevos roles
      for (const idRol of rolesAAgregar) {
        await onAsignarRol(vendedor.idVendedor, idRol)
      }

      // Eliminar roles no seleccionados - Ahora pasa idVendedor e idRol directamente
      for (const idRol of rolesAEliminar) {
        console.log(vendedor.idVendedor, idRol)
        await onEliminarRol(vendedor.idVendedor, idRol)
      }

      onClose()
    } catch (error: any) {
      console.error("Error al guardar roles:", error)
      alert(error.message || "Error al guardar roles")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4a9d9d]/10 flex items-center justify-center">
              <Shield className="text-[#4a9d9d]" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Gestionar Roles</h2>
              <p className="text-sm text-gray-500">
                {vendedor.nombre} {vendedor.apellido1}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Selecciona los roles que deseas asignar a este vendedor
          </p>

          <div className="space-y-3">
            {rolesDisponibles.map((rol: Rol) => (
              <div
                key={rol.idRol}
                className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  selectedRoles.includes(rol.idRol)
                    ? "border-[#4a9d9d] bg-[#4a9d9d]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleRol(rol.idRol)}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        selectedRoles.includes(rol.idRol)
                          ? "bg-[#4a9d9d] border-[#4a9d9d]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedRoles.includes(rol.idRol) && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{rol.nombre}</h3>
                    {rol.descripcion && (
                      <p className="text-sm text-gray-500 mt-0.5">{rol.descripcion}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Roles"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const VendedoresModule = () => {
  const { vendedores, loading, error, createVendedor, updateVendedor, desactivarVendedor, fetchVendedores } = useVendedores()
  const { vendedor_rol, createVendedor_Rol, deleteVendedor_Rol } = useVendedor_Rol()
  const { roles: rolesDisponibles } = useRolesDisponibles() // REEMPLAZAR con tu hook real
   const { lookup, isLoading: loadingCedula } = useCedulaLookup()
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [selectedVendedor, setSelectedVendedor] = useState<VendedorActivoDto | null>(null)
  const [editingVendedor, setEditingVendedor] = useState<VendedorActivoDto | null>(null)
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
    const roles = v?.roles?.toLowerCase() || ""
    const termino = searchTerm.toLowerCase()

    return nombre.includes(termino) || apellido1.includes(termino) || 
           apellido2.includes(termino) || cedula.includes(termino) || 
           correo.includes(termino) || roles.includes(termino)
  })

  const handleOpenModal = (vendedor?: VendedorActivoDto) => {
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

  const handleOpenRolesModal = (vendedor: VendedorActivoDto) => {
    setSelectedVendedor(vendedor)
    setShowRolesModal(true)
  }

  const handleCloseRolesModal = () => {
    setShowRolesModal(false)
    setSelectedVendedor(null)
    // Refrescar la lista de vendedores para actualizar los roles en la tabla
    fetchVendedores()
  }

  const handleAsignarRol = async (idVendedor: number, idRol: number) => {
    const vendedorRolDto: Vendedor_RolDto = {
      idVendedor,
      idRol
    }
    await createVendedor_Rol(vendedorRolDto)
  }

  const handleEliminarRol = async (idVendedor: number, idRol: number) => {
    await deleteVendedor_Rol({idVendedor, idRol})
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
                placeholder="Buscar por nombre, apellidos, cédula, correo o roles..."
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
                        Roles
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
                          {vendedor.roles ? (
                            <div className="flex flex-wrap gap-1">
                              {vendedor.roles.split(',').map((rol, index) => (
                                <span
                                  key={index}
                                  className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-[#4a9d9d]/10 text-[#4a9d9d]"
                                >
                                  {rol.trim()}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Sin roles asignados</span>
                          )}
                        </td>
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
                              onClick={() => handleOpenRolesModal(vendedor)}
                              className="text-purple-600 hover:text-purple-800 p-1.5 hover:bg-purple-50 rounded-lg transition"
                              title="Gestionar Roles"
                            >
                              <UserCog size={16} />
                            </button>
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

              <div className="space-y-4">
                {/* 👇 CAMPO DE CÉDULA MODIFICADO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cédula *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cedula}
                      onChange={async (e) => {
                        const value = e.target.value
                        setFormData({ ...formData, cedula: value })
                        
                        // 👇 Buscar automáticamente si la cédula tiene 9-12 dígitos
                        if (/^\d{9,12}$/.test(value) && !editingVendedor) {
                          const result = await lookup(value)
                          if (result) {
                            setFormData(prev => ({
                              ...prev,
                              nombre: result.firstname || "",
                              apellido1: result.lastname1 || "",
                              apellido2: result.lastname2 || null
                            }))
                          }
                        }
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      required
                      disabled={!!editingVendedor || loadingCedula}
                      placeholder="Ingrese número de cédula"
                    />
                    {/* 👇 Indicador de carga */}
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
                    <p className="text-xs text-[#4a9d9d] mt-1">Buscando información de la cédula...</p>
                  )}
                </div>

                {/* 👇 Los campos de nombre ahora se marcan como autocompletados visualmente */}
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
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    {editingVendedor ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Roles */}
      <RolesModal
        isOpen={showRolesModal}
        onClose={handleCloseRolesModal}
        vendedor={selectedVendedor}
        rolesDisponibles={rolesDisponibles}
        vendedorRoles={vendedor_rol}
        onAsignarRol={handleAsignarRol}
        onEliminarRol={handleEliminarRol}
      />

      <ConfirmModal
        {...confirmModal}
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  )
}

export default VendedoresModule