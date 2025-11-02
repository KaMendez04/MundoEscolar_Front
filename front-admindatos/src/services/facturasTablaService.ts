// src/services/facturasService.ts
import client from '../Client/ConfigClient';
import type { Factura } from '../types/facturasTabla';

export interface FacturaUpdateDto {
  idFactura: number;
  idCliente?: number;
  idVendedor?: number;
  montoCancelado: number;
  estadoPago: boolean;
}

export const facturasService = {
  // 🔹 Obtener todas las facturas
  getAllFacturas: async (): Promise<Factura[]> => {
    const response = await client.get<Factura[]>('/Facturas');
    return response.data;
  },

  // 🔹 Obtener una factura por su ID
  getFacturaById: async (id: number): Promise<Factura> => {
    const response = await client.get<Factura>(`/Facturas/${id}`);
    return response.data;
  },

  // 🔹 Actualizar una factura
  updateFactura: async (dto: FacturaUpdateDto): Promise<{ mensaje: string }> => {
    const response = await client.put<{ mensaje: string }>('/Facturas', dto);
    return response.data;
  },
};