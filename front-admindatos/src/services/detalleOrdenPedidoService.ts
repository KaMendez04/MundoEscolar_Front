import client from '../Client/ConfigClient';
import type { 
  DetalleOrdenPedido, 
  CreateDetalleOrdenPedidoDto, 
  UpdateDetalleOrdenPedidoDto 
} from '../types/detalleOrdenPedido';

export const detalleOrdenPedidoService = {

  getDetalleById: async (id: number): Promise<DetalleOrdenPedido> => {
    const response = await client.get<DetalleOrdenPedido>(`/DetalleOrdenPedido/${id}`);
    return response.data;
  },

  createDetalle: async (detalle: CreateDetalleOrdenPedidoDto): Promise<DetalleOrdenPedido> => {
    const response = await client.post<DetalleOrdenPedido>('/DetalleOrdenPedido', detalle);
    return response.data;
  },

  updateDetalle: async (id: number, detalle: UpdateDetalleOrdenPedidoDto): Promise<DetalleOrdenPedido> => {
    const response = await client.put<DetalleOrdenPedido>(`/DetalleOrdenPedido/${id}`, detalle);
    return response.data;
  },
};