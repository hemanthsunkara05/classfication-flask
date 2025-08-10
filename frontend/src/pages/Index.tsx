import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SensorCard, SensorData } from "@/components/SensorCard";
import { SensorChart } from "@/components/SensorChart";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { SensorFilter } from "@/components/SensorFilter";
import { useToast } from "@/hooks/use-toast";

// Mock data generation for demo
const generateMockSensorData = (): SensorData[] => {
  const sensorTypes = [
    { type: "Gas", unit: "ppm", icon: "🌬️", normalRange: [0, 50] },
    { type: "Temperature", unit: "°C", icon: "🌡️", normalRange: [18, 25] },
    { type: "Humidity", unit: "%", icon: "💧", normalRange: [40, 60] },
    { type: "Pressure", unit: "kPa", icon: "📊", normalRange: [95, 105] },
    { type: "Light", unit: "lux", icon: "💡", normalRange: [200, 800] },
    { type: "Motion", unit: "events/min", icon: "🏃", normalRange: [0, 5] },
  ];

  return sensorTypes.map((sensor, index) => {
    const baseValue = (sensor.normalRange[0] + sensor.normalRange[1]) / 2;
    const variation = (sensor.normalRange[1] - sensor.normalRange[0]) * 0.3;
    const value = baseValue + (Math.random() - 0.5) * variation;
    
    // Randomly introduce anomalies (10% chance)
    const isAnomaly = Math.random() < 0.1;
    const anomalyValue = isAnomaly 
      ? sensor.normalRange[1] + Math.random() * 20 
      : value;

    return {
      id: `sensor-${index}`,
      type: sensor.type,
      value: isAnomaly ? anomalyValue : value,
      unit: sensor.unit,
      timestamp: new Date(),
      isAnomaly,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      icon: sensor.icon,
    };
  });
};

const generateHistoricalData = (sensors: SensorData[]) => {
  const data: Record<string, any[]> = {};
  
  sensors.forEach(sensor => {
    const points = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseValue = sensor.value;
      const variation = baseValue * 0.2;
      const value = baseValue + (Math.random() - 0.5) * variation;
      
      points.push({
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: Math.max(0, value),
        isAnomaly: Math.random() < 0.05, // 5% chance of anomaly in historical data
      });
    }
    
    data[sensor.id] = points;
  });
  
  return data;
};

const Index = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();

  // Initialize data
  useEffect(() => {
    const initialSensors = generateMockSensorData();
    setSensors(initialSensors);
    setHistoricalData(generateHistoricalData(initialSensors));
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newSensors = generateMockSensorData();
      setSensors(newSensors);
      setLastUpdated(new Date());
      
      // Simulate occasional connection issues
      const connectionStatus = Math.random() > 0.05;
      setIsConnected(connectionStatus);
      
      // Show toast for new anomalies
      const hasNewAnomaly = newSensors.some(s => s.isAnomaly);
      if (hasNewAnomaly) {
        toast({
          title: "Anomaly Detected",
          description: `New anomaly detected in ${newSensors.filter(s => s.isAnomaly).map(s => s.type).join(', ')}`,
          variant: "destructive",
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast]);

  const hasAnyAnomaly = sensors.some(sensor => sensor.isAnomaly);
  
  const filteredSensors = selectedFilter === "all" 
    ? sensors 
    : sensors.filter(sensor => sensor.type === selectedFilter);

  const sensorTypes = sensors.reduce((acc, sensor) => {
    const existing = acc.find(s => s.type === sensor.type);
    if (existing) {
      existing.count += 1;
      if (sensor.isAnomaly) existing.anomalies += 1;
    } else {
      acc.push({
        type: sensor.type,
        icon: sensor.icon,
        count: 1,
        anomalies: sensor.isAnomaly ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ type: string; icon: string; count: number; anomalies: number }>);

  const analytics = sensors.map(sensor => {
    const historical = historicalData[sensor.id] || [];
    const values = historical.map(h => h.value);
    const anomalies = historical.filter(h => h.isAnomaly).length;
    
    return {
      sensorId: sensor.id,
      sensorType: sensor.type,
      min: Math.min(...values, sensor.value),
      max: Math.max(...values, sensor.value),
      avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : sensor.value,
      anomalyCount: anomalies + (sensor.isAnomaly ? 1 : 0),
      unit: sensor.unit,
      icon: sensor.icon,
    };
  });

  const totalAnomalies = analytics.reduce((sum, a) => sum + a.anomalyCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader lastUpdated={lastUpdated} isConnected={isConnected} />
      
      <div className="container mx-auto px-4 space-y-6">
        {/* Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusIndicator hasAnomaly={hasAnyAnomaly} className="lg:col-span-1" />
          
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Live Sensor Data</h2>
            <SensorFilter 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              sensorTypes={sensorTypes}
            />
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SensorChart sensors={sensors} historicalData={historicalData} />
          <div className="lg:col-span-1">
            <AnalyticsSummary analytics={analytics} totalAnomalies={totalAnomalies} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;