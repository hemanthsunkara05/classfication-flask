import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SensorData } from "./SensorCard";

interface ChartDataPoint {
  timestamp: string;
  value: number;
  isAnomaly: boolean;
}

interface SensorChartProps {
  sensors: SensorData[];
  historicalData: Record<string, ChartDataPoint[]>;
}

export const SensorChart = ({ sensors, historicalData }: SensorChartProps) => {
  const [selectedSensor, setSelectedSensor] = useState(sensors[0]?.id || "");
  
  const currentSensor = sensors.find(s => s.id === selectedSensor);
  const chartData = historicalData[selectedSensor] || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold text-foreground">
            {payload[0].value?.toFixed(1)} {currentSensor?.unit}
          </p>
          {data.isAnomaly && (
            <p className="text-xs text-destructive font-medium">ANOMALY DETECTED</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Sensor Trends (24h)</CardTitle>
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sensor" />
            </SelectTrigger>
            <SelectContent>
              {sensors.map((sensor) => (
                <SelectItem key={sensor.id} value={sensor.id}>
                  {sensor.icon} {sensor.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                label={{ 
                  value: currentSensor?.unit || "", 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={payload.isAnomaly ? 6 : 3}
                      fill={payload.isAnomaly ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                      stroke={payload.isAnomaly ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
              {/* Add reference lines for normal ranges if needed */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};