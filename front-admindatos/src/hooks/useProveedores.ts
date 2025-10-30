// hooks/useProveedores.ts
import { useState, useEffect } from 'react';
import { proveedorService } from '../services/proveedorService';
import type { 
  CreateProveedorDto, 
  UpdateProveedorDto
} from '../types/proveedor';

export const useProveedores = () => {

  const [proveedores, setProveedores] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await proveedorService.obtenerProveedores();
      setProveedores(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar proveedores');
      setProveedores(null);
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
    proveedores,
    loading,
    error,
    insertarProveedor,
    actualizarProveedor,
    desactivarProveedor,
    activarProveedor,
    fetchProveedores,
  };
};
