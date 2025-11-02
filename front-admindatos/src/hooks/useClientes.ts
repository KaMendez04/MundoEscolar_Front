// hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';
import type { Cliente, CreateClienteDto, UpdateClienteDto } from '../types/cliente';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Obtener todos los clientes
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getAllClientes();
      setClientes(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al cargar los clientes';
      setError(errorMsg);
      console.error('Error fetching clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente por cédula
  const fetchClienteByCedula = async (cedula: number): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getClienteByCedula(cedula);
      setSelectedCliente(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Cliente no encontrado';
      setError(errorMsg);
      console.error('Error fetching cliente by cedula:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo cliente
  const createCliente = async (clienteData: CreateClienteDto): Promise<Cliente | null> => {
    setLoading(true);
    setError(null);
    try {
      const nuevoCliente = await clienteService.createCliente(clienteData);
      // Actualizar la lista local
      setClientes([...clientes, nuevoCliente]);
      setSelectedCliente(nuevoCliente);
      return nuevoCliente;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al crear cliente';
      setError(errorMsg);
      console.error('Error creating cliente:', err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cliente existente
  const updateCliente = async (clienteData: UpdateClienteDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clienteService.updateCliente(clienteData);
      // Refrescar la lista completa
      await fetchClientes();
      // Actualizar cliente seleccionado si es el mismo
      if (selectedCliente && clienteData.idCliente === selectedCliente.idCliente) {
        setSelectedCliente({ ...selectedCliente, ...clienteData });
      }
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar cliente';
      setError(errorMsg);
      console.error('Error updating cliente:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar cliente seleccionado
  const clearSelectedCliente = () => {
    setSelectedCliente(null);
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    selectedCliente,
    loading,
    error,
    fetchClientes,
    fetchClienteByCedula,
    createCliente,
    updateCliente,
    clearSelectedCliente,
    setError,
  };
};