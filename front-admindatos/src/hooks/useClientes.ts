// hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';
import type { Cliente, UpdateClienteDto } from '../types/cliente';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAllClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClienteByCedula = async (cedula: number) => {
    try {
      const data = await clienteService.getClienteByCedula(cedula);
      setSelectedCliente(data);
      setError(null);
    } catch (err) {
      setError('Error al buscar el cliente');
      console.error(err);
    }
  };

  const updateCliente = async (clienteData: UpdateClienteDto) => {
    try {
      await clienteService.updateCliente(clienteData);
      await fetchClientes(); // Refresh the list
      if (selectedCliente && clienteData.cedula === selectedCliente.cedula) {
        setSelectedCliente({ ...selectedCliente, ...clienteData });
      }
      setError(null);
    } catch (err) {
      setError('Error al actualizar el cliente');
      console.error(err);
    }
  };

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
    updateCliente,
  };
};