import { Settings, Activity, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  lastUpdated: Date;
  isConnected: boolean;
}

export const DashboardHeader = ({ lastUpdated, isConnected }: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project G</h1>
            <p className="text-sm text-muted-foreground">Smart Monitoring System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wifi className={`w-4 h-4 ${isConnected ? 'text-success' : 'text-destructive'}`} />
            <span className={isConnected ? 'text-success' : 'text-destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};