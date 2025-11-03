// services/dataMartService.ts

import client from "../Client/ConfigClient";
import type {
  DashboardMetricas,
  VentasPorPeriodo,
  TopProducto,
  TopServicio,
  VentasPorCliente,
  VentasPorVendedor,
  VentasPorCategoria,
  ComparativoProductosServicios,
  ResumenFactura,
} from "../types/datamart";

class DataMartService {
  private baseURL = "/DataMart";

  // ========== DASHBOARD ==========
  async getDashboard(anio?: number, mes?: number): Promise<DashboardMetricas> {
    const params = new URLSearchParams();
    if (anio) params.append("anio", anio.toString());
    if (mes) params.append("mes", mes.toString());

    const url = `${this.baseURL}/dashboard${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await client.get<DashboardMetricas>(url);
    return response.data;
  }

  // ========== VENTAS POR PERÍODO ==========
  async getVentasPorPeriodo(anio?: number): Promise<VentasPorPeriodo[]> {
    const params = anio ? `?anio=${anio}` : "";
    const response = await client.get<VentasPorPeriodo[]>(
      `${this.baseURL}/ventas/periodo${params}`
    );
    return response.data;
  }

  async getVentasPorMes(anio: number, mes: number): Promise<VentasPorPeriodo[]> {
    const response = await client.get<VentasPorPeriodo[]>(
      `${this.baseURL}/ventas/periodo/${anio}/${mes}`
    );
    return response.data;
  }

  // ========== PRODUCTOS ==========
  async getTopProductos(top: number = 10): Promise<TopProducto[]> {
    const response = await client.get<TopProducto[]>(
      `${this.baseURL}/productos/top?top=${top}`
    );
    return response.data;
  }

  async getDetalleProducto(productoKey: number): Promise<TopProducto> {
    const response = await client.get<TopProducto>(
      `${this.baseURL}/productos/${productoKey}`
    );
    return response.data;
  }

  // ========== SERVICIOS ==========
  async getTopServicios(top: number = 10): Promise<TopServicio[]> {
    const response = await client.get<TopServicio[]>(
      `${this.baseURL}/servicios/top?top=${top}`
    );
    return response.data;
  }

  async getDetalleServicio(servicioKey: number): Promise<TopServicio> {
    const response = await client.get<TopServicio>(
      `${this.baseURL}/servicios/${servicioKey}`
    );
    return response.data;
  }

  // ========== CLIENTES ==========
  async getTopClientes(top: number = 10): Promise<VentasPorCliente[]> {
    const response = await client.get<VentasPorCliente[]>(
      `${this.baseURL}/clientes/top?top=${top}`
    );
    return response.data;
  }

  async getDetalleCliente(clienteKey: number): Promise<VentasPorCliente> {
    const response = await client.get<VentasPorCliente>(
      `${this.baseURL}/clientes/${clienteKey}`
    );
    return response.data;
  }

  // ========== VENDEDORES ==========
  async getVendedores(): Promise<VentasPorVendedor[]> {
    const response = await client.get<VentasPorVendedor[]>(
      `${this.baseURL}/vendedores`
    );
    return response.data;
  }

  async getDetalleVendedor(vendedorKey: number): Promise<VentasPorVendedor> {
    const response = await client.get<VentasPorVendedor>(
      `${this.baseURL}/vendedores/${vendedorKey}`
    );
    return response.data;
  }

  // ========== CATEGORÍAS ==========
  async getVentasPorCategoria(): Promise<VentasPorCategoria[]> {
    const response = await client.get<VentasPorCategoria[]>(
      `${this.baseURL}/categorias`
    );
    return response.data;
  }

  // ========== FACTURAS ==========
  async getFacturas(soloPendientes?: boolean): Promise<ResumenFactura[]> {
    const params =
      soloPendientes !== undefined
        ? `?soloPendientes=${soloPendientes}`
        : "";
    const response = await client.get<ResumenFactura[]>(
      `${this.baseURL}/facturas${params}`
    );
    return response.data;
  }

  async getDetalleFactura(facturaKey: number): Promise<ResumenFactura> {
    const response = await client.get<ResumenFactura>(
      `${this.baseURL}/facturas/${facturaKey}`
    );
    return response.data;
  }

  // ========== COMPARATIVOS ==========
  async getComparativoProductosServicios(
    anio?: number
  ): Promise<ComparativoProductosServicios[]> {
    const params = anio ? `?anio=${anio}` : "";
    const response = await client.get<ComparativoProductosServicios[]>(
      `${this.baseURL}/comparativo/productos-servicios${params}`
    );
    return response.data;
  }
}

export default new DataMartService();