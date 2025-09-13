import { NextResponse } from 'next/server';
import { addDevice } from '@/lib/devices';
import { SensorDevice } from '@/lib/types';
import { z } from 'zod';

const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string(),
  }),
  status: z.enum(['Normal', 'Warning', 'Critical', 'Offline']),
  battery: z.number(),
  coLevel: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = deviceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid device data', details: validation.error.flatten() }, { status: 400 });
    }
    
    const newDevice: Omit<SensorDevice, 'lastReading'> = validation.data;

    const deviceWithTimestamp = {
      ...newDevice,
      lastReading: new Date().toISOString(),
    } as SensorDevice;

    await addDevice(deviceWithTimestamp);
    
    return NextResponse.json({ message: 'Device data received', id: newDevice.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
