import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  PackagePlus,
  FileText, 
  ChevronRight, 
  Truck, 
  LogOut, 
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp,
  ShoppingBasket,
  Users,
  UserCheck,
  FolderOpen,
  ShoppingCart
} from "lucide-react";
import { useNotificaciones } from "../../hooks/useNotificacion";
import { useMiVendedor } from "../../hooks/useMiVendedor";
import { NotificationDropdown } from "../Notificaciones/NotificacionDropdown";
import VendedorProfile from "../VendedorProfile.tsx";
import AnimatedClock from "../../components/ui/Reloj.tsx";
import { vendedoresService } from "../../services/vendedoresService";

interface NavBarProps {
  onLogout?: () => void;
  children: React.ReactNode;
}

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/Ventas': 'Área de Ventas',
  '/Inventario': 'Control de Inventario',
  '/Reportes': 'Reportes',
  '/Orden': 'Orden de Proveedor',
  '/VentasServicio': 'Inventario Servicio',
  '/clientes': 'Clientes',
  '/vendedores': 'Vendedores',
  '/facturas': 'Facturas',
};

const navigationItems = [
  { to: '/', icon: TrendingUp, label: 'Dashboard' },
  { to: '/Ventas', icon: ShoppingCart, label: 'Ventas' },
  { to: '/Inventario', icon: PackagePlus, label: 'Control de Inventario' },
  { to: '/VentasServicio', icon: ShoppingBasket, label: 'Servicios' },
  { to: '/Reportes', icon: FileText, label: 'Reportes', hasSubmenu: true },
  { to: '/Orden', icon: Truck, label: 'Orden de Proveedor' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/vendedores', icon: UserCheck, label: 'Vendedores' },
  { to: '/facturas', icon: FolderOpen, label: 'Facturas' },
];

// Variantes de animación optimizadas
const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Animación específica para el reloj con efecto de "aparición suave"
const clockVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0
  }
};

const NavBar: React.FC<NavBarProps> = ({ onLogout, children }) => {
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    notificaciones,
    contador,
    loading,
    refetch,
    marcarComoLeida,
    marcarTodasComoLeidas
  } = useNotificaciones();

  const { vendedor, loading: loadingVendedor, error: errorVendedor } = useMiVendedor();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (isLoggedIn && location.pathname !== "/") {
      navigate({ to: "/" });
    }
  }, []);

  useEffect(() => {
    if (errorVendedor) {
      console.error("❌ Error cargando vendedor:", errorVendedor);
    } else if (vendedor) {
      console.log("✅ Vendedor cargado:", vendedor.nombre, vendedor.apellido1);
    }
  }, [vendedor, errorVendedor]);

  const isExpanded = isPinned || isHovered;
  const currentTitle = useMemo(() => routeTitles[location.pathname] || "Dashboard", [location.pathname]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '500px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              background: '#f0fdf4',
              border: '1px solid #86efac',
              color: '#065f46',
            }
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontWeight: '500',
            }
          },
        }}
      />

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <motion.div 
          className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col relative`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div 
            className="p-2 border-b border-gray-200 flex-shrink-0"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <motion.img
                className="w-12 h-12 cursor-pointer"
                src="../../../public/LogoMundoEscolar.png"
                alt="Logo Mundo Escolar"
                onClick={() => window.location.reload()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              />
              <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
                <span className="text-xl font-semibold text-gray-900 whitespace-nowrap">Mundo Escolar</span>
              </div>
            </div>
          </motion.div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <motion.div 
                  key={item.to}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.25 + (index * 0.04),
                    ease: "easeOut" 
                  }}
                >
                  <Link
                    to={item.to}
                    className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-300 ease-in-out text-sm ${
                      isActive 
                        ? 'text-gray-900 bg-gray-100 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Icon className={`transition-all duration-300 ease-in-out ${isExpanded ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </div>
                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden flex items-center`}>
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.hasSubmenu && <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout */}
          {onLogout && (
            <motion.div 
              className="p-4 border-t border-gray-200 flex-shrink-0"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
            >
              <button
                className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} w-full py-3 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 ease-in-out`}
                onClick={onLogout}
              >
                <div className="flex-shrink-0">
                  <LogOut className={`transition-all duration-300 ease-in-out ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'}`} />
                </div>
                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
                  <span className="whitespace-nowrap">Logout</span>
                </div>
              </button>
            </motion.div>
          )}

          {/* Botón pin/unpin */}
          <motion.div 
            className="absolute -right-3 top-6 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
          >
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`w-6 h-6 border rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isPinned 
                  ? 'bg-blue-400 border-blue-300 hover:bg-blue-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isPinned ? (
                <PanelLeftClose className="w-3 h-3 text-white" />
              ) : (
                <PanelLeftOpen className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <motion.header 
            className="bg-white border-b border-gray-200 px-6 py-[10px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between relative">
              <motion.h1 
                className="text-xl font-semibold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                {currentTitle}
              </motion.h1>
              
              {/* Reloj animado centrado con animación mejorada */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                variants={clockVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                  scale: {
                    type: "spring",
                    damping: 15,
                    stiffness: 200
                  }
                }}
              >
                <AnimatedClock fontSize={18} className="text-gray-700" />
              </motion.div>

              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
                >
                  <NotificationDropdown
                    notificaciones={notificaciones}
                    contador={contador}
                    onMarcarLeida={marcarComoLeida}
                    onMarcarTodas={marcarTodasComoLeidas}
                    onRefetch={refetch}
                    loading={loading}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
                >
                  <VendedorProfile
                    vendedor={vendedor || undefined}
                    loading={loadingVendedor}
                    error={errorVendedor}
                    onFetchVendedor={vendedoresService.getMiVendedor}
                  />
                </motion.div>
              </div>
            </div>
          </motion.header>

          <motion.main 
            className="flex-1 p-6 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default NavBar;