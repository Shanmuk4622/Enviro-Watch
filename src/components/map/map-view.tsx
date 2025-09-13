"use client";

import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useApiKey } from "@/app/api-key-provider";
import { SensorDevice } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { listenToDevices } from "@/lib/devices";

const StatusIndicator = ({ status }: { status: SensorDevice["status"] }) => {
  const baseClasses = "h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 shadow-lg";
  const statusClasses = {
    Normal: "bg-green-500",
    Warning: "bg-yellow-500",
    Critical: "bg-red-500 pulse-red",
    Offline: "bg-gray-500",
  };
  return <div className={cn(baseClasses, statusClasses[status])} />;
};

const MarkerWithInfoWindow = ({ device }: { device: SensorDevice }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfoWindowShown(true)}
        position={device.location}
        title={device.name}
      >
        <StatusIndicator status={device.status} />
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
        >
          <div className="p-2 min-w-48">
            <h3 className="font-bold">{device.name}</h3>
            <p className="text-sm text-muted-foreground">{device.location.name}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
                <span>Status:</span>
                <Badge className={cn("capitalize", 
                    device.status === 'Normal' ? 'bg-green-100 text-green-800' :
                    device.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    device.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                )}>{device.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span>CO Level:</span>
                <span className="font-semibold">{device.coLevel} ppm</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span>Battery:</span>
                <span className="font-semibold">{device.battery}%</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};


export function MapView() {
  const apiKey = useApiKey();
  const [devices, setDevices] = useState<SensorDevice[]>([]);

  useEffect(() => {
    const unsubscribe = listenToDevices(setDevices);
    return () => unsubscribe();
  }, []);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground bg-muted rounded-lg">
        Google Maps API Key not configured.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={{ lat: 40.7128, lng: -74.006 }}
        defaultZoom={15}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        mapId={"a2f3b4c5d6e7f8g9"}
        className="h-full w-full rounded-lg"
      >
        {devices.map((device) => (
          <MarkerWithInfoWindow key={device.id} device={device} />
        ))}
      </Map>
    </APIProvider>
  );
}
