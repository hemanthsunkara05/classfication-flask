import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  hasAnomaly: boolean;
  className?: string;
}

export const StatusIndicator = ({ hasAnomaly, className }: StatusIndicatorProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6 rounded-xl border", className)}>
      <div className="relative mb-4">
        <div 
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
            hasAnomaly 
              ? "bg-destructive text-destructive-foreground shadow-red-200" 
              : "bg-success text-success-foreground shadow-green-200"
          )}
        >
          {hasAnomaly ? (
            <AlertTriangle className="w-10 h-10" />
          ) : (
            <CheckCircle2 className="w-10 h-10" />
          )}
        </div>
        
        {/* Pulsing ring animation for anomaly */}
        {hasAnomaly && (
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-destructive animate-ping opacity-20" />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground mb-1">
          Status: {hasAnomaly ? "Anomaly Detected" : "Normal"}
        </p>
        <p className={cn(
          "text-sm font-medium",
          hasAnomaly ? "text-destructive" : "text-success"
        )}>
          {hasAnomaly ? "⚠️ Immediate attention required" : "✅ All systems operational"}
        </p>
      </div>
    </div>
  );
};