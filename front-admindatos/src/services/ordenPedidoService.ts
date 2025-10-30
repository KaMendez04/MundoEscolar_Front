// services/ordenPedidoService.ts
import client from '../Client/ConfigClient';
import type { 
  OrdenPedido,
  CreateOrdenPedidoDto,
  UpdateOrdenPedidoDto,
  VistaOrdenPedido,
  InsertarOrdenPedidoResponse,
} from '../types/ordenPedido';

export const ordenPedidoService = {
  insertarOrdenPedido: async (orden: CreateOrdenPedidoDto): Promise<InsertarOrdenPedidoResponse> => {
    const response = await client.post<InsertarOrdenPedidoResponse>('/OrdenPedido/', orden);
    return response.data;
  },

  cambiarEstadoPago: async (estado: UpdateOrdenPedidoDto): Promise<string[]> => {
    const response = await client.patch<string[]>('/OrdenPedido/Actualizar', estado);
    return response.data;
  },

  obtenerOrdenPedidos: async (): Promise<VistaOrdenPedido> => {
    const response = await client.get<VistaOrdenPedido>('/OrdenPedido');
    return response.data;
  },

  obtenerOrdenPedidoPorId: async (id: number): Promise<OrdenPedido> => {
    const response = await client.get<OrdenPedido>(`/OrdenPedido/${id}`);
    return response.data;
  },
};