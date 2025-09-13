"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SensorDevice } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

const formSchema = z.object({
  id: z.string().min(1, "Device ID is required"),
  name: z.string().min(1, "Device name is required"),
  location: z.object({
    name: z.string().min(1, "Location name is required"),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  }),
});

interface DeviceDialogProps {
  device: SensorDevice | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: SensorDevice) => void;
}

export function DeviceDialog({ device, isOpen, onClose, onSave }: DeviceDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      location: { name: "", lat: 0, lng: 0 },
    },
  });

  useEffect(() => {
    if (device) {
      form.reset({
        id: device.id,
        name: device.name,
        location: {
          name: device.location.name,
          lat: device.location.lat,
          lng: device.location.lng,
        },
      });
    } else {
      form.reset({
        id: `SN-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name: "",
        location: { name: "", lat: 0, lng: 0 },
      });
    }
  }, [device, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...values,
      // Preserve existing data not in the form
      status: device?.status || 'Normal',
      battery: device?.battery || 100,
      coLevel: device?.coLevel || 0,
      lastReading: device?.lastReading || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{device ? "Edit Device" : "Add New Device"}</DialogTitle>
          <DialogDescription>
            {device
              ? "Update the details for this sensor."
              : "Register a new sensor in the system."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Atrium Sensor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input readOnly disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Zone A - Atrium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Device</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
