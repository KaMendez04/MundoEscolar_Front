// services/condicionPagoService.ts
import client from "../Client/ConfigClient"
import type { 
  CondicionPagoCliente, 
  CreateCondicionPagoDto, 
  CondicionPagoResponse 
} from "../types/condicionPago"

export const condicionPagoService = {
  
  createCondicionPago: async (data: CreateCondicionPagoDto): Promise<CondicionPagoResponse> => {
    const response = await client.post<CondicionPagoResponse>("/CondicionPagoCliente", data)
    return response.data
  },

  fetchCondicionesByCliente: async (idCliente: number): Promise<CondicionPagoCliente[]> => {
    const response = await client.get<CondicionPagoCliente[]>(`/CondicionPagoCliente?IdCliente=${idCliente}`)
    return response.data
  },

  fetchAllCondiciones: async (): Promise<CondicionPagoCliente[]> => {
    const response = await client.get<CondicionPagoCliente[]>("/CondicionPagoCliente")
    return response.data
  },
}