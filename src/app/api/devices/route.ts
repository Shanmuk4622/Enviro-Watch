import { NextResponse } from 'next/server';
import { addDevice } from '@/lib/devices';
import { SensorDevice } from '@/lib/types';
import { z } from 'zod';

// Define the schema for input validation
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

    // Validate the incoming data
    const validation = deviceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid device data', details: validation.error.flatten() }, { status: 400 });
    }

    const deviceData: SensorDevice = {
      ...validation.data,
      lastReading: new Date().toISOString(), // Add server-side timestamp
    };

    // Save data to Firestore
    await addDevice(deviceData);

    return NextResponse.json({ message: 'Device data received and saved successfully', id: deviceData.id }, { status: 201 });

  } catch (error: any) {
    console.error('Error in /api/devices POST:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ error: `Failed to process request: ${error.message}` }, { status: 500 });
  }
}
