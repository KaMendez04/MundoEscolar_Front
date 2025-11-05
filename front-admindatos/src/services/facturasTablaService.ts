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

  // 🆕 Obtener TODAS las facturas con filtro (sin paginación)
  getTodasLasFacturas: async (
    estadoPago: boolean
  ): Promise<Factura[]> => {
    // Primero obtenemos la primera página para saber cuántas páginas hay
    const primera = await facturasService.getFacturasPaginadas(1, 10, estadoPago);
    const totalPaginas = primera.totalPaginas;
    
    // Si solo hay una página, retornamos eso
    if (totalPaginas === 1) {
      return primera.facturas;
    }
    
    // Si hay más páginas, las cargamos todas
    const promesas = [];
    for (let i = 2; i <= totalPaginas; i++) {
      promesas.push(facturasService.getFacturasPaginadas(i, 10, estadoPago));
    }
    
    const resultados = await Promise.all(promesas);
    const todasLasFacturas = [
      ...primera.facturas,
      ...resultados.flatMap(r => r.facturas)
    ];
    
    return todasLasFacturas;
  },
  
  getFacturaById: async (id: number): Promise<Factura> => {
    const response = await client.get<Factura>(`/Facturas/${id}`);
    return response.data;
  },
  
  updateFactura: async (dto: FacturaUpdateDto): Promise<{ mensaje: string }> => {
    const response = await client.put<{ mensaje: string }>("Facturas", dto);
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