import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface PLPieChartData {
  name: string;
  value: number;
  color: string;
}

interface PLPieChartProps {
  data: PLPieChartData[];
}

export default function PLPieChart({ data }: PLPieChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-muted-foreground">
            {data.value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-8 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded border-2"
              style={{ 
                backgroundColor: entry.color,
                borderColor: entry.color
              }}
            />
            <span className="text-sm font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-8 gradient-border animate-scale-in w-full" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <PieChartIcon size={20} className="text-primary" />
        <h3 className="font-semibold text-lg text-foreground">P&L Distribution</h3>
      </div>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={3}
              stroke="#1a1a1a"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {data[0]?.value.toFixed(1)}%
          </div>
          <div className="text-sm font-medium text-muted-foreground">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400 mb-1">
            {data[1]?.value.toFixed(1)}%
          </div>
          <div className="text-sm font-medium text-muted-foreground">Loss Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-400 mb-1">
            {data[2]?.value.toFixed(1) || "0.0"}%
          </div>
          <div className="text-sm font-medium text-muted-foreground">Breakeven</div>
        </div>
      </div>
    </div>
  );
}