"use client";

import { StatusBanner } from "@/components/dashboard/status-banner";
import { DeviceSummary } from "@/components/dashboard/device-summary";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { FutureRiskForecast } from "@/components/dashboard/future-risk-forecast";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SensorDevice } from "@/lib/types";
import { listenToDevices } from "@/lib/devices";

export default function Home() {
  const [devices, setDevices] = useState<SensorDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToDevices((devices) => {
      setDevices(devices);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 md:gap-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 grid gap-4 md:gap-8 auto-rows-min">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
             </div>
             <Skeleton className="h-80" />
          </div>
          <div className="lg:row-span-2 xl:row-span-2 grid gap-4 md:gap-8 auto-rows-min">
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <StatusBanner devices={devices} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 md:gap-8 auto-rows-min">
           <DeviceSummary devices={devices} />
           <Card>
              <CardHeader>
                <CardTitle>CO Level Trends (Last Hour)</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart />
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 grid gap-4 md:gap-8 auto-rows-min">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <FutureRiskForecast />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
