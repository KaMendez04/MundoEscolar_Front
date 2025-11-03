export interface DashboardCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface ComparativoChartData {
  mes: string;
  productos: number;
  servicios: number;
}

export interface PieChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}