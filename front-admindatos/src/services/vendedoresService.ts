import client from "../Client/ConfigClient";

export interface VendedorMe {
  idVendedor: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo: string;
  clave: string;
  estado: boolean;
}

export const vendedoresService = {
  // ✅ Obtener los datos del vendedor logueado
  getMiVendedor: async (): Promise<VendedorMe> => {
    const response = await client.get<VendedorMe>("/Vendedores/me");
    return response.data;
  },
};
