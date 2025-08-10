import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SensorData {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
  isAnomaly: boolean;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

interface SensorCardProps {
  sensor: SensorData;
}

export const SensorCard = ({ sensor }: SensorCardProps) => {
  const getTrendIcon = () => {
    switch (sensor.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      sensor.isAnomaly && "border-destructive bg-destructive/5"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-lg">{sensor.icon}</span>
            <span className="text-muted-foreground">{sensor.type}</span>
          </div>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-2xl font-bold",
              sensor.isAnomaly ? "text-destructive" : "text-foreground"
            )}>
              {sensor.value.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{sensor.unit}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{sensor.timestamp.toLocaleTimeString()}</span>
            {sensor.isAnomaly && (
              <span className="text-destructive font-medium">ANOMALY</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};