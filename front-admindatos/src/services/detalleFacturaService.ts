// services/detalleFacturaService.ts
import axios from 'axios';
import type { DetalleFactura, CreateDetalleFacturaDto } from '../types/factura';

// 🔧 CONFIGURACIÓN: URL de tu API
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7206/api';

const detalleFacturaApi = axios.create({
  baseURL: `${API_URL}/DetalleFactura`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});

// Interceptor para logging de errores
detalleFacturaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en detalleFacturaApi:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const detalleFacturaService = {
  // Agregar detalle a una factura
  addDetalleFactura: async (data: CreateDetalleFacturaDto): Promise<void> => {
    const params = new URLSearchParams();
    params.append('idFactura', data.idFactura.toString());
    params.append('cantidad', data.cantidad.toString());
    
    if (data.idProducto !== undefined && data.idProducto !== null) {
      params.append('idProducto', data.idProducto.toString());
    }
    if (data.idServicio !== undefined && data.idServicio !== null) {
      params.append('idServicio', data.idServicio.toString());
    }

    await detalleFacturaApi.post(`?${params.toString()}`);
  },

  // Buscar detalle por ID
  getDetalleById: async (id: number): Promise<DetalleFactura> => {
    const response = await detalleFacturaApi.get<DetalleFactura>(`/${id}`);
    return response.data;
  },

  // Actualizar detalle
  updateDetalle: async (id: number, data: Partial<DetalleFactura>): Promise<void> => {
    await detalleFacturaApi.put(`/${id}`, data);
  },
};