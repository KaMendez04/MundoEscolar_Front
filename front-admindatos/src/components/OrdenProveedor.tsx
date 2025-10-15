import { useState } from 'react';
import { Plus, Search, Users, FileText, X, Edit2, CheckCircle, XCircle, AlertCircle, Calendar, Filter, ChevronLeft, ChevronRight, Trash2, ShoppingCart } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedores';
import { useOrdenPedidos } from '../hooks/useOrdenPedidos';
import { useDetalleOrdenPedido } from '../hooks/useDetalleOrdenPedido';
import { useProductos } from '../hooks/useProdutos';
import type { Proveedor, CreateProveedorDto } from '../types/proveedor';
import type { CreateOrdenPedidoDto } from '../types/ordenPedido';
import type { CreateDetalleOrdenPedidoDto, UpdateDetalleOrdenPedidoDto } from '../types/detalleOrdenPedido';

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {type === 'danger' ? (
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
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition ${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProveedoresOrdenesModule = () => {
  const [activeTab, setActiveTab] = useState<'proveedores' | 'ordenes' | 'detalles'>('proveedores');

  // Estados Proveedores
  const {
    proveedores,
    loading: loadingProveedores,
    error: errorProveedores,
    page: pageProveedores,
    totalPages: totalPagesProveedores,
    insertarProveedor,
    actualizarProveedor,
    desactivarProveedor,
    activarProveedor,
    fetchProveedores,
    setFiltros: setFiltrosProveedores
  } = useProveedores();

  const [showModalProveedor, setShowModalProveedor] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [formDataProveedor, setFormDataProveedor] = useState<CreateProveedorDto>({
    cedulaJuridica: '',
    nombre: '',
    telefono: ''
  });
  const [formErrorProveedor, setFormErrorProveedor] = useState('');
  const [searchProveedores, setSearchProveedores] = useState('');
  const [filtroEstadoProveedor, setFiltroEstadoProveedor] = useState<boolean | undefined>(undefined);

  // Estados Órdenes
  const {
    ordenes,
    loading: loadingOrdenes,
    error: errorOrdenes,
    page: pageOrdenes,
    totalPages: totalPagesOrdenes,
    insertarOrdenPedido,
    cambiarEstadoPago,
    fetchOrdenPedidos,
    setFiltros: setFiltrosOrdenes
  } = useOrdenPedidos();

  const [showModalOrden, setShowModalOrden] = useState(false);
  const [formDataOrden, setFormDataOrden] = useState<CreateOrdenPedidoDto>({
    numeroOrden: 0,
    cedulaJuridica: '',
    estadoDePago: false,
  });
  const [formErrorOrden, setFormErrorOrden] = useState('');
  const [searchOrdenes, setSearchOrdenes] = useState('');
  const [filtroEstadoPago, setFiltroEstadoPago] = useState<boolean | undefined>(undefined);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');

  // Estados Detalles
  const {
    detalles,
    loading: loadingDetalles,
    error: errorDetalles,
    createDetalle,
    updateDetalle,
    deleteDetalle,
    fetchDetalles
  } = useDetalleOrdenPedido();

  const { productos } = useProductos();

  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [editingDetalle, setEditingDetalle] = useState<any | null>(null);
  const [formDataDetalle, setFormDataDetalle] = useState<CreateDetalleOrdenPedidoDto>({
    cantidad: 1,
    idProducto: 0,
  });
  const [formErrorDetalle, setFormErrorDetalle] = useState('');
  const [searchDetalles, setSearchDetalles] = useState('');

  // Estado para modal de confirmación
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger',
  });

  // Handlers Proveedores
  const handleOpenModalProveedor = (proveedor?: Proveedor) => {
    if (proveedor) {
      setEditingProveedor(proveedor);
      setFormDataProveedor({
        cedulaJuridica: proveedor.cedulaJuridica,
        nombre: proveedor.nombre,
        telefono: proveedor.telefono
      });
    } else {
      setEditingProveedor(null);
      setFormDataProveedor({
        cedulaJuridica: '',
        nombre: '',
        telefono: ''
      });
    }
    setFormErrorProveedor('');
    setShowModalProveedor(true);
  };

  const handleCloseModalProveedor = () => {
    setShowModalProveedor(false);
    setEditingProveedor(null);
    setFormErrorProveedor('');
  };

  const handleSubmitProveedor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorProveedor('');

    try {
      if (editingProveedor) {
        await actualizarProveedor(formDataProveedor);
      } else {
        await insertarProveedor(formDataProveedor);
      }
      handleCloseModalProveedor();
    } catch (err: any) {
      setFormErrorProveedor(err.message);
    }
  };

  const handleToggleEstadoProveedor = (proveedor: Proveedor) => {
    const accion = proveedor.estado ? 'desactivar' : 'activar';
    setConfirmModal({
      isOpen: true,
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Proveedor?`,
      message: `¿Está seguro de ${accion} al proveedor "${proveedor.nombre}"?`,
      type: proveedor.estado ? 'danger' : 'success',
      onConfirm: async () => {
        try {
          if (proveedor.estado) {
            await desactivarProveedor(proveedor.cedulaJuridica);
          } else {
            await activarProveedor(proveedor.cedulaJuridica);
          }
        } catch (err: any) {
          alert(err.message);
        }
      },
    });
  };

  const handleBuscarProveedores = () => {
    setFiltrosProveedores({
      buscar: searchProveedores || undefined,
      estado: filtroEstadoProveedor,
      page: 1,
      pageSize: 10,
    });
    fetchProveedores({
      buscar: searchProveedores || undefined,
      estado: filtroEstadoProveedor,
      page: 1,
      pageSize: 10,
    });
  };

  const handlePaginacionProveedores = (newPage: number) => {
    setFiltrosProveedores(prev => ({ ...prev, page: newPage }));
    fetchProveedores({ ...{ buscar: searchProveedores || undefined, estado: filtroEstadoProveedor, pageSize: 10 }, page: newPage });
  };

  // Handlers Órdenes
  const handleOpenModalOrden = () => {
    setFormDataOrden({
      numeroOrden: 0,
      cedulaJuridica: '',
      estadoDePago: false,
    });
    setFormErrorOrden('');
    setShowModalOrden(true);
  };

  const handleCloseModalOrden = () => {
    setShowModalOrden(false);
    setFormErrorOrden('');
  };

  const handleSubmitOrden = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorOrden('');

    try {
      await insertarOrdenPedido(formDataOrden);
      handleCloseModalOrden();
    } catch (err: any) {
      setFormErrorOrden(err.message);
    }
  };

  const handleCambiarEstadoPago = (orden: any) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Cambiar Estado de Pago?',
      message: `¿Está seguro de cambiar el estado de pago de la orden #${orden.numeroOrden}?`,
      type: 'success',
      onConfirm: async () => {
        try {
          await cambiarEstadoPago({
            numeroOrden: orden.numeroOrden,
            estadoDePago: !orden.estadoDePago,
          });
        } catch (err: any) {
          alert(err.message);
        }
      },
    });
  };

  const handleBuscarOrdenes = () => {
    setFiltrosOrdenes({
      buscar: searchOrdenes || undefined,
      estadoDePago: filtroEstadoPago,
      fechaInicio: filtroFechaInicio || undefined,
      fechaFin: filtroFechaFin || undefined,
      page: 1,
      pageSize: 10,
    });
    fetchOrdenPedidos({
      buscar: searchOrdenes || undefined,
      estadoDePago: filtroEstadoPago,
      fechaInicio: filtroFechaInicio || undefined,
      fechaFin: filtroFechaFin || undefined,
      page: 1,
      pageSize: 10,
    });
  };

  const handlePaginacionOrdenes = (newPage: number) => {
    setFiltrosOrdenes(prev => ({ ...prev, page: newPage }));
    fetchOrdenPedidos({
      buscar: searchOrdenes || undefined,
      estadoDePago: filtroEstadoPago,
      fechaInicio: filtroFechaInicio || undefined,
      fechaFin: filtroFechaFin || undefined,
      pageSize: 10,
      page: newPage
    });
  };

  // Handlers Detalles
  const handleOpenModalDetalle = (detalle?: any) => {
    if (detalle) {
      setEditingDetalle(detalle);
      setFormDataDetalle({
        cantidad: detalle.cantidad,
        idProducto: detalle.idProducto,
      });
    } else {
      setEditingDetalle(null);
      setFormDataDetalle({
        cantidad: 1,
        idProducto: productos.length > 0 ? productos[0].idProducto : 0,
      });
    }
    setFormErrorDetalle('');
    setShowModalDetalle(true);
  };

  const handleCloseModalDetalle = () => {
    setShowModalDetalle(false);
    setEditingDetalle(null);
    setFormErrorDetalle('');
  };

  const handleSubmitDetalle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorDetalle('');

    try {
      if (editingDetalle) {
        await updateDetalle(editingDetalle.idDetalleOrdenPedido, formDataDetalle);
      } else {
        await createDetalle(formDataDetalle);
      }
      handleCloseModalDetalle();
    } catch (err: any) {
      setFormErrorDetalle(err.message);
    }
  };

  const handleDeleteDetalle = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar Detalle?',
      message: 'Esta acción no se puede deshacer. ¿Desea continuar?',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDetalle(id);
        } catch (err: any) {
          alert(err.message);
        }
      },
    });
  };

  // Filtrar detalles
  const detallesFiltrados = detalles.filter(d =>
    d.nombreProducto.toLowerCase().includes(searchDetalles.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Gestión de Compras</h1>
            <p className="text-sm text-gray-500 mt-1">Administra proveedores, órdenes de pedido y productos</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('proveedores')}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === 'proveedores'
                  ? 'bg-white text-blue-600 border-t-2 border-x border-blue-600 border-b-0'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Users size={18} />
              Proveedores
            </button>
            <button
              onClick={() => setActiveTab('ordenes')}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === 'ordenes'
                  ? 'bg-white text-blue-600 border-t-2 border-x border-blue-600 border-b-0'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <FileText size={18} />
              Órdenes de Pedido
            </button>
            <button
              onClick={() => setActiveTab('detalles')}
              className={`flex items-center gap-2 px-5 py-3 font-medium transition rounded-t-lg ${
                activeTab === 'detalles'
                  ? 'bg-white text-blue-600 border-t-2 border-x border-blue-600 border-b-0'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={18} />
              Detalles de Orden
            </button>
          </div>

          <div className="p-6">
            {/* Proveedores Tab */}
            {activeTab === 'proveedores' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Proveedores</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona tus proveedores</p>
                  </div>
                  <button
                    onClick={() => handleOpenModalProveedor()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                  >
                    <Plus size={18} />
                    Nuevo Proveedor
                  </button>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, cédula o teléfono..."
                      value={searchProveedores}
                      onChange={(e) => setSearchProveedores(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleBuscarProveedores()}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <select
                    value={filtroEstadoProveedor === undefined ? '' : filtroEstadoProveedor.toString()}
                    onChange={(e) => setFiltroEstadoProveedor(e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Todos los estados</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                  </select>
                  <button
                    onClick={handleBuscarProveedores}
                    className="md:col-span-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    <Filter size={18} />
                    Aplicar Filtros
                  </button>
                </div>

                {errorProveedores && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorProveedores}</span>
                  </div>
                )}

                {loadingProveedores ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando proveedores...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cédula</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teléfono</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {proveedores.map((proveedor) => (
                            <tr key={proveedor.idProveedor} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-700 font-medium">{proveedor.cedulaJuridica}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{proveedor.nombre}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{proveedor.telefono}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  proveedor.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {proveedor.estado ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleOpenModalProveedor(proveedor)}
                                    className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition"
                                    title="Editar"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleEstadoProveedor(proveedor)}
                                    className={`p-1.5 rounded-lg transition ${
                                      proveedor.estado
                                        ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                    }`}
                                    title={proveedor.estado ? 'Desactivar' : 'Activar'}
                                  >
                                    {proveedor.estado ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {proveedores.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Users size={48} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">No se encontraron proveedores</p>
                        </div>
                      )}
                    </div>

                    {/* Paginación */}
                    {totalPagesProveedores > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-600">
                          Página {pageProveedores} de {totalPagesProveedores}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePaginacionProveedores(pageProveedores - 1)}
                            disabled={pageProveedores === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() => handlePaginacionProveedores(pageProveedores + 1)}
                            disabled={pageProveedores === totalPagesProveedores}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Órdenes Tab */}
            {activeTab === 'ordenes' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Órdenes de Pedido</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona las órdenes de compra</p>
                  </div>
                  <button
                    onClick={handleOpenModalOrden}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                  >
                    <Plus size={18} />
                    Nueva Orden
                  </button>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por número o proveedor..."
                      value={searchOrdenes}
                      onChange={(e) => setSearchOrdenes(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleBuscarOrdenes()}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <select
                    value={filtroEstadoPago === undefined ? '' : filtroEstadoPago.toString()}
                    onChange={(e) => setFiltroEstadoPago(e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Todos los estados</option>
                    <option value="true">Pagado</option>
                    <option value="false">Pendiente</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={filtroFechaInicio}
                      onChange={(e) => setFiltroFechaInicio(e.target.value)}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      placeholder="Fecha inicio"
                    />
                    <input
                      type="date"
                      value={filtroFechaFin}
                      onChange={(e) => setFiltroFechaFin(e.target.value)}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      placeholder="Fecha fin"
                    />
                  </div>
                  <button
                    onClick={handleBuscarOrdenes}
                    className="md:col-span-4 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    <Filter size={18} />
                    Aplicar Filtros
                  </button>
                </div>

                {errorOrdenes && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorOrdenes}</span>
                  </div>
                )}

                {loadingOrdenes ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando órdenes...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Número</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Proveedor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cédula</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado Pago</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ordenes.map((orden) => (
                            <tr key={orden.idOrdenPedido} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-700 font-bold">#{orden.numeroOrden}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  {new Date(orden.fecha).toLocaleDateString('es-ES')}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{orden.nombreProveedor}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{orden.cedulaJuridica}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                  orden.estadoDePago ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {orden.estadoDePago ? 'Pagado' : 'Pendiente'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() => handleCambiarEstadoPago(orden)}
                                  className={`p-1.5 rounded-lg transition ${
                                    orden.estadoDePago
                                      ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                                      : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                  }`}
                                  title={orden.estadoDePago ? 'Marcar como pendiente' : 'Marcar como pagado'}
                                >
                                  {orden.estadoDePago ? <XCircle size={16} /> : <CheckCircle size={16} />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {ordenes.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">No se encontraron órdenes</p>
                        </div>
                      )}
                    </div>

                    {/* Paginación */}
                    {totalPagesOrdenes > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-600">
                          Página {pageOrdenes} de {totalPagesOrdenes}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePaginacionOrdenes(pageOrdenes - 1)}
                            disabled={pageOrdenes === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() => handlePaginacionOrdenes(pageOrdenes + 1)}
                            disabled={pageOrdenes === totalPagesOrdenes}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Detalles Tab */}
            {activeTab === 'detalles' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Detalles de Orden</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Gestiona los productos de las órdenes</p>
                  </div>
                  <button
                    onClick={() => handleOpenModalDetalle()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                    disabled={productos.length === 0}
                  >
                    <Plus size={18} />
                    Agregar Producto
                  </button>
                </div>

                {productos.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">Debe crear productos antes de agregar detalles</span>
                  </div>
                )}

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre de producto..."
                    value={searchDetalles}
                    onChange={(e) => setSearchDetalles(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                {errorDetalles && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span className="text-sm">{errorDetalles}</span>
                  </div>
                )}

                {loadingDetalles ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-sm">Cargando detalles...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cantidad</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Costo Unitario</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock Disponible</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detallesFiltrados.map((detalle) => (
                          <tr key={detalle.idDetalleOrdenPedido} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm text-gray-600">{detalle.idDetalleOrdenPedido}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{detalle.nombreProducto}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                {detalle.cantidad}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 font-medium">₡{detalle.costo.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                              ₡{(detalle.cantidad * detalle.costo).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                detalle.stock > 10 ? 'bg-green-100 text-green-700' :
                                detalle.stock > 0 ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {detalle.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleOpenModalDetalle(detalle)}
                                  className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition"
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteDetalle(detalle.idDetalleOrdenPedido)}
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
                    {detallesFiltrados.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No se encontraron detalles de orden</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Proveedor */}
      {showModalProveedor && (
        <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <button onClick={handleCloseModalProveedor} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorProveedor && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorProveedor}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProveedor} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cédula Jurídica *</label>
                  <input
                    type="text"
                    value={formDataProveedor.cedulaJuridica}
                    onChange={(e) => setFormDataProveedor({ ...formDataProveedor, cedulaJuridica: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                    disabled={!!editingProveedor}
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                  <input
                    type="text"
                    value={formDataProveedor.nombre}
                    onChange={(e) => setFormDataProveedor({ ...formDataProveedor, nombre: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono *</label>
                  <input
                    type="text"
                    value={formDataProveedor.telefono}
                    onChange={(e) => setFormDataProveedor({ ...formDataProveedor, telefono: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                    maxLength={8}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModalProveedor}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                  >
                    {editingProveedor ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Orden */}
      {showModalOrden && (
        <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Nueva Orden de Pedido</h2>
              <button onClick={handleCloseModalOrden} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorOrden && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorOrden}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOrden} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de Orden *</label>
                  <input
                    type="number"
                    value={formDataOrden.numeroOrden || ''}
                    onChange={(e) => setFormDataOrden({ ...formDataOrden, numeroOrden: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Proveedor *</label>
                  <select
                    value={formDataOrden.cedulaJuridica}
                    onChange={(e) => setFormDataOrden({ ...formDataOrden, cedulaJuridica: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.filter(p => p.estado).map((proveedor) => (
                      <option key={proveedor.idProveedor} value={proveedor.cedulaJuridica}>
                        {proveedor.nombre} - {proveedor.cedulaJuridica}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="estadoDePago"
                    checked={formDataOrden.estadoDePago}
                    onChange={(e) => setFormDataOrden({ ...formDataOrden, estadoDePago: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="estadoDePago" className="text-sm font-medium text-gray-700">
                    Marcar como Pagado
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModalOrden}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                  >
                    Crear Orden
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {showModalDetalle && (
        <div className="fixed inset-0 bg-black/30  backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingDetalle ? 'Editar Detalle' : 'Agregar Producto a Orden'}
              </h2>
              <button onClick={handleCloseModalDetalle} className="text-gray-400 hover:text-gray-600 transition">
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              {formErrorDetalle && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{formErrorDetalle}</span>
                </div>
              )}

              <form onSubmit={handleSubmitDetalle} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Producto *</label>
                  <select
                    value={formDataDetalle.idProducto}
                    onChange={(e) => setFormDataDetalle({ ...formDataDetalle, idProducto: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value={0}>Seleccione un producto</option>
                    {productos.map((producto) => (
                      <option key={producto.idProducto} value={producto.idProducto}>
                        {producto.nombre} - Stock: {producto.stock} - ₡{producto.costo.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad *</label>
                  <input
                    type="number"
                    value={formDataDetalle.cantidad}
                    onChange={(e) => setFormDataDetalle({ ...formDataDetalle, cantidad: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                    min="1"
                  />
                </div>

                {formDataDetalle.idProducto > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">Información del Producto</p>
                    {(() => {
                      const producto = productos.find(p => p.idProducto === formDataDetalle.idProducto);
                      if (producto) {
                        return (
                          <div className="space-y-1 text-sm text-blue-700">
                            <p><span className="font-medium">Stock disponible:</span> {producto.stock}</p>
                            <p><span className="font-medium">Costo unitario:</span> ₡{producto.costo.toFixed(2)}</p>
                            <p><span className="font-medium">Subtotal:</span> ₡{(producto.costo * formDataDetalle.cantidad).toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModalDetalle}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                  >
                    {editingDetalle ? 'Actualizar' : 'Agregar'}
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
  );
};

export default ProveedoresOrdenesModule;