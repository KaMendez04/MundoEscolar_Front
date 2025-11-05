// hooks/useCondicionPago.ts
import { useState } from "react"
import { condicionPagoService } from "../services/condicionPagoService"
import type { CreateCondicionPagoDto } from "../types/condicionPago"

export function useCondicionPago() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registrarCondicion = async (data: CreateCondicionPagoDto) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await condicionPagoService.createCondicionPago(data)
      return result
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Error al registrar condición de pago"
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return { 
    registrarCondicion, 
    isLoading, 
    error 
  }
}