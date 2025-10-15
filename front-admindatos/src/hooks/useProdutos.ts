import { useState, useEffect } from 'react';
import { productosService } from '../services/produtoService';
import type { Producto, CreateProductoDto, UpdateProductoDto } from '../types/produto';

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productosService.getAllProductos();
      setProductos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener productos');
    } finally {
      setLoading(false);
    }
  };

  const createProducto = async (producto: CreateProductoDto) => {
    setLoading(true);
    setError(null);
    try {
      const newProducto = await productosService.createProducto(producto);
      setProductos([...productos, newProducto]);
      return newProducto;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al crear el producto';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateProducto = async (id: number, producto: UpdateProductoDto) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProducto = await productosService.updateProducto(id, producto);
      setProductos(productos.map(p => p.idProducto === id ? updatedProducto : p));
      return updatedProducto;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar el producto';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProducto = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await productosService.deleteProducto(id);
      setProductos(productos.filter(p => p.idProducto !== id));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al eliminar el producto';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return { productos, loading, error, fetchProductos, createProducto, updateProducto, deleteProducto };
};