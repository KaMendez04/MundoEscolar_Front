// types/ordenPedido.ts
export interface OrdenPedido {
  idOrdenPedido: number;
  numeroOrden: number;
  fecha: string;
  cedulaJuridica: string;
  estadoDePago: boolean;
}

export interface OrdenPedidoConProveedor {
  idOrdenPedido: number;
  numeroOrden: number;
  fecha: string;
  cedulaJuridica: string;
  nombreProveedor: string;
  estadoDePago: boolean;
}

export interface CreateOrdenPedidoDto {
  numeroOrden: number;
  cedulaJuridica: string;
  estadoDePago: boolean;
}

export interface UpdateEstadoOrdenPedidoDto {
  numeroOrden: number;
  estadoDePago: boolean;
}

export interface FiltrosOrdenPedido {
  buscar?: string;
  estadoDePago?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  cedulaJuridica?: string;
  page: number;
  pageSize: number;
}

export interface ResultadoPaginadoOrdenPedido {
  ordenes: OrdenPedidoConProveedor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}