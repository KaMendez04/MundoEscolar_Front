// hooks/useProveedores.ts
import { useState, useEffect } from 'react';
import { proveedorService,condicionsPagoProveedorService } from '../services/proveedorService';
import type { 
  CreateProveedorDto, 
  UpdateProveedorDto,
  CondicionPagoProveedor,
  VistaProveedor,
} from '../types/proveedor';


export const useProveedores = () => {

  const [proveedores, setProveedores] = useState<VistaProveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchProveedores = async (params?: {
    pageNumber?: number;
    pageSize?: number;
    nombre?: string;
    cedulaJuridica?: string;
    telefono?: string;
    estado?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await proveedorService.obtenerProveedores(params);
      setProveedores(response.data);
      setPageNumber(response.pageNumber);
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar proveedores');
      setProveedores([]);
      console.error('Error fetching proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores({ pageNumber: 1, pageSize });
  }, []);

  const insertarProveedor = async (proveedor: CreateProveedorDto) => {
    try {
      setError(null);
      const mensajes = await proveedorService.insertarProveedor(proveedor);
      await fetchProveedores({ pageNumber: 1, pageSize });
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al insertar proveedor';
      setError(errorMsg);
      throw err; // Lanzar el error original
    }
  };

  const actualizarProveedor = async (proveedor: UpdateProveedorDto) => {
    try {
      setError(null);
      const mensajes = await proveedorService.actualizarProveedor(proveedor);
      await fetchProveedores({ pageNumber, pageSize });
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar proveedor';
      setError(errorMsg);
      throw err; // Lanzar el error original
    }
  };

  const desactivarProveedor = async (cedulaJuridica: string) => {
    try {
      setError(null);
      const mensajes = await proveedorService.desactivarProveedor(cedulaJuridica);
      await fetchProveedores({ pageNumber, pageSize });
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al desactivar proveedor';
      setError(errorMsg);
      throw err; // Lanzar el error original
    }
  };

  const activarProveedor = async (cedulaJuridica: string) => {
    try {
      setError(null);
      const mensajes = await proveedorService.activarProveedor(cedulaJuridica);
      await fetchProveedores({ pageNumber, pageSize });
      return mensajes;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al activar proveedor';
      setError(errorMsg);
      throw err; // Lanzar el error original
    }
  };

  return {
    proveedores,
    loading,
    error,
    pageNumber,
    pageSize,
    totalPages,
    totalRecords,
    insertarProveedor,
    actualizarProveedor,
    desactivarProveedor,
    activarProveedor,
    fetchProveedores,
    setPageNumber,
    setPageSize,
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
      throw err; // Lanzar el error original
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