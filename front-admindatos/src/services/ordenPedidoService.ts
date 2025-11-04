import client from '../Client/ConfigClient';
import type { 
  OrdenPedido,
  CreateOrdenPedidoDto,
  UpdateOrdenPedidoDto,
  VistaOrdenPedido,
  InsertarOrdenPedidoResponse,
  PaginatedResponse,
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
  
  obtenerOrdenPedidos: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    numeroOrden?: number;
    fechaInicio?: string;
    fechaFin?: string;
    estadoPago?: string;
    idProveedor?: number;
    montoMinimo?: number;
    montoMaximo?: number;
  }): Promise<PaginatedResponse<VistaOrdenPedido>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.numeroOrden) queryParams.append('numeroOrden', params.numeroOrden.toString());
    if (params?.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
    if (params?.fechaFin) queryParams.append('fechaFin', params.fechaFin);
    if (params?.estadoPago) queryParams.append('estadoPago', params.estadoPago);
    if (params?.idProveedor) queryParams.append('idProveedor', params.idProveedor.toString());
    if (params?.montoMinimo !== undefined) queryParams.append('montoMinimo', params.montoMinimo.toString());
    if (params?.montoMaximo !== undefined) queryParams.append('montoMaximo', params.montoMaximo.toString());
    
    const url = `/OrdenPedido${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await client.get<PaginatedResponse<VistaOrdenPedido>>(url);
    return response.data;
  },

  obtenerOrdenPedidoPorId: async (idOrdenPedido: number): Promise<OrdenPedido> => {
    const response = await client.get<OrdenPedido>(`/OrdenPedido/ById/${idOrdenPedido}`);
    return response.data;
  },
};