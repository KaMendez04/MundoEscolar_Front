import { useState, useEffect } from "react";
import dataMartService from "../services/datamartService";
import type {
  TopProducto,
  TopServicio,
  VentasPorCliente,
  VentasPorVendedor,
  VentasPorCategoria,
  VentasPorPeriodo,
  ComparativoProductosServicios,
} from "../types/datamart";

// ========== PRODUCTOS ==========
export const useTopProductos = (top: number = 10) => {
  const [productos, setProductos] = useState<TopProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getTopProductos(top);
        setProductos(data);
      } catch (err: any) {
        console.error("Error al cargar productos:", err);
        setError(err?.response?.data?.error || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [top]);

  return { productos, loading, error };
};

// ========== SERVICIOS ==========
export const useTopServicios = (top: number = 10) => {
  const [servicios, setServicios] = useState<TopServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getTopServicios(top);
        setServicios(data);
      } catch (err: any) {
        console.error("Error al cargar servicios:", err);
        setError(err?.response?.data?.error || "Error al cargar servicios");
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, [top]);

  return { servicios, loading, error };
};

// ========== CLIENTES ==========
export const useTopClientes = (top: number = 10) => {
  const [clientes, setClientes] = useState<VentasPorCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getTopClientes(top);
        setClientes(data);
      } catch (err: any) {
        console.error("Error al cargar clientes:", err);
        setError(err?.response?.data?.error || "Error al cargar clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [top]);

  return { clientes, loading, error };
};

// ========== VENDEDORES ==========
export const useVendedores = () => {
  const [vendedores, setVendedores] = useState<VentasPorVendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getVendedores();
        setVendedores(data);
      } catch (err: any) {
        console.error("Error al cargar vendedores:", err);
        setError(err?.response?.data?.error || "Error al cargar vendedores");
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, []);

  return { vendedores, loading, error };
};

// ========== CATEGORÍAS ==========
export const useCategorias = () => {
  const [categorias, setCategorias] = useState<VentasPorCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getVentasPorCategoria();
        setCategorias(data);
      } catch (err: any) {
        console.error("Error al cargar categorías:", err);
        setError(err?.response?.data?.error || "Error al cargar categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};

// ========== VENTAS POR PERÍODO ==========
export const useVentasPorPeriodo = (anio?: number) => {
  const [ventas, setVentas] = useState<VentasPorPeriodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dataMartService.getVentasPorPeriodo(anio);
        setVentas(data);
      } catch (err: any) {
        console.error("Error al cargar ventas por período:", err);
        setError(
          err?.response?.data?.error || "Error al cargar ventas por período"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [anio]);

  return { ventas, loading, error };
};

// ========== COMPARATIVO PRODUCTOS VS SERVICIOS ==========
export const useComparativoProductosServicios = (anio?: number) => {
  const [comparativo, setComparativo] = useState<
    ComparativoProductosServicios[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparativo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data =
          await dataMartService.getComparativoProductosServicios(anio);
        setComparativo(data);
      } catch (err: any) {
        console.error("Error al cargar comparativo:", err);
        setError(err?.response?.data?.error || "Error al cargar comparativo");
      } finally {
        setLoading(false);
      }
    };

    fetchComparativo();
  }, [anio]);

  return { comparativo, loading, error };
};