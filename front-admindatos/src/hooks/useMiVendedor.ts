import { useEffect, useState } from "react";
import { vendedoresService, type VendedorMe } from "../services/vendedoresService";

export function useMiVendedor() {
  const [vendedor, setVendedor] = useState<VendedorMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendedor = async () => {
      try {
        const data = await vendedoresService.getMiVendedor();
        setVendedor(data);
        setError(null);
      } catch (err: any) {
        console.error("❌ Error al obtener vendedor logueado:", err);
        setError("No se pudo cargar el vendedor (token inválido o sesión expirada)");
        setVendedor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedor();
  }, []);

  return { vendedor, loading, error };
}