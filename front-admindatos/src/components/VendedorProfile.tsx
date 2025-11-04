import React, { useState, useEffect, useRef } from 'react';
import { User, X, Mail, Phone, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaz del vendedor
interface VendedorMe {
  idVendedor: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo: string;
  estado: boolean;
}

interface VendedorProfileProps {
  vendedor?: VendedorMe;
  loading?: boolean;
  error?: string | null;
  onFetchVendedor?: () => Promise<VendedorMe>;
}

// Variantes optimizadas
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
};

const VendedorProfile: React.FC<VendedorProfileProps> = ({ 
  vendedor: vendedorProp, 
  loading: loadingProp,
  error,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendedor, setVendedor] = useState<VendedorMe | null>(vendedorProp || null);
  const [loading, setLoading] = useState(loadingProp || false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vendedorProp) {
      setVendedor(vendedorProp);
      setLoading(false);
    }
  }, [vendedorProp]);

  useEffect(() => {
    if (loadingProp !== undefined) {
      setLoading(loadingProp);
    }
  }, [loadingProp]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const handleClick = () => {
    if (error) {
      return;
    }
    if (vendedor && !loading) {
      setIsModalOpen(true);
    }
  };

  const iniciales = vendedor
    ? `${vendedor.nombre.charAt(0)}${vendedor.apellido1.charAt(0)}`.toUpperCase()
    : '';

  const nombreCompleto = vendedor
    ? `${vendedor.nombre} ${vendedor.apellido1}${vendedor.apellido2 ? ` ${vendedor.apellido2}` : ''}`
    : '';

  const nombreCorto = vendedor
    ? `${vendedor.nombre} ${vendedor.apellido1}`
    : '';

  // Si hay error de token
  if (error) {
    return (
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <AlertCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Sesión expirada</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Botón con ícono y nombre */}
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        disabled={loading}
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : vendedor ? (
            <span className="text-xs font-semibold text-gray-700">
              {iniciales}
            </span>
          ) : (
            <User className="w-4 h-4 text-gray-600" />
          )}
        </div>
        {vendedor && (
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {nombreCorto}
          </span>
        )}
      </button>

      {/* Modal con animaciones */}
      <AnimatePresence>
        {isModalOpen && vendedor && (
          <>
            {/* Overlay animado */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2, ease: "easeOut" }}
            />

            {/* Modal animado */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 shadow-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
                    >
                      <span className="text-2xl font-bold text-gray-700">
                        {iniciales}
                      </span>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-xl font-semibold text-gray-900 mb-2"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
                    >
                      {nombreCompleto}
                    </motion.h3>
                    
                    <motion.span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        vendedor.estado 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: 0.15, ease: "easeOut" }}
                    >
                      {vendedor.estado ? 'Activo' : 'Inactivo'}
                    </motion.span>
                  </div>
                </div>

                {/* Contenido con animación staggered */}
                <div className="p-8 space-y-4">
                  {/* Cédula */}
                  <motion.div 
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Cédula</p>
                      <p className="text-sm text-gray-900 font-semibold">{vendedor.cedula}</p>
                    </div>
                  </motion.div>

                  {/* Correo */}
                  <motion.div 
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25, delay: 0.25, ease: "easeOut" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Correo</p>
                      <p className="text-sm text-gray-900 truncate">{vendedor.correo}</p>
                    </div>
                  </motion.div>

                  {/* Teléfono */}
                  {vendedor.telefono && (
                    <motion.div 
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.25, delay: 0.3, ease: "easeOut" }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                        <p className="text-sm text-gray-900">{vendedor.telefono}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* ID */}
                  <motion.div 
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25, delay: vendedor.telefono ? 0.35 : 0.3, ease: "easeOut" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">ID Vendedor</p>
                      <p className="text-sm text-gray-900 font-mono font-semibold">#{vendedor.idVendedor}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendedorProfile;