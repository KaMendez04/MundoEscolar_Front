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
      throw err; // Lanzar el error original en lugar de crear uno nuevo
    }
  };

  const actualizarOrdenPedido = async (updateDto: UpdateOrdenPedidoDto) => {
    try {
      setError(null);
      const mensajes = await ordenPedidoService.actualizarOrdenPedido(updateDto);
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar estado de pago';
      setError(errorMsg);
      throw err; // Lanzar el error original en lugar de crear uno nuevo
    }
  };

  const actualizarMontoCancelado = async (idOrdenPedido: number, montoCancelado: number) => {
    try {
      setError(null);
      const mensajes = await ordenPedidoService.actualizarMontoCancelado(idOrdenPedido, montoCancelado);
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar monto cancelado';
      setError(errorMsg);
      throw err; // Lanzar el error original en lugar de crear uno nuevo
    }
  };

  const obtenerOrdenPedidoPorId = async (id: number) => {
    try {
      setError(null);
      const orden = await ordenPedidoService.obtenerOrdenPedidoPorId(id);
      return orden;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al obtener orden de pedido';
      setError(errorMsg);
      throw err;
    }
  };

  return {
    ordenes,
    loading,
    error,
    insertarOrdenPedido,
    actualizarOrdenPedido,
    fetchOrdenPedidos,
    obtenerOrdenPedidoPorId,
    actualizarMontoCancelado,
  };
};