// services/detalleFacturaService.ts
import client from "../Client/ConfigClient";
import type { DetalleFactura, CreateDetalleFacturaDto } from '../types/factura';

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

    await client.post(`/DetalleFactura?${params.toString()}`);
  },

  // Buscar detalle por ID
  getDetalleById: async (id: number): Promise<DetalleFactura> => {
    const response = await client.get<DetalleFactura>(`/DetalleFactura/${id}`);
    return response.data;
  },

  // Actualizar detalle
  updateDetalle: async (id: number, data: Partial<DetalleFactura>): Promise<void> => {
    await client.put(`/DetalleFactura/${id}`, data);
  },

  // Eliminar detalle
  deleteDetalle: async (id: number): Promise<void> => {
    await client.delete(`/DetalleFactura/${id}`);
  },
};