import { useEffect, useState } from "react";
import type { ActualizarRolDto, AgregarRolDto, Rol } from "../types/rol";
import { rolesService } from "../services/rolService";

export const useRoles = () => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = async () => {
        try {
        setLoading(true);
        setError(null);
        const data = await rolesService.getAllRoles();
        setRoles(data);
        } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar roles');
        console.error('Error fetching roles:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const createRol = async (rol: AgregarRolDto) => {
        try {
        setError(null);
        await rolesService.createRol(rol);
        // Vuelve a traer todos los vendedores del backend
        await fetchRoles();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al crear rol';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    const updateRol = async (id: number, rol: ActualizarRolDto) => {
        try {
        setError(null);
        await rolesService.updateRol(id, rol);
        //  Refresca la lista con los datos actualizados
        await fetchRoles();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al actualizar rol';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    const desactivarRol = async (id: number) => {
        try {
        setError(null);
        await rolesService.desactivarRol(id);
        // 👇 También recarga después de eliminar
        await fetchRoles();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al desactivar rol';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    return {
        roles,
        loading,
        error,
        createRol,
        updateRol,
        desactivarRol,
        fetchRoles,
    };
};