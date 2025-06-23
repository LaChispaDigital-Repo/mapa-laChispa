import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { AdaptedGraphicData } from "../../../types/region-selector.inteface";

interface CustomPieChartProps {
  data: AdaptedGraphicData[];
  colors?: string[];
  width?: number | string;
  height?: number | string;
}

export const CustomPieChart = ({ data, colors = ["#0088FE", "#00C49F"] }: CustomPieChartProps) => {
  const label = ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`;

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 border border-dashed border-gray-300 py-4">
        No hay datos disponibles para el gráfico
      </div>
    );
  }

  return (
    <div className="w-full h-80 items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            label={label}
            isAnimationActive={true}
            animationDuration={1200}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
