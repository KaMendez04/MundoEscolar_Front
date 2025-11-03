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

  actualizarOrdenPedido: async (orden: UpdateOrdenPedidoDto): Promise<string[]> => {
    const response = await client.patch<string[]>('/OrdenPedido/Actualizar', orden);
    return response.data;
  },
  actualizarMontoCancelado: async (idOrdenPedido: number, montoCancelado: number): Promise<string[]> => {
    const response = await client.patch<string[]>(`/OrdenPedido/ActualizarMontoCancelado?idOrdenPedido=${idOrdenPedido}&montoCancelado=${montoCancelado}`);
    return response.data;
  },
  obtenerOrdenPedidos: async (): Promise<VistaOrdenPedido> => {
    const response = await client.get<VistaOrdenPedido>('/OrdenPedido');
    return response.data;
  },

  obtenerOrdenPedidoPorId: async (idOrdenPedido: number): Promise<OrdenPedido> => {
    const response = await client.get<OrdenPedido>(`/OrdenPedido/ById/${idOrdenPedido}`);
    return response.data;
  },
};