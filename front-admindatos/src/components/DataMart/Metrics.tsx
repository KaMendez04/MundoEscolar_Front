// components/Dashboard/MetricCard.tsx

import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number; // porcentaje de crecimiento/decrecimiento
  trendLabel?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  iconColor = "bg-teal-500",
}) => {
  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend >= 0 ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend >= 0 ? "↑" : "↓";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()} {Math.abs(trend).toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-gray-500 ml-2">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};