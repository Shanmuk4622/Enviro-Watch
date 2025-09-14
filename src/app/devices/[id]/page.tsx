'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { listenToDevice } from '@/lib/devices';
import { SensorDevice } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useApiKey } from '@/app/api-key-provider';
import { CheckCircle, AlertTriangle, ShieldX, PowerOff, Battery, Thermometer, MapPin, Hash, BarChart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { TrendChart } from '@/components/dashboard/trend-chart';

const statusInfo: {
  [key in SensorDevice['status']]: {
    Icon: React.ElementType;
    color: string;
    label: string;
  };
} = {
  Normal: { Icon: CheckCircle, color: 'text-green-500', label: 'Normal' },
  Warning: { Icon: AlertTriangle, color: 'text-yellow-500', label: 'Warning' },
  Critical: { Icon: ShieldX, color: 'text-red-500', label: 'Critical' },
  Offline: { Icon: PowerOff, color: 'text-gray-500', label: 'Offline' },
};

function DetailItem({ Icon, label, value, valueClass }: { Icon: React.ElementType; label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>
      <span className={cn("text-right font-semibold", valueClass)}>{value}</span>
    </div>
  );
}

function StatusIndicator({ status }: { status: SensorDevice["status"] }) {
  const baseClasses = "h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 shadow-lg";
  const statusClasses = {
    Normal: "bg-green-500",
    Warning: "bg-yellow-500",
    Critical: "bg-red-500 pulse-red",
    Offline: "bg-gray-500",
  };
  return <div className={cn(baseClasses, statusClasses[status])} />;
};


export default function DeviceDetailPage() {
  const params = useParams();
  const deviceId = params.id as string;
  const apiKey = useApiKey();

  const [device, setDevice] = useState<SensorDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;
    setIsLoading(true);
    const unsubscribe = listenToDevice(deviceId, (deviceData) => {
      setDevice(deviceData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [deviceId]);

  const { Icon, color, label } = useMemo(() => {
    return statusInfo[device?.status || 'Offline'];
  }, [device]);

  const batteryColor = useMemo(() => {
    if (!device) return '';
    return device.battery < 20 ? 'text-red-500' : device.battery < 50 ? 'text-yellow-500' : 'text-green-500';
  }, [device]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!device) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{device.name}</h1>
        <p className="text-lg text-muted-foreground">{device.location.name}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon className={cn("h-6 w-6", color)} />
                Current Status: {label}
              </CardTitle>
              <CardDescription>
                Last reading received: {format(parseISO(device.lastReading), "PPP 'at' p")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <DetailItem Icon={Thermometer} label="CO Level" value={`${device.coLevel} ppm`} valueClass={color} />
              <DetailItem Icon={Battery} label="Battery" value={`${device.battery}%`} valueClass={batteryColor} />
              <DetailItem Icon={Hash} label="Device ID" value={device.id} />
              <DetailItem Icon={MapPin} label="Coordinates" value={`${device.location.lat.toFixed(4)}, ${device.location.lng.toFixed(4)}`} />
            </CardContent>
          </Card>
          
           <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="h-6 w-6 text-primary"/>CO Level Trends (Last Hour)</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart />
              </CardContent>
            </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Device Location</CardTitle>
            </CardHeader>
            <CardContent className="h-full w-full p-0 rounded-b-lg">
              {apiKey ? (
                <APIProvider apiKey={apiKey}>
                  <Map
                    center={device.location}
                    zoom={16}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    mapId={"a2f3b4c5d6e7f8g9"}
                    className="rounded-b-lg h-[calc(100%-4rem)]"
                  >
                    <AdvancedMarker position={device.location}>
                      <StatusIndicator status={device.status} />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground bg-muted rounded-b-lg">
                  Google Maps API Key not configured.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
   </div>
      </div>
    </div>
  );
}
