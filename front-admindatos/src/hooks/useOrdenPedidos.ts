// hooks/useOrdenPedidos.ts
import { useState, useEffect } from 'react';
import { ordenPedidoService } from '../services/ordenPedidoService';
import type { 
  CreateOrdenPedidoDto,
  UpdateOrdenPedidoDto,
  InsertarOrdenPedidoResponse,
} from '../types/ordenPedido';

export const useOrdenPedidos = () => {

  const [ordenes, setOrdenes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordenPedidoService.obtenerOrdenPedidos();
      setOrdenes(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar órdenes de pedido');
      setOrdenes([]);
      console.error('Error fetching orden pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenPedidos();
  }, []);

  const insertarOrdenPedido = async (orden: CreateOrdenPedidoDto): Promise<InsertarOrdenPedidoResponse> => {
    try {
      setError(null);
      const response = await ordenPedidoService.insertarOrdenPedido(orden);
      return response;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al insertar orden de pedido';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const cambiarEstadoPago = async (updateDto: UpdateOrdenPedidoDto) => {
    try {
      setError(null);
      const mensajes = await ordenPedidoService.cambiarEstadoPago(updateDto);
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar estado de pago';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    ordenes,
    loading,
    error,
    insertarOrdenPedido,
    cambiarEstadoPago,
    fetchOrdenPedidos,
  };
};