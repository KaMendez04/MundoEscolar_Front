import type { Vendedor_RolDto, VendedorRolResult } from "../types/vendedor_rol";
import client from "../Client/ConfigClient";

const BASE = "/Vendedor_Rol";

export const vendedor_rolService = {
    getAllVendedorRol: async (): Promise<VendedorRolResult[]> => {
        const response = await client.get<VendedorRolResult[]>(BASE);
        return response.data;
    },

    createVendedor_Rol: async (vendedor_rol: Vendedor_RolDto): Promise<Vendedor_RolDto> => {
    const response = await client.post<Vendedor_RolDto>(BASE, vendedor_rol);
    return response.data;
    },

    deleteVendedor_Rol: async (vendedor_rol: Vendedor_RolDto): Promise<boolean> => {
        try {
            // Enviar los datos correctamente en el cuerpo de la solicitud DELETE
            const response = await client({
                method: 'delete',  // Método DELETE
                url: BASE,  // Ruta de la API
                headers: {
                    'Content-Type': 'application/json'  // Asegúrate de enviar este encabezado
                },
                data: vendedor_rol  // Los datos en el cuerpo de la solicitud
            });
            return response.status === 200;  // Retorna true si la eliminación fue exitosa
        } catch (err: any) {
            // Manejo de errores si algo va mal
            throw new Error(err.response?.data?.message || 'Error al eliminar vendedor_rol');
        }
    },
    
};