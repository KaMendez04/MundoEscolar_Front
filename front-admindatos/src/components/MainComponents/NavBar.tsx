import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, 
  BarChart3, 
  PackagePlus,
  FileText, 
  ChevronRight, 
  Truck, 
  LogOut, 
  Bell,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  ChartSpline,
  ShoppingBasket,
  Users,
} from "lucide-react";

// ✅ Definimos las props esperadas simplificadas
interface NavBarProps {
  onLogout?: () => void;
  children: React.ReactNode;
}

// ✅ Mapeo de rutas a títulos
const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/Ventas': 'Area de Ventas',
  '/Inventario': 'Control de Inventario',
  '/Reportes': 'Reportes',
  '/Orden': 'Orden de Proveedor',
  '/VentasServicio': 'Inventario Servicio',
  '/clientes': 'Clientes',
};

// ✅ Configuración de navegación
const navigationItems = [
  { to: '/', icon: ChartSpline, label: 'Dashboard' },
  { to: '/Ventas', icon: BarChart3, label: 'Ventas' },
  { to: '/Inventario', icon: PackagePlus, label: 'Control de Inventario' },
  { to: '/Reportes', icon: FileText, label: 'Reportes', hasSubmenu: true },
  { to: '/Orden', icon: Truck, label: 'Orden de Proveedor' },
  { to: '/VentasServicio', icon: ShoppingBasket, label: 'Inventario Servicio' },
  { to: '/clientes', icon: Users, label: 'Clientes' },

];

const NavBar: React.FC<NavBarProps> = ({ onLogout, children }) => {
  const [isPinned, setIsPinned] = useState(true); // ✅ Cambiado a "isPinned"
  const [isHovered, setIsHovered] = useState(false); // ✅ Estado para hover
  const location = useLocation();
  
  // ✅ El sidebar está expandido si está pinned O si está en hover
  const isExpanded = isPinned || isHovered;
  
  // ✅ Obtener el título actual basado en la ruta
  const currentTitle = routeTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col relative`}
        onMouseEnter={() => setIsHovered(true)} // ✅ Expandir en hover
        onMouseLeave={() => setIsHovered(false)} // ✅ Contraer cuando sale el mouse
      >
        {/* Header del Sidebar */}
        <div className="p-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
              <img className="w-12 h-12" src="../../../public/LogoMundoEscolar.png" alt="" onClick={() => window.location.reload()}/>
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
              <span className="text-xl font-semibold text-gray-900 whitespace-nowrap">Mundo Escolar</span>
            </div>
          </div>
        </div>

        {/* Botón de pin/unpin - Siempre visible pero cambia según el estado */}
        <div className="absolute -right-3 top-6 z-20">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-lg transition-all duration-300 ${
              isPinned 
                ? 'bg-blue-40 border-blue-100' 
                : 'bg-white border-gray-200'
            }`}
          >
            {isPinned ? (
              <PanelLeftClose className="w-3 h-3 text-gray-400" />
            ) : (
              <PanelLeftOpen className="w-3 h-3 text-gray-600" />
            )}
          </button>
        </div>


        {/* Navigation Items - Dinámico */}
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

        {/* Logout Button - Solo si se proporciona onLogout */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header - Título dinámico */}
        <header className="bg-white border-b border-gray-200 px-6 py-[14px] ">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">{currentTitle}</h1>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
              {/* User Avatar */}
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white shadow-sm">
              <UserRound className="w-5 h-5 text-gray-600" />
            </div>

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavBar;