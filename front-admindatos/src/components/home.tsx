import { useState, useEffect } from "react";
import {
  BookOpen,
  ShoppingCart,
  DollarSign,
  Clock,
  User,
  RotateCcw,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  time: string;
  type: "sale" | "return";
  customer: string;
  items: string;
  amount: number;
}

interface StatData {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

// Componente Card personalizado (igual que el dashboard)
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <p className={`text-sm text-slate-600 mt-1 ${className}`}>
    {children}
  </p>
);

// Componente Badge personalizado (igual que el dashboard)
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const EmployeeHome: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Formato 12h con AM/PM
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));

      // Fecha completa
      setCurrentDate(now.toLocaleDateString('es-ES', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Datos de estadísticas del día (mismo estilo que dashboard)
  const statsData: StatData[] = [
    { title: "Ventas del Día", value: "$177.04", change: "+12%", icon: DollarSign, color: "text-emerald-600" },
    { title: "Transacciones", value: "5", change: "+8%", icon: ShoppingCart, color: "text-blue-600" },
    { title: "Total Neto", value: "$145.04", change: "+23%", icon: BookOpen, color: "text-purple-600" },
    { title: "Devoluciones", value: "1", change: "-32%", icon: RotateCcw, color: "text-orange-600" },
  ];

  // Transacciones del día simuladas
  const todayTransactions: Transaction[] = [
    {
      id: "T001",
      time: "2:30 PM",
      type: "sale",
      customer: "María González",
      items: "El Principito, 1984",
      amount: 41.25
    },
    {
      id: "T002", 
      time: "1:15 PM",
      type: "sale",
      customer: "Carlos Ruiz",
      items: "Cien Años de Soledad",
      amount: 25.99
    },
    {
      id: "T003",
      time: "12:45 PM", 
      type: "return",
      customer: "Ana López",
      items: "Don Quijote",
      amount: -32.00
    },
    {
      id: "T004",
      time: "11:30 AM",
      type: "sale",
      customer: "Pedro Martín",
      items: "Harry Potter (3 libros)",
      amount: 67.50
    },
    {
      id: "T005",
      time: "10:20 AM",
      type: "sale", 
      customer: "Laura Vega",
      items: "Orgullo y Prejuicio",
      amount: 19.75
    },
    {
      id: "T006",
      time: "9:45 AM",
      type: "sale",
      customer: "Roberto Silva",
      items: "El Hobbit, El Señor de los Anillos",
      amount: 54.80
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header con fecha y hora - estilo dashboard */}
        <div className="space-y-2">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-slate-900 mb-2">
              {currentTime}
            </div>
            <p className="text-slate-600 capitalize text-lg">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Tarjetas de estadísticas - mismo estilo que dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-emerald-600 font-medium">{stat.change} desde ayer</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Lista de transacciones - estilo dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Transacciones de Hoy
            </CardTitle>
            <CardDescription>Registro completo de actividad del día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === "sale" 
                        ? "bg-emerald-100" 
                        : "bg-red-100"
                    }`}>
                      {transaction.type === "sale" ? (
                        <ShoppingCart className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <RotateCcw className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-slate-900 text-sm">
                          {transaction.id}
                        </span>
                        <Badge className="bg-slate-100 text-slate-800">
                          {transaction.time}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{transaction.customer}</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {transaction.items}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={
                      transaction.type === "sale" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-red-100 text-red-800"
                    }>
                      {transaction.type === "sale" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </Badge>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {transaction.type === "sale" ? "Venta" : "Devolución"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployeeHome;