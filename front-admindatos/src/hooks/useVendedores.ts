import { useEffect, useState } from "react";
import { vendedoresService } from "../services/vendedorService";
import type { ActualizarVendedorRequest, AgregarVendedorDto, VendedorListResult } from "../types/vendedor";

export const useVendedores = () => {
    const [vendedores, setVendedores] = useState<VendedorListResult>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVendedores = async () => {
        try {
        setLoading(true);
        setError(null);
        const data = await vendedoresService.getAllVendedores();
        setVendedores(data);
        } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar vendedores');
        console.error('Error fetching vendedores:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendedores();
    }, []);

    const createVendedor = async (vendedor: AgregarVendedorDto) => {
        try {
        setError(null);
        await vendedoresService.createVendedor(vendedor);
        // Vuelve a traer todos los vendedores del backend
        await fetchVendedores();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al crear vendedor';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    const updateVendedor = async (id: number, vendedor: ActualizarVendedorRequest) => {
        try {
        setError(null);
        await vendedoresService.updateVendedor(id, vendedor);
        //  Refresca la lista con los datos actualizados
        await fetchVendedores();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al actualizar vendedor';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    const desactivarVendedor = async (id: number) => {
        try {
        setError(null);
        await vendedoresService.desactivarVendedor(id);
        // 👇 También recarga después de eliminar
        await fetchVendedores();
        } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Error al desactivar vendedor';
        setError(errorMsg);
        throw new Error(errorMsg);
        }
    };

    return {
        vendedores,
        loading,
        error,
        createVendedor,
        updateVendedor,
        desactivarVendedor,
        fetchVendedores,
    };
};