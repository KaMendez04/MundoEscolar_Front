import client from '../Client/ConfigClient';
import type { Producto, CreateProductoDto, UpdateProductoDto } from '../types/produto';

export const productosService = {
  getAllProductos: async (): Promise<Producto[]> => {
    const response = await client.get<Producto[]>('/Producto');
    return response.data;
  },

  getProductoById: async (id: number): Promise<Producto> => {
    const response = await client.get<Producto>(`/Producto/${id}`);
    return response.data;
  },

  createProducto: async (producto: CreateProductoDto): Promise<Producto> => {
    const response = await client.post<Producto>('/Producto', producto);
    return response.data;
  },

  updateProducto: async (id: number, producto: UpdateProductoDto): Promise<Producto> => {
    const response = await client.put<Producto>(`/Producto/${id}`, producto);
    return response.data;
  },

  deleteProducto: async (id: number): Promise<void> => {
    await client.delete(`/Producto/${id}`);
  },
};