import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { 
  BarChart3, 
  PackagePlus,
  FileText, 
  ChevronRight, 
  Truck, 
  LogOut, 
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  ChartSpline,
  ShoppingBasket,
  Users,
  UserStar,
  FolderOpenDot,
} from "lucide-react";
import { useNotificaciones } from "../../hooks/useNotificacion";
import { NotificationDropdown } from "../Notificaciones/NotificacionDropdown";


interface NavBarProps {
  onLogout?: () => void;
  children: React.ReactNode;
}

// ✅ Títulos de rutas
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

// ✅ Ítems de navegación
const navigationItems = [
  { to: '/', icon: ChartSpline, label: 'Dashboard' },
  { to: '/Ventas', icon: BarChart3, label: 'Ventas' },
  { to: '/Inventario', icon: PackagePlus, label: 'Control de Inventario' },
  { to: '/VentasServicio', icon: ShoppingBasket, label: 'Servicios' },
  { to: '/Reportes', icon: FileText, label: 'Reportes', hasSubmenu: true },
  { to: '/Orden', icon: Truck, label: 'Orden de Proveedor' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/vendedores', icon: UserStar, label: 'Vendedores' },
  { to: '/facturas', icon: FolderOpenDot, label: 'Facturas' },
];

const NavBar: React.FC<NavBarProps> = ({ onLogout, children }) => {
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Hook de notificaciones con refetch manual
  const {
    notificaciones,
    contador,
    loading,
    refetch,
    marcarComoLeida,
    marcarTodasComoLeidas
  } = useNotificaciones();

  // ✅ Forzar redirección al Dashboard al iniciar sesión o recargar
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (isLoggedIn && location.pathname !== "/") {
      navigate({ to: "/" });
    }
  }, []);

  // 🧪 TEST: Verificar que el Toaster funcione al montar el componente
  useEffect(() => {
    console.log("✅ NavBar montado - Toaster debería estar activo");
    // Descomentar siguiente línea para ver un toast de prueba al cargar
    // toast.success("Sistema de notificaciones iniciado", { duration: 2000 });
  }, []);

  const isExpanded = isPinned || isHovered;
  const currentTitle = routeTitles[location.pathname] || "Dashboard";

  return (
    <>
      {/* ⚠️ IMPORTANTE: Sistema de Toast - DEBE estar aquí */}
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
          // Configuración por defecto
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
          // Toast de éxito
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
          // Toast de error
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
        <div 
          className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col relative`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Header */}
          <div className="p-2 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img
                className="w-12 h-12 cursor-pointer"
                src="../../../public/LogoMundoEscolar.png"
                alt="Logo Mundo Escolar"
                onClick={() => window.location.reload()}
              />
              <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
                <span className="text-xl font-semibold text-gray-900 whitespace-nowrap">Mundo Escolar</span>
              </div>
            </div>
          </div>

          {/* Botón pin/unpin */}
          <div className="absolute -right-3 top-6 z-20">
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-lg transition-all duration-300 ${
                isPinned 
                  ? 'bg-blue-40 border-blue-100' 
                  : 'bg-blue-100 border-blue-200'
              }`}
            >
              {isPinned ? (
                <PanelLeftClose className="w-3 h-3 text-gray-400" />
              ) : (
                <PanelLeftOpen className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <div key={item.to}>
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
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          {onLogout && (
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
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
            </div>
          )}
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-[14px]">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">{currentTitle}</h1>
              <div className="flex items-center gap-4">
                {/* Dropdown de notificaciones con refetch */}
                <NotificationDropdown
                  notificaciones={notificaciones}
                  contador={contador}
                  onMarcarLeida={marcarComoLeida}
                  onMarcarTodas={marcarTodasComoLeidas}
                  onRefetch={refetch}
                  loading={loading}
                />
                
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white shadow-sm">
                  <UserRound className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default NavBar;