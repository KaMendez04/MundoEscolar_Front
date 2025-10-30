import client from "../Client/ConfigClient";
import type { ActualizarRolDto, AgregarRolDto, Rol } from "../types/rol";

const BASE = "/Roles";

export const rolesService = {
    getAllRoles: async (): Promise<Rol[]> => {
        const response = await client.get<Rol[]>(`${BASE}/activos`);
        return response.data;
    },

    createRol: async (rol: AgregarRolDto): Promise<Rol> => {
    const response = await client.post<Rol>(BASE, rol);
    return response.data;
    },

    getRolById: async (id: number): Promise<Rol> => {
        const response = await client.get<Rol>(`${BASE}/${id}`);
        return response.data;
    },

    updateRol: async (id: number, rol: ActualizarRolDto): Promise<Rol> => {
        const response = await client.put<Rol>(`${BASE}/${id}`, rol);
        return response.data;
    },

    desactivarRol: async (id: number): Promise<Rol> => {
        const response = await client.put<Rol>(`${BASE}/desactivar/${id}`);
        return response.data;
    },
};