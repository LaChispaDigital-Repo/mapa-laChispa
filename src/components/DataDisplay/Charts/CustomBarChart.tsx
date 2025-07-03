import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { AdaptedGraphicData } from "../../../types/interfaces";

interface CustomBarChartProps {
  data: AdaptedGraphicData[];
  colors?: string[];
}

export const CustomBarChart = ({ data, colors = ["#0088FE"] }: CustomBarChartProps) => {
  if (!data || data.length === 0) {
    return <div className="no-data-message">No hay datos de población</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentages = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={dataWithPercentages}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(value: number) => `${value.toFixed(0)}%`} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, _name: string, props: any) => {
              const absolute = props.payload.value;
              return [
                `${value.toFixed(2)}% (${new Intl.NumberFormat("es-CL").format(absolute)} personas)`,
                "Distribución",
              ];
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar
            dataKey="percentage"
            fill={colors[0]}
            name="% de población"
            label={{
              position: "right",
              formatter: (value: number) => `${value.toFixed(1)}%`,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
