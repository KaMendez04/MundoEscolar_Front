// hooks/useProveedores.ts
import { useState, useEffect } from 'react';
import { proveedorService } from '../services/proveedorService';
import type { 
  CreateProveedorDto, 
  UpdateProveedorDto, 
  FiltrosProveedor, 
  ResultadoPaginadoProveedor 
} from '../types/proveedor';

export const useProveedores = (filtrosIniciales?: FiltrosProveedor) => {
  const [resultado, setResultado] = useState<ResultadoPaginadoProveedor>({
    proveedores: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProveedor>(
    filtrosIniciales || { page: 1, pageSize: 10 }
  );

  const fetchProveedores = async (nuevosFiltros?: FiltrosProveedor) => {
    try {
      setLoading(true);
      setError(null);
      const filtrosAUsar = nuevosFiltros || filtros;
      const data = await proveedorService.obtenerProveedores(filtrosAUsar);
      setResultado(data);
      if (nuevosFiltros) {
        setFiltros(filtrosAUsar);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar proveedores');
      console.error('Error fetching proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const insertarProveedor = async (proveedor: CreateProveedorDto) => {
    try {
      setError(null);
      const mensajes = await proveedorService.insertarProveedor(proveedor);
      await fetchProveedores();
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al insertar proveedor';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const actualizarProveedor = async (proveedor: UpdateProveedorDto) => {
    try {
      setError(null);
      const mensajes = await proveedorService.actualizarProveedor(proveedor);
      await fetchProveedores();
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar proveedor';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const desactivarProveedor = async (cedulaJuridica: string) => {
    try {
      setError(null);
      const mensajes = await proveedorService.desactivarProveedor(cedulaJuridica);
      await fetchProveedores();
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al desactivar proveedor';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const activarProveedor = async (cedulaJuridica: string) => {
    try {
      setError(null);
      const mensajes = await proveedorService.activarProveedor(cedulaJuridica);
      await fetchProveedores();
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al activar proveedor';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    proveedores: resultado.proveedores,
    total: resultado.total,
    page: resultado.page,
    pageSize: resultado.pageSize,
    totalPages: resultado.totalPages,
    loading,
    error,
    filtros,
    insertarProveedor,
    actualizarProveedor,
    desactivarProveedor,
    activarProveedor,
    fetchProveedores,
    setFiltros,
  };
};
