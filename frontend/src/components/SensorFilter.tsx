import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SensorFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  sensorTypes: Array<{ type: string; icon: string; count: number; anomalies: number }>;
}

export const SensorFilter = ({ selectedFilter, onFilterChange, sensorTypes }: SensorFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {sensorTypes.map((sensor) => (
          <Badge
            key={sensor.type}
            variant={selectedFilter === sensor.type ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-sm"
            onClick={() => onFilterChange(sensor.type)}
          >
            <span className="mr-1">{sensor.icon}</span>
            {sensor.type}
            <span className="ml-2 text-xs opacity-70">({sensor.count})</span>
            {sensor.anomalies > 0 && (
              <span className="ml-1 text-xs bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center">
                {sensor.anomalies}
              </span>
            )}
          </Badge>
        ))}
      </div>
      
      <Select value={selectedFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter sensors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sensors</SelectItem>
          {sensorTypes.map((sensor) => (
            <SelectItem key={sensor.type} value={sensor.type}>
              {sensor.icon} {sensor.type} ({sensor.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};