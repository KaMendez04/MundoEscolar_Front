// services/facturaService.ts
import axios from 'axios';
import type { Factura, CreateFacturaResponse, UpdateFacturaDto } from '../types/factura';

// 🔧 CONFIGURACIÓN: URL de tu API
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7206/api';

const facturaApi = axios.create({
  baseURL: `${API_URL}/Facturas`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
  // Para desarrollo local con certificados autofirmados
  // En producción, elimina esta línea
  withCredentials: false,
});

// Interceptor para logging de errores
facturaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en facturaApi:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const facturaService = {
  // Listar todas las facturas
  getAllFacturas: async (): Promise<Factura[]> => {
    const response = await facturaApi.get<Factura[]>('/');
    return response.data;
  },

  // Buscar factura por ID
  getFacturaById: async (id: number): Promise<Factura> => {
    const response = await facturaApi.get<Factura>(`/${id}`);
    return response.data;
  },

  // Crear nueva factura (vacía)
  createFactura: async (): Promise<CreateFacturaResponse> => {
    const response = await facturaApi.post<CreateFacturaResponse>('/crear');
    return response.data;
  },

  // Actualizar factura (cliente, vendedor, estado, monto cancelado)
  updateFactura: async (data: UpdateFacturaDto): Promise<{ mensaje: string }> => {
    const params = new URLSearchParams();
    params.append('idFactura', data.idFactura.toString());
    
    if (data.idCliente !== undefined && data.idCliente !== null) {
      params.append('idCliente', data.idCliente.toString());
    }
    if (data.idVendedor !== undefined && data.idVendedor !== null) {
      params.append('idVendedor', data.idVendedor.toString());
    }
    if (data.montoCancelado !== undefined && data.montoCancelado !== null) {
      params.append('montoCancelado', data.montoCancelado.toString());
    }
    if (data.estadoPago !== undefined && data.estadoPago !== null) {
      params.append('estadoPago', data.estadoPago.toString());
    }

    const response = await facturaApi.put<{ mensaje: string }>(`?${params.toString()}`);
    return response.data;
  },

  // Actualizar solo el monto cancelado
  updateMontoCancelado: async (idFactura: number, montoCancelado: number): Promise<{ mensaje: string }> => {
    const response = await facturaApi.put(
      `/monto-cancelado?idFactura=${idFactura}&montoCancelado=${montoCancelado}`
    );
    return response.data;
  },
};