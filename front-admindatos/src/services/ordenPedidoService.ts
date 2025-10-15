// services/ordenPedidoService.ts
import client from '../Client/ConfigClient';
import type { 
  OrdenPedido,
  CreateOrdenPedidoDto, 
  UpdateEstadoOrdenPedidoDto, 
  FiltrosOrdenPedido, 
  ResultadoPaginadoOrdenPedido 
} from '../types/ordenPedido';

export const ordenPedidoService = {
  insertarOrdenPedido: async (orden: CreateOrdenPedidoDto): Promise<string[]> => {
    const response = await client.post<string[]>('/OrdenPedido/Insertar', orden);
    return response.data;
  },

  cambiarEstadoPago: async (estado: UpdateEstadoOrdenPedidoDto): Promise<string[]> => {
    const response = await client.put<string[]>('/OrdenPedido/CambiarEstado', estado);
    return response.data;
  },

  obtenerOrdenPedidos: async (filtros: FiltrosOrdenPedido): Promise<ResultadoPaginadoOrdenPedido> => {
    const response = await client.get<ResultadoPaginadoOrdenPedido>('/OrdenPedido', { params: filtros });
    return response.data;
  },

  obtenerOrdenPedidoPorNumero: async (numeroOrden: number): Promise<OrdenPedido> => {
    const response = await client.get<OrdenPedido>(`/OrdenPedido/${numeroOrden}`);
    return response.data;
  },
};