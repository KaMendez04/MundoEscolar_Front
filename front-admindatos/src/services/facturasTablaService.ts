// src/services/facturasTablaService.ts
import client from "../Client/ConfigClient";
import type { Factura } from "../types/facturasTabla";

// 🔹 Respuesta paginada del backend
export interface FacturaPaginadaResponse {
  facturas: Factura[];
  totalRegistros: number;
  paginaActual: number;
  totalPaginas: number;
}

// 🔹 DTO para actualizar factura
export interface FacturaUpdateDto {
  idFactura: number;
  idCliente?: number;
  idVendedor?: number;
  montoCancelado: number;
  estadoPago: boolean;
}

export const facturasService = {
  // ✅ Obtener facturas paginadas (ahora con filtro opcional)
  getFacturasPaginadas: async (
    pagina = 1,
    tamanoPagina = 10,
    estadoPago?: boolean
  ): Promise<FacturaPaginadaResponse> => {
    let url = `/Facturas?pagina=${pagina}&tamanoPagina=${tamanoPagina}`;
    if (estadoPago !== undefined) {
      url += `&estadoPago=${estadoPago}`;
    }

    const response = await client.get<FacturaPaginadaResponse>(url);
    return response.data;
  },

  getFacturaById: async (id: number): Promise<Factura> => {
    const response = await client.get<Factura>(`/Facturas/${id}`);
    return response.data;
  },

  updateFactura: async (dto: FacturaUpdateDto): Promise<{ mensaje: string }> => {
    const response = await client.put<{ mensaje: string }>("/Facturas", dto);
    return response.data;
  },

  updateMontoCancelado: async (
    idFactura: number,
    montoCancelado: number
  ): Promise<{ mensaje: string }> => {
    const response = await client.put<{ mensaje: string }>(
      `/Facturas/monto-cancelado?idFactura=${idFactura}&montoCancelado=${montoCancelado}`
    );
    return response.data;
  },

  crearFactura: async (): Promise<Factura> => {
    const response = await client.post<Factura>("/Facturas/crear");
    return response.data;
  },
};
