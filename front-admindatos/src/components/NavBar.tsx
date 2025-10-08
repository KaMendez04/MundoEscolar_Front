import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, 
  BarChart3, 
  Settings, 
  Users, 
  ChevronRight, 
  Info, 
  LogOut, 
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Home
} from "lucide-react";

// ✅ Definimos las props esperadas simplificadas
interface NavBarProps {
  onLogout?: () => void;
  children: React.ReactNode;
}

// ✅ Mapeo de rutas a títulos
const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard de Estadísticas',
  '/settings': 'Settings',
  '/team': 'Team',
  '/about': 'About',
  '/test': 'Test'
};

// ✅ Configuración de navegación
const navigationItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/team', icon: Users, label: 'Team', hasSubmenu: true },
  { to: '/about', icon: Info, label: 'About' },

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
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">ME</span>
            </div>
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden`}>
              <span className="font-semibold text-gray-900 whitespace-nowrap">Mundo Escolar</span>
            </div>
          </div>
        </div>

        {/* Botón de pin/unpin - Siempre visible pero cambia según el estado */}
        <div className="absolute -right-3 top-6 z-20">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`w-6 h-6 border rounded-full flex items-center justify-center hover:bg-gray-50 shadow-lg transition-all duration-300 ${
              isPinned 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-200'
            }`}
          >
            {isPinned ? (
              <PanelLeftClose className="w-3 h-3 text-blue-600" />
            ) : (
              <PanelLeftOpen className="w-3 h-3 text-gray-600" />
            )}
          </button>
        </div>

        {/* Buscador */}
        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 max-h-20 p-4' : 'opacity-0 max-h-0 p-0'} overflow-hidden`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
                  className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-300 ease-in-out ${
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
            <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
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