import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import RootLayout from "./src/components/MainComponents/RootLayout";

import AboutPage from "./src/page/OrdenPage";
import dashboardPage from "./src/page/dashboardPage";
import VentasPage from "./src/page/VentasPage";
import InventarioPage from "./src/page/InventarioPage";
import VentasServicio  from "./src/page/ventasServio";
import ClientePege from "./src/page/clientesPage";
import FacturasPage from "./src/page/FacturasTablaPage";




// 1. Definir root
import ReportesPage from "./src/page/ReportesPage";
import VendedoresPage from "./src/page/vendedoresPage";
const rootRoute = createRootRoute({
  component: RootLayout,
});

const ClienteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clientes",
  component: ClientePege,
});          

const VendedorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendedores",
  component: VendedoresPage,
});          


const FacturasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/facturas",
  component: FacturasPage,
}); 

// 2. Definir rutas hijas
const DashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: dashboardPage,
});

const VentasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Ventas",
  component: VentasPage,
});

const InventarioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Inventario",
  component: InventarioPage,
});

const ReportesRoute = createRoute({
  getParentRoute: () => rootRoute,
 path: "/Reportes",
  component: ReportesPage,
});

const OrdenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/Orden",
  component: AboutPage,
});

const VentasServicioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/VentasServicio",
  component: VentasServicio,
});
// 3. Añadir al root
rootRoute.addChildren([DashboardRoute, VentasRoute, InventarioRoute, ReportesRoute, OrdenRoute, VentasServicioRoute , ClienteRoute, FacturasRoute, VendedorRoute]);

// 4. Crear router
const router = createRouter({
  routeTree: rootRoute,
});

export default router;
