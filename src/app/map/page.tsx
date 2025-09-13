import { MapView } from "@/components/map/map-view";
import { Card, CardContent } from "@/components/ui/card";

export default function MapPage() {
  return (
    <Card className="h-[calc(100vh-8rem)]">
        <CardContent className="p-0 h-full">
            <MapView />
        </CardContent>
    </Card>
  );
}
