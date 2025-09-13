import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceTable } from "@/components/devices/device-table";
import { mockDevices } from "@/lib/data";

export default function DevicesPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Device Management</CardTitle>
            <CardDescription>Register, edit, and remove sensor devices from the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <DeviceTable data={mockDevices} />
        </CardContent>
    </Card>
  );
}
