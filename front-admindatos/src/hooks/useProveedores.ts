// hooks/useProveedores.ts
import { useState, useEffect } from 'react';
import { proveedorService,condicionsPagoProveedorService } from '../services/proveedorService';
import type { 
  CreateProveedorDto, 
  UpdateProveedorDto,
  CondicionPagoProveedor
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


export const useCondicionesPagoProveedor = () =>{
  const [condicionesPago, setCondicionesPago] = useState<CondicionPagoProveedor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCondicionesPago = async (idProveedor: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await condicionsPagoProveedorService.obtenerCondicionesPago(idProveedor);
      setCondicionesPago(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar condiciones de pago');
      setCondicionesPago(null);
      console.error('Error fetching condiciones de pago:', err);
    } finally {
      setLoading(false);
    }
  };

  const insertarCondicionesPago = async (idProveedor: number, acepta: boolean, condiciones?: string[]) => {
    try {
      setError(null);
      const mensajes = await condicionsPagoProveedorService.crearActualizarCondicionesPago(idProveedor, acepta, condiciones);
      await fetchCondicionesPago(idProveedor);
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al insertar condiciones de pago';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return {
    condicionesPago,
    loading,
    error,
    fetchCondicionesPago,
    insertarCondicionesPago,
  };
};