import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceTable } from "@/components/devices/device-table";

export default function DevicesPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Device Management</CardTitle>
            <CardDescription>Register, edit, and remove sensor devices from the system. Data is updated in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
            <DeviceTable />
        </CardContent>
    </Card>
  );
}
