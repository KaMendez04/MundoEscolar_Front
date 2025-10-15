// types/cliente.ts
export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  tipoCliente: string;
  cedula: number;
  contacto: string;
  correoElectronico: string;
  condicionesPago: boolean;
}

export type UpdateClienteDto = Omit<Cliente, 'idCliente'>;