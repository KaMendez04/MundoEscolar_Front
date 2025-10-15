import client from '../Client/ConfigClient';
import type { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '../types/categoria';

export const categoriasService = {
  getAllCategorias: async (): Promise<Categoria[]> => {
    const response = await client.get<Categoria[]>('/Categoria');
    return response.data;
  },

  getCategoriaById: async (id: number): Promise<Categoria> => {
    const response = await client.get<Categoria>(`/Categoria/${id}`);
    return response.data as Categoria;
  },

  createCategoria: async (categoria: CreateCategoriaDto): Promise<Categoria> => {
    const response = await client.post<Categoria>('/Categoria', categoria);
    return response.data;
  },

  updateCategoria: async (id: number, categoria: UpdateCategoriaDto): Promise<Categoria> => {
    const response = await client.put<Categoria>(`/Categoria/${id}`, categoria);
    return response.data;
  },

  deleteCategoria: async (id: number): Promise<void> => {
    await client.delete(`/Categoria/${id}`);
  },
};