import { StatusBanner } from "@/components/dashboard/status-banner";
import { DeviceSummary } from "@/components/dashboard/device-summary";
import { MapWidget } from "@/components/dashboard/map-widget";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { FutureRiskForecast } from "@/components/dashboard/future-risk-forecast";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <StatusBanner />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-4 md:gap-8 auto-rows-min">
           <DeviceSummary />
           <Card>
              <CardHeader>
                <CardTitle>CO Level Trends (Last Hour)</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart />
              </CardContent>
            </Card>
        </div>
        <div className="lg:row-span-2 xl:row-span-2 grid gap-4 md:gap-8 auto-rows-min">
          <MapWidget />
          <Suspense fallback={<Skeleton className="h-64" />}>
            <FutureRiskForecast />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
