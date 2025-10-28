import client from "../Client/ConfigClient";
import type { ActualizarVendedorRequest, AgregarVendedorDto, VendedorDto, VendedorListResult } from "../types/vendedor";

export const vendedoresService = {
    getAllVendedores: async (): Promise<VendedorListResult> => {
        const response = await client.get<VendedorListResult>('/Vendedores');
        return response.data;
    },

    createVendedor: async (vendedor: AgregarVendedorDto): Promise<VendedorDto> => {
    const response = await client.post<VendedorDto>('/Vendedores', vendedor);
    return response.data;
    },

    getVendedorById: async (id: number): Promise<VendedorDto> => {
        const response = await client.get<VendedorDto>(`/Vendedores/${id}`);
        return response.data;
    },

    updateVendedor: async (id: number, vendedor: ActualizarVendedorRequest): Promise<VendedorDto> => {
        const response = await client.put<VendedorDto>(`/Vendedores/${id}`, vendedor);
        return response.data;
    },

    desactivarVendedor: async (id: number): Promise<VendedorDto> => {
        const response = await client.put<VendedorDto>(`/Vendedores/desactivar/${id}`);
        return response.data;
    },
};