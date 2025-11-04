export interface NotificacionStockBajo {
  idNotificacion: number;
  idProducto: number;
  nombreProducto: string;
  stockActual: number;
  fechaNotificacion: string;
  leida: boolean;
  esCritica?: boolean;
  mensajeAlerta?: string;
}

export interface ContadorNotificaciones {
  totalNoLeidas: number;
  criticas: number;
  advertencias: number;
}

export interface NotificacionResponse {
  success: boolean;
  count: number;
  data: NotificacionStockBajo[];
}

export interface ContadorResponse {
  success: boolean;
  data: ContadorNotificaciones;
}

export interface MarcarLeidaRequest {
  idNotificacion?: number;
  idProducto?: number;
}