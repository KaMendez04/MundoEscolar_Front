import { useState } from 'react';

export interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  productos: ProductoVenta[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodoPago: string;
}

export interface ProductoVenta {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

const ventasQuemadas: Venta[] = [
  {
    id: 'V-001',
    fecha: '2025-10-09',
    cliente: 'María González',
    productos: [
      { id: 'P1', nombre: 'Laptop Dell', cantidad: 2, precioUnitario: 800, subtotal: 1600 },
      { id: 'P2', nombre: 'Mouse Inalámbrico', cantidad: 5, precioUnitario: 25, subtotal: 125 }
    ],
    subtotal: 1725,
    descuento: 86.25,
    total: 1638.75,
    estado: 'completada',
    metodoPago: 'Tarjeta de Crédito'
  },
  {
    id: 'V-002',
    fecha: '2025-10-08',
    cliente: 'Carlos Ramírez',
    productos: [
      { id: 'P3', nombre: 'Monitor 27"', cantidad: 1, precioUnitario: 350, subtotal: 350 },
      { id: 'P4', nombre: 'Teclado Mecánico', cantidad: 1, precioUnitario: 120, subtotal: 120 }
    ],
    subtotal: 470,
    descuento: 0,
    total: 470,
    estado: 'completada',
    metodoPago: 'Efectivo'
  },
  {
    id: 'V-003',
    fecha: '2025-10-08',
    cliente: 'Ana Torres',
    productos: [
      { id: 'P5', nombre: 'Impresora HP', cantidad: 1, precioUnitario: 250, subtotal: 250 }
    ],
    subtotal: 250,
    descuento: 25,
    total: 225,
    estado: 'pendiente',
    metodoPago: 'Transferencia'
  },
  {
    id: 'V-004',
    fecha: '2025-10-07',
    cliente: 'Roberto Silva',
    productos: [
      { id: 'P6', nombre: 'Silla Ergonómica', cantidad: 3, precioUnitario: 180, subtotal: 540 },
      { id: 'P7', nombre: 'Escritorio Ajustable', cantidad: 1, precioUnitario: 450, subtotal: 450 }
    ],
    subtotal: 990,
    descuento: 99,
    total: 891,
    estado: 'completada',
    metodoPago: 'Tarjeta de Débito'
  },
  {
    id: 'V-005',
    fecha: '2025-10-07',
    cliente: 'Laura Mendoza',
    productos: [
      { id: 'P8', nombre: 'Webcam HD', cantidad: 2, precioUnitario: 85, subtotal: 170 }
    ],
    subtotal: 170,
    descuento: 0,
    total: 170,
    estado: 'cancelada',
    metodoPago: 'Efectivo'
  }
];

export const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>(ventasQuemadas);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'completada' | 'cancelada'>('todos');

  const ventasFiltradas = filtroEstado === 'todos'
    ? ventas
    : ventas.filter(v => v.estado === filtroEstado);

  const totalVentas = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);
  const cantidadVentas = ventasFiltradas.length;

  const actualizarEstado = (id: string, nuevoEstado: Venta['estado']) => {
    setVentas(ventas.map(v =>
      v.id === id ? { ...v, estado: nuevoEstado } : v
    ));
  };

  return {
    ventas: ventasFiltradas,
    filtroEstado,
    setFiltroEstado,
    totalVentas,
    cantidadVentas,
    actualizarEstado
  };
};
