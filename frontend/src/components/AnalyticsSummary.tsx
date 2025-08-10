import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SensorData } from "./SensorCard";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

interface Analytics {
  sensorId: string;
  sensorType: string;
  min: number;
  max: number;
  avg: number;
  anomalyCount: number;
  unit: string;
  icon: string;
}

interface AnalyticsSummaryProps {
  analytics: Analytics[];
  totalAnomalies: number;
}

export const AnalyticsSummary = ({ analytics, totalAnomalies }: AnalyticsSummaryProps) => {
  const anomalyData = analytics.map(a => ({
    name: a.sensorType,
    count: a.anomalyCount,
    icon: a.icon
  }));

  return (
    <div className="space-y-6">
      {/* Overall Anomaly Count */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">24h Anomaly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-primary">{totalAnomalies}</div>
              <p className="text-sm text-muted-foreground">Total anomalies detected</p>
            </div>
            <div className="h-16 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={anomalyData}>
                  <Bar dataKey="count" radius={2}>
                    {anomalyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.count > 0 ? "hsl(var(--destructive))" : "hsl(var(--muted))"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Sensor Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {analytics.map((sensor) => (
          <Card key={sensor.sensorId}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span>{sensor.icon}</span>
                {sensor.sensorType}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Min</p>
                  <p className="font-semibold">{sensor.min.toFixed(1)} {sensor.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg</p>
                  <p className="font-semibold">{sensor.avg.toFixed(1)} {sensor.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max</p>
                  <p className="font-semibold">{sensor.max.toFixed(1)} {sensor.unit}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Range Coverage</span>
                  <span>{Math.round(((sensor.avg - sensor.min) / (sensor.max - sensor.min)) * 100)}%</span>
                </div>
                <Progress 
                  value={((sensor.avg - sensor.min) / (sensor.max - sensor.min)) * 100} 
                  className="h-2"
                />
              </div>
              
              {sensor.anomalyCount > 0 && (
                <div className="flex items-center justify-between text-sm p-2 bg-destructive/10 rounded-md">
                  <span className="text-destructive font-medium">
                    ⚠️ {sensor.anomalyCount} anomalies
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};