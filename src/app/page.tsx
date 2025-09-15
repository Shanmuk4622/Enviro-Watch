import { getDevices } from "@/lib/devices";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  const initialDevices = await getDevices();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient initialDevices={initialDevices} />
    </Suspense>
  );
}

function DashboardSkeleton() {
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
