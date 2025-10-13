import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import RootLayout from "./src/components/MainComponents/RootLayout";

import AboutPage from "./src/page/OrdenPage";
import dashboardPage from "./src/page/dashboardPage";
import VentasPage from "./src/page/VentasPage";
import InventarioPage from "./src/page/InventarioPage";
// 1. Definir root
import ReportesPage from "./src/page/ReportesPage";
const rootRoute = createRootRoute({
  component: RootLayout,
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

// 3. Añadir al root
rootRoute.addChildren([DashboardRoute, VentasRoute, InventarioRoute, ReportesRoute, OrdenRoute]);

// 4. Crear router
const router = createRouter({
  routeTree: rootRoute,
});

export default router;
