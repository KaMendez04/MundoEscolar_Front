// types/datamart.types.ts

export interface DashboardMetricas {
  totalVentas: number;
  totalFacturas: number;
  totalClientes: number;
  ventaPromedio: number;
  crecimientoMensual: number;
  productosMasVendidos: number;
  totalPendienteCobro: number;
  ultimosDosMeses: VentasPorPeriodo[];
}

export interface VentasPorPeriodo {
  anio: number;
  trimestre: number;
  mes: number;
  nombreMes: string;
  totalFacturas: number;
  totalLineasVenta: number;
  totalUnidades: number;
  totalSubtotal: number;
  totalDescuentos: number;
  totalImpuestos: number;
  totalVentas: number;
  ventaPromedio: number;
  ventasProductos: number;
  ventasServicios: number;
  lineasProductos: number;
  lineasServicios: number;
}

export interface TopProducto {
  productoKey: number;
  idProductoBK: number;
  nombreProducto: string;
  nombreCategoria: string;
  precioLista: number | null;
  totalVentas: number;
  unidadesVendidas: number;
  subtotalTotal: number;
  montoTotalVentas: number;
  ventaPromedio: number;
  ventaMinima: number;
  ventaMaxima: number;
}

export interface TopServicio {
  servicioKey: number;
  idServicioBK: number;
  nombreServicio: string;
  precioLista: number | null;
  totalVentas: number;
  unidadesVendidas: number;
  subtotalTotal: number;
  montoTotalVentas: number;
  ventaPromedio: number;
  ventaMinima: number;
  ventaMaxima: number;
}

export interface VentasPorCliente {
  clienteKey: number;
  idClienteBK: number;
  nombreCliente: string;
  tipoCliente: string | null;
  cedula: string | null;
  correo: string | null;
  totalFacturas: number;
  totalLineasVenta: number;
  totalUnidades: number;
  montoTotalCompras: number;
  compraPromedio: number;
  compraMayor: number;
  primeraCompra: string;
  ultimaCompra: string;
  diasComoCliente: number;
}

export interface VentasPorVendedor {
  vendedorKey: number;
  idVendedorBK: number;
  nombreVendedor: string;
  correo: string | null;
  totalFacturas: number;
  totalLineasVenta: number;
  totalUnidades: number;
  montoTotalVentas: number;
  ventaPromedio: number;
  ventasProductos: number;
  ventasServicios: number;
  clientesAtendidos: number;
  primeraVenta: string;
  ultimaVenta: string;
}

export interface VentasPorCategoria {
  categoriaKey: number;
  idCategoriaBK: number;
  nombreCategoria: string;
  descripcion: string | null;
  productosDiferentes: number;
  totalVentas: number;
  unidadesVendidas: number;
  montoTotalVentas: number;
  ventaPromedio: number;
  porcentajeVentasTotales: number;
}

export interface ComparativoProductosServicios {
  anio: number;
  mes: number;
  nombreMes: string;
  ventasProductos: number;
  unidadesProductos: number;
  montoProductos: number;
  ventasServicios: number;
  unidadesServicios: number;
  montoServicios: number;
  totalVentas: number;
  montoTotal: number;
  porcentajeMontoProductos: number;
  porcentajeMontoServicios: number;
}

export interface ResumenFactura {
  facturaKey: number;
  idFacturaBK: number;
  numeroFactura: number;
  fechaEmision: string;
  anio: number;
  mes: number;
  nombreMes: string;
  nombreCliente: string | null;
  tipoCliente: string | null;
  nombreVendedor: string | null;
  cantidadLineas: number | null;
  subtotal: number | null;
  descuento: number | null;
  impuesto: number | null;
  montoTotal: number | null;
  montoCancelado: number | null;
  saldoPendiente: number | null;
  estadoPago: boolean | null;
  estadoPagoTexto: string;
  porcentajeDescuento: number;
  promedioLinea: number;
}