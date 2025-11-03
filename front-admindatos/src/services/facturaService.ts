// services/facturaService.ts
import client from "../Client/ConfigClient";
import type { Factura, CreateFacturaResponse, UpdateFacturaDto } from '../types/factura';

export const facturaService = {
  // Listar todas las facturas
  getAllFacturas: async (): Promise<Factura[]> => {
    const response = await client.get<Factura[]>('/Facturas');
    return response.data;
  },

  // Buscar factura por ID
  getFacturaById: async (id: number): Promise<Factura> => {
    const response = await client.get<Factura>(`/Facturas/${id}`);
    return response.data;
  },

  // Crear nueva factura (vacía)
  createFactura: async (): Promise<CreateFacturaResponse> => {
    const response = await client.post<CreateFacturaResponse>('/Facturas/crear');
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

    const response = await client.put<{ mensaje: string }>(`/Facturas?${params.toString()}`);
    return response.data;
  },

  // Actualizar solo el monto cancelado
  updateMontoCancelado: async (idFactura: number, montoCancelado: number): Promise<{ mensaje: string }> => {
    const response = await client.put(
      `/Facturas/monto-cancelado?idFactura=${idFactura}&montoCancelado=${montoCancelado}`
    );
    return response.data;
  },
};