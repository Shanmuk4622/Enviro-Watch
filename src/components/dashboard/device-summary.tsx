"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, ShieldX, PowerOff } from "lucide-react";
import { useMemo } from "react";
import { SensorDevice } from "@/lib/types";

const StatusCard = ({ title, count, Icon, colorClass, animationClass }: { title: string, count: number, Icon: React.ElementType, colorClass: string, animationClass?: string }) => (
  <Card className={`${colorClass} transition-transform hover:scale-105`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${colorClass.includes("text-") ? colorClass.replace(/bg-([a-z]+)-[0-9]+\/[0-9]+/, 'text-$1-500') : ''}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{count}</div>
      <p className="text-xs text-muted-foreground">
        {count} {count === 1 ? "device" : "devices"} currently {title.toLowerCase()}
      </p>
       {animationClass && <div className={`absolute top-4 right-4 h-3 w-3 rounded-full ${animationClass}`} />}
    </CardContent>
  </Card>
);

export function DeviceSummary({devices}: {devices: SensorDevice[]}) {
  const summary = useMemo(() => {
    return devices.reduce(
      (acc, device) => {
        if (device.status === 'Critical') acc.critical++;
        else if (device.status === 'Warning') acc.warning++;
        else if (device.status === 'Normal') acc.normal++;
        else acc.offline++;
        return acc;
      },
      { normal: 0, warning: 0, critical: 0, offline: 0 }
    );
  }, [devices]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatusCard title="Normal" count={summary.normal} Icon={CheckCircle} colorClass="bg-green-500/10 border-green-500/50" />
      <StatusCard title="Warning" count={summary.warning} Icon={AlertTriangle} colorClass="bg-yellow-500/10 border-yellow-500/50" />
      <StatusCard title="Critical" count={summary.critical} Icon={ShieldX} colorClass="bg-red-500/10 border-red-500/50" animationClass="bg-red-500 pulse-red" />
      <StatusCard title="Offline" count={summary.offline} Icon={PowerOff} colorClass="bg-gray-500/10 border-gray-500/50" />
    </div>
  );
}
