import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Users, Edit2, X, AlertCircle } from "lucide-react"
import { useClientes } from "../hooks/useClientes"
import type { Cliente } from "../types/cliente"

// Variantes de animación
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <motion.div 
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto">
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Administración de Clientes</h1>
          </div>

          <div className="p-6">
            <motion.div 
              className="flex justify-between items-center mb-6"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Clientes</h2>
                <p className="text-sm text-gray-500 mt-0.5">Gestiona la información de tus clientes</p>
              </div>
            </motion.div>

            <motion.div 
              className="relative mb-6"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm">Cargando clientes...</p>
              </div>
            ) : (
              <motion.div 
                className="overflow-x-auto rounded-lg border border-gray-200"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Apellido 1</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Apellido 2</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cédula</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contacto</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClientes.map((cliente, index) => (
                      <motion.tr 
                        key={cliente.idCliente} 
                        className="hover:bg-gray-50 transition"
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                      >
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
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredClientes.length === 0 && (
                  <motion.div 
                    className="text-center py-12 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No se encontraron clientes</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModalEdit && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Editar Cliente</h2>
                <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600 transition">
                  <X size={22} />
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence>
                  {formError && (
                    <motion.div 
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle size={18} />
                      <span className="text-sm">{formError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
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
                      type="button"
                      onClick={(e: any) => handleSubmit(e)}
                      className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ClientesModule