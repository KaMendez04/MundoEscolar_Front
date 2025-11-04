import { useEffect, useState } from "react";
import { vendedor_rolService } from "../services/vendedor_rolService";
import type { Vendedor_RolDto, VendedorRolResult } from "../types/vendedor_rol";
import { useVendedores } from "./useVendedores";

export const useVendedor_Rol = () => {
    const { fetchVendedores } = useVendedores()
    const [vendedor_rol, setVendedorRoles] = useState<VendedorRolResult[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = async () => {
        try {
        setLoading(true);
        setError(null);
        const data = await vendedor_rolService.getAllVendedorRol();
        setVendedorRoles(data);
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

    const createVendedor_Rol = async (vendedor_rol: Vendedor_RolDto) => {
        try {
        setError(null);
        await vendedor_rolService.createVendedor_Rol(vendedor_rol);
        // Vuelve a traer todos los vendedores del backend
        await fetchRoles();
        await fetchVendedores();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al crear vendedor_rol';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    const deleteVendedor_Rol = async (vendedor_rol: Vendedor_RolDto) => {
        try {
        setError(null);
        await vendedor_rolService.deleteVendedor_Rol(vendedor_rol);
        // 👇 También recarga después de eliminar
        await fetchRoles();
        await fetchVendedores();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al eliminar vendedor_rol';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    return {
        vendedor_rol,
        loading,
        error,
        createVendedor_Rol,
        deleteVendedor_Rol,
        fetchRoles,
    };
};