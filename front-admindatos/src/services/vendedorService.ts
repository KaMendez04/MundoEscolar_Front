import client from "../Client/ConfigClient";
import type { ActualizarVendedorRequest, AgregarVendedorDto, VendedorDto, VendedorListResult } from "../types/vendedor";

const BASE = "/Vendedores";

export const vendedoresService = {
    getAllVendedores: async (): Promise<VendedorListResult> => {
        const response = await client.get<VendedorListResult>(`${BASE}`);
        return response.data;
    },

    createVendedor: async (vendedor: AgregarVendedorDto): Promise<VendedorDto> => {
    const response = await client.post<VendedorDto>(`${BASE}`, vendedor);
    return response.data;
    },

    getMe: async (): Promise<VendedorDto> => {
        const response = await client.get<VendedorDto>(`${BASE}/me`);
        return response.data;
    },

    getVendedorById: async (id: number): Promise<VendedorDto> => {
        const response = await client.get<VendedorDto>(`${BASE}/${id}`);
        return response.data;
    },

    updateVendedor: async (id: number, vendedor: ActualizarVendedorRequest): Promise<VendedorDto> => {
        const response = await client.put<VendedorDto>(`${BASE}/${id}`, vendedor);
        return response.data;
    },

    desactivarVendedor: async (id: number): Promise<VendedorDto> => {
        const response = await client.put<VendedorDto>(`${BASE}/desactivar/${id}`);
        return response.data;
    },
};