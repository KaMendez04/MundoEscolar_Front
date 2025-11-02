// services/clienteService.ts
import type { Cliente, CreateClienteDto, UpdateClienteDto } from '../types/cliente';
import client from '../Client/ConfigClient';

export const clienteService = {
  // Obtener todos los clientes
  getAllClientes: async (): Promise<Cliente[]> => {
    const response = await client.get<Cliente[]>('/Clientes');
    return response.data;
  },

  // Obtener cliente por cédula
  getClienteByCedula: async (cedula: number): Promise<Cliente> => {
    const response = await client.get<Cliente>(`/Clientes/${cedula}`);
    return response.data;
  },

  // Crear nuevo cliente
  createCliente: async (nuevoCliente: CreateClienteDto): Promise<Cliente> => {
    const response = await client.post<Cliente>('/Clientes', nuevoCliente);
    return response.data;
  },

  // Actualizar cliente
  updateCliente: async (cliente: UpdateClienteDto): Promise<void> => {
    await client.put('/Clientes', cliente);
  },
};