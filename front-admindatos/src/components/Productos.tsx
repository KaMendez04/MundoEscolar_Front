import type React from "react"
import { useState } from "react"
import { Plus, Search, Package, Tags, AlertCircle, X, Edit2, Trash2, CheckCircle } from "lucide-react"
import { useProductos } from "../hooks/useProdutos"
import { useCategorias } from "../hooks/useCategoria"
import { useNotification } from "../context/NotificationContext"
import type { Producto, CreateProductoDto } from "../types/produto"
import type { Categoria, CreateCategoriaDto } from "../types/categoria"

// Modal de Confirmación
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
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
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

const InventarioModule = () => {
  const [activeTab, setActiveTab] = useState<"productos" | "categorias">("productos")
  const notification = useNotification()

  // Productos
  const {
    productos,
    loading: loadingProductos,
    error: errorProductos,
    createProducto,
    updateProducto,
    deleteProducto,
  } = useProductos()
  const [searchTermProductos, setSearchTermProductos] = useState("")
  const [showModalProducto, setShowModalProducto] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [formDataProducto, setFormDataProducto] = useState<CreateProductoDto>({
    nombre: "",
    descripcion: "",
    stock: 0,
    monto: 0,
    impuesto: 13,
    descuento: 0,
    idCategoria: 1,
  })
  const [formErrorProducto, setFormErrorProducto] = useState("")

  // Categorías
  const {
    categorias,
    loading: loadingCategorias,
    error: errorCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    fetchCategorias,
  } = useCategorias()
  const [searchTermCategorias, setSearchTermCategorias] = useState("")
  const [showModalCategoria, setShowModalCategoria] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [formDataCategoria, setFormDataCategoria] = useState<CreateCategoriaDto>({
    nombre: "",
    descripcion: "",
  })
  const [formErrorCategoria, setFormErrorCategoria] = useState("")

  // Estados para modales de confirmación
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type: "danger" | "success"
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  })

  // Filtros
  const filteredProductos = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTermProductos.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTermProductos.toLowerCase()),
  )

  const filteredCategorias = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTermCategorias.toLowerCase()) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(searchTermCategorias.toLowerCase())),
  )

  // Handlers Productos
  const handleOpenModalProducto = (producto?: Producto) => {
    if (producto) {
      setEditingProducto(producto)
      setFormDataProducto({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        stock: producto.stock,
        monto: producto.monto,
        impuesto: producto.impuesto,
        descuento: producto.descuento,
        idCategoria: producto.idCategoria,
      })
    } else {
      setEditingProducto(null)
      setFormDataProducto({
        nombre: "",
        descripcion: "",
        stock: 0,
        monto: 0,
        impuesto: 13,
        descuento: 0,
        idCategoria: categorias.length > 0 ? categorias[0].idCategoria : 1,
      })
    }
    setFormErrorProducto("")
    setShowModalProducto(true)
  }

  const handleCloseModalProducto = () => {
    setShowModalProducto(false)
    setEditingProducto(null)
    setFormErrorProducto("")
  }

  const handleSubmitProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrorProducto("")

    // Validaciones
    if (formDataProducto.stock <= 0) {
      notification.error(
        "Stock inválido", 
        "El stock no puede ser 0 o menor"
      )
      return
    }

    if (formDataProducto.monto <= 0) {
      notification.error(
        "Precio inválido", 
        "El precio base no puede ser 0 o menor"
      )
      return
    }

    if (formDataProducto.impuesto <= 0) {
      notification.error(
        "Impuesto inválido", 
        "El impuesto no puede ser 0 o menor"
      )
      return
    }

    try {
      if (editingProducto) {
        await updateProducto(editingProducto.idProducto, formDataProducto)
      } else {
        await createProducto(formDataProducto)
      }
      handleCloseModalProducto()
    } catch (err: any) {
      setFormErrorProducto(err.message)
    }
  }

  const handleDeleteProducto = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "¿Eliminar Producto?",
      message: "Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteProducto(id)
        } catch (err: any) {
          alert(err.message)
        }
      },
    })
  }

  // Handlers Categorías
  const handleOpenModalCategoria = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria)
      setFormDataCategoria({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || "",
      })
    } else {
      setEditingCategoria(null)
      setFormDataCategoria({ nombre: "", descripcion: "" })
    }
    setFormErrorCategoria("")
    setShowModalCategoria(true)
  }

  const handleCloseModalCategoria = () => {
    setShowModalCategoria(false)
    setEditingCategoria(null)
    setFormErrorCategoria("")
  }

  const handleSubmitCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrorCategoria("")

    try {
      if (editingCategoria) {
        await updateCategoria(editingCategoria.idCategoria, formDataCategoria)
      } else {
        await createCategoria(formDataCategoria)
      }
      handleCloseModalCategoria()
      await fetchCategorias()
    } catch (err: any) {
      setFormErrorCategoria(err.message)
    }
  }

  const handleDeleteCategoria = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "¿Eliminar Categoría?",
      message: "Esta acción eliminará la categoría y puede afectar los productos asociados. ¿Desea continuar?",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteCategoria(id)
        } catch (err: any) {
          alert(err.message)
        }
      },
    })
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Administración de productos y categorías</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("productos")}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === "productos"
                  ? "bg-white text-[#4a9d9d] border-t-2 border-x border-[#4a9d9d] border-b-0"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Package size={18} />
              Productos
            </button>
            <button
              onClick={() => setActiveTab("categorias")}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === "categorias"
                  ? "bg-white text-[#4a9d9d] border-t-2 border-x border-[#4a9d9d] border-b-0"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Tags size={18} />
              Categorías
            </button>
          </div>

          <div className="p-6">
            {/* Productos Tab */}
            {activeTab === "productos" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Productos</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona tu inventario de productos</p>
                  </div>
                  <button
                    onClick={() => handleOpenModalProducto()}
                    className="flex items-center gap-2 bg-[#4a9d9d] text-white px-4 py-2.5 rounded-lg hover:bg-[#5aadad] transition shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    disabled={categorias.length === 0}
                  >
                    <Plus size={18} />
                    Nuevo Producto
                  </button>
                </div>

                {categorias.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">Debe crear al menos una categoría antes de agregar productos</span>
                  </div>
                )}

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTermProductos}
                    onChange={(e) => setSearchTermProductos(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                  />
                </div>

                {errorProductos && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorProductos}</span>
                  </div>
                )}

                {loadingProductos ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando productos...</p>
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
                            Stock
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Precio Base
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Impuesto
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Descuento
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProductos.map((producto) => (
                          <tr key={producto.idProducto} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{producto.nombre}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{producto.descripcion}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  producto.stock > 10
                                    ? "bg-green-100 text-green-700"
                                    : producto.stock > 0
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {producto.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                              ₡{(producto.monto ?? 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className="inline-flex px-2 py-1 text-xs font-medium">
                                {producto.impuesto}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className="inline-flex px-2 py-1 text-xs font-medium">
                                {producto.descuento}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className="inline-flex px-2 py-1 bg-[#4a9d9d]/10 text-[#4a9d9d] rounded-md text-xs font-medium">
                                {categorias.find((c) => c.idCategoria === producto.idCategoria)?.nombre || "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleOpenModalProducto(producto)}
                                  className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProducto(producto.idProducto)}
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
                    {filteredProductos.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Package size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No se encontraron productos</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Categorías Tab */}
            {activeTab === "categorias" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Categorías</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Organiza tus productos por categorías</p>
                  </div>
                  <button
                    onClick={() => handleOpenModalCategoria()}
                    className="flex items-center gap-2 bg-[#4a9d9d] text-white px-4 py-2.5 rounded-lg hover:bg-[#5aadad] transition shadow-sm font-medium"
                  >
                    <Plus size={18} />
                    Nueva Categoría
                  </button>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTermCategorias}
                    onChange={(e) => setSearchTermCategorias(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                  />
                </div>

                {errorCategorias && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorCategorias}</span>
                  </div>
                )}

                {loadingCategorias ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[#4a9d9d] border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando categorías...</p>
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
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCategorias.map((categoria) => (
                          <tr key={categoria.idCategoria} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{categoria.nombre}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{categoria.descripcion || "N/A"}</td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleOpenModalCategoria(categoria)}
                                  className="text-[#4a9d9d] hover:text-[#5aadad] p-1.5 hover:bg-[#4a9d9d]/10 rounded-lg transition"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategoria(categoria.idCategoria)}
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
                    {filteredCategorias.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Tags size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No se encontraron categorías</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

     {/* Modal Producto */}
      {showModalProducto && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProducto ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={handleCloseModalProducto} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorProducto && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorProducto}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProducto} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    value={formDataProducto.nombre}
                    onChange={(e) => setFormDataProducto({ ...formDataProducto, nombre: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción *</label>
                  <textarea
                    value={formDataProducto.descripcion}
                    onChange={(e) => setFormDataProducto({ ...formDataProducto, descripcion: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
                    <input
                      type="number"
                      value={formDataProducto.stock}
                      onChange={(e) =>
                        setFormDataProducto({ ...formDataProducto, stock: Number.parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio Base (₡) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formDataProducto.monto}
                      onChange={(e) =>
                        setFormDataProducto({ ...formDataProducto, monto: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Impuesto (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formDataProducto.impuesto}
                      onChange={(e) =>
                        setFormDataProducto({ ...formDataProducto, impuesto: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descuento (%) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formDataProducto.descuento}
                      onChange={(e) =>
                        setFormDataProducto({ ...formDataProducto, descuento: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría *</label>
                  <select
                    value={formDataProducto.idCategoria}
                    onChange={(e) =>
                      setFormDataProducto({ ...formDataProducto, idCategoria: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  >
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vista previa del precio final */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Vista previa del precio:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio base:</span>
                      <span className="font-medium">₡{(formDataProducto.monto || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">+ Impuesto ({formDataProducto.impuesto}%):</span>
                      <span className="font-medium">₡{((formDataProducto.monto || 0) * (formDataProducto.impuesto / 100)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">- Descuento ({formDataProducto.descuento}%):</span>
                      <span className="font-medium text-orange-600">-₡{(((formDataProducto.monto || 0) * (1 + formDataProducto.impuesto / 100)) * (formDataProducto.descuento / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModalProducto}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    {editingProducto ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {showModalCategoria && (
        <div className="fixed inset-0  bg-black/30 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button onClick={handleCloseModalCategoria} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorCategoria && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorCategoria}</span>
                </div>
              )}

              <form onSubmit={handleSubmitCategoria} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    value={formDataCategoria.nombre}
                    onChange={(e) => setFormDataCategoria({ ...formDataCategoria, nombre: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                  <textarea
                    value={formDataCategoria.descripcion}
                    onChange={(e) => setFormDataCategoria({ ...formDataCategoria, descripcion: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] bg-white"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModalCategoria}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#4a9d9d] text-white rounded-lg font-medium hover:bg-[#5aadad] transition shadow-sm"
                  >
                    {editingCategoria ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
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

export default InventarioModule
