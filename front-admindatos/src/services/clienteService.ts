// services/clienteService.ts
import type { Cliente, UpdateClienteDto } from '../types/cliente';
import client from '../Client/ConfigClient'; // Assuming you have an axios client configured

export const clienteService = {
  getAllClientes: async (): Promise<Cliente[]> => {
    const response = await client.get<Cliente[]>('api/Clientes');
    return response.data;
  },

  getClienteByCedula: async (cedula: number): Promise<Cliente> => {
    const response = await client.get<Cliente>(`api/Clientes/${cedula}`);
    return response.data;
  },

  updateCliente: async (cliente: UpdateClienteDto): Promise<void> => {
    await client.put(`api/Clientes`, cliente);
  },
};