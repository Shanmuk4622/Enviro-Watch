"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useApiKey } from "@/app/api-key-provider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { SensorDevice } from "@/lib/types";

const StatusIndicator = ({ status }: { status: "Normal" | "Warning" | "Critical" | "Offline" }) => {
  const baseClasses = "h-3 w-3 rounded-full";
  const statusClasses = {
    Normal: "bg-green-500",
    Warning: "bg-yellow-500",
    Critical: "bg-red-500 pulse-red",
    Offline: "bg-gray-500",
  };
  return <div className={cn(baseClasses, statusClasses[status])} />;
};

export function MapWidget({devices}: {devices: SensorDevice[]}) {
  const apiKey = useApiKey();

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Sensor Map</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Google Maps API Key not configured.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Sensor Map</CardTitle>
      </CardHeader>
      <CardContent className="h-96 w-full p-0">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{ lat: 40.7128, lng: -74.006 }}
            defaultZoom={15}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId={"a2f3b4c5d6e7f8g9"}
            className="rounded-b-lg"
          >
            {devices.map((device) => (
              <AdvancedMarker key={device.id} position={device.location}>
                <StatusIndicator status={device.status}/>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </CardContent>
    </Card>
  );
}
