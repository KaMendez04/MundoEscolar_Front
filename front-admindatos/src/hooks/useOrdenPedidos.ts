// hooks/useOrdenPedidos.ts
import { useState, useEffect } from 'react';
import { ordenPedidoService } from '../services/ordenPedidoService';
import type { 
  CreateOrdenPedidoDto, 
  UpdateEstadoOrdenPedidoDto, 
  FiltrosOrdenPedido, 
  ResultadoPaginadoOrdenPedido 
} from '../types/ordenPedido';

export const useOrdenPedidos = (filtrosIniciales?: FiltrosOrdenPedido) => {
  const [resultado, setResultado] = useState<ResultadoPaginadoOrdenPedido>({
    ordenes: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosOrdenPedido>(
    filtrosIniciales || { page: 1, pageSize: 10 }
  );

  const fetchOrdenPedidos = async (nuevosFiltros?: FiltrosOrdenPedido) => {
    try {
      setLoading(true);
      setError(null);
      const filtrosAUsar = nuevosFiltros || filtros;
      const data = await ordenPedidoService.obtenerOrdenPedidos(filtrosAUsar);
      setResultado(data);
      if (nuevosFiltros) {
        setFiltros(filtrosAUsar);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar órdenes de pedido');
      console.error('Error fetching orden pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenPedidos();
  }, []);

  const insertarOrdenPedido = async (orden: CreateOrdenPedidoDto) => {
    try {
      setError(null);
      const mensajes = await ordenPedidoService.insertarOrdenPedido(orden);
      await fetchOrdenPedidos();
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al insertar orden de pedido';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const cambiarEstadoPago = async (estado: UpdateEstadoOrdenPedidoDto) => {
    try {
      setError(null);
      const mensajes = await ordenPedidoService.cambiarEstadoPago(estado);
      await fetchOrdenPedidos();
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar estado de pago';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    ordenes: resultado.ordenes,
    total: resultado.total,
    page: resultado.page,
    pageSize: resultado.pageSize,
    totalPages: resultado.totalPages,
    loading,
    error,
    filtros,
    insertarOrdenPedido,
    cambiarEstadoPago,
    fetchOrdenPedidos,
    setFiltros,
  };
};