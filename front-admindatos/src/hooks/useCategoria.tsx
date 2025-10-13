import { useState, useEffect } from 'react';
import { categoriasService } from '../services/categoriaService';
import type { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '../types/categoria';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriasService.getAllCategorias();
      setCategorias(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Error al obtener categorías';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createCategoria = async (categoria: CreateCategoriaDto) => {
    setLoading(true);
    setError(null);
    try {
      const newCategoria = await categoriasService.createCategoria(categoria);
      setCategorias([...categorias, newCategoria]);
      return newCategoria;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Error al crear la categoría';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateCategoria = async (id: number, categoria: UpdateCategoriaDto) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategoria = await categoriasService.updateCategoria(id, categoria);
      setCategorias(categorias.map(c => c.idCategoria === id ? updatedCategoria : c));
      return updatedCategoria;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Error al actualizar la categoría';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategoria = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await categoriasService.deleteCategoria(id);
      setCategorias(categorias.filter(c => c.idCategoria !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Error al eliminar la categoría';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return { categorias, loading, error, fetchCategorias, createCategoria, updateCategoria, deleteCategoria };
};