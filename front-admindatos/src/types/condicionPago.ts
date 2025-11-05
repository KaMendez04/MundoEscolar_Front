// types/condicionPago.ts

export interface CondicionPagoCliente {
  idCondicionPagoCliente: number
  condicion: string
  fecha: string
  idCliente: number
}

export interface CreateCondicionPagoDto {
  idCliente: number
  acepta: boolean
}

export interface CondicionPagoResponse {
  success: boolean
  message?: string
}