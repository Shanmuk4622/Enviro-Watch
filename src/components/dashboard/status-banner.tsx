"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, ShieldX } from "lucide-react";
import { useMemo } from "react";
import { SensorDevice } from "@/lib/types";

export function StatusBanner({devices}: {devices: SensorDevice[]}) {
  const { overallStatus, message, Icon, variant } = useMemo(() => {
    const criticalDevice = devices.find((d) => d.status === "Critical");
    const warningDevice = devices.find((d) => d.status === "Warning");

    if (criticalDevice) {
      return {
        overallStatus: "Critical",
        message: `Critical CO level detected at ${criticalDevice.location.name}. Immediate action required.`,
        Icon: ShieldX,
        variant: "destructive" as "destructive",
      };
    }
    if (warningDevice) {
      return {
        overallStatus: "Warning",
        message: `Elevated CO level detected at ${warningDevice.location.name}. Please monitor the situation.`,
        Icon: AlertTriangle,
        variant: "default" as "default",
        className: "bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-400"
      };
    }
    return {
      overallStatus: "Normal",
      message: "All sensor readings are within normal parameters.",
      Icon: CheckCircle,
      variant: "default" as "default",
      className: "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-500 [&>svg]:text-green-700 dark:[&>svg]:text-green-500"
    };
  }, [devices]);

  return (
    <Alert variant={variant} className={message.includes('Elevated') ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-400" : message.includes('normal') ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-500 [&>svg]:text-green-700 dark:[&>svg]:text-green-500" : ""}>
      <Icon className="h-4 w-4" />
      <AlertTitle>System Status: {overallStatus}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
