'use server';
/**
 * @fileOverview A Genkit flow for ingesting sensor device data.
 *
 * This flow receives data from a sensor device, validates it, and saves it
 * to the Firestore database using the Firebase Admin SDK.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import { SensorDevice } from '@/lib/types';
import { firebaseConfig } from '@/lib/firebase';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();

// Define the input schema for the sensor data, matching the Python script's payload
const IngestDeviceDataInputSchema = z.object({
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

// Define a simple output schema for the success message
const IngestDeviceDataOutputSchema = z.object({
  message: z.string(),
  id: z.string(),
});

// Define the Genkit flow
export const ingestDeviceDataFlow = ai.defineFlow(
  {
    name: 'ingestDeviceDataFlow',
    inputSchema: IngestDeviceDataInputSchema,
    outputSchema: IngestDeviceDataOutputSchema,
  },
  async (payload) => {
    console.log('Received payload:', payload);
    
    const deviceData: SensorDevice = {
      ...payload,
      lastReading: new Date().toISOString(), // Add server-side timestamp
    };

    try {
      const deviceRef = db.collection('devices').doc(deviceData.id);
      await deviceRef.set(deviceData, { merge: true });
      console.log(`Successfully saved data for device: ${deviceData.id}`);

      return {
        message: 'Device data received and saved successfully',
        id: deviceData.id,
      };
    } catch (error: any) {
      console.error('Error saving to Firestore:', error);
      // Flow will automatically throw an error, which the client will receive
      throw new Error(`Failed to save data to Firestore: ${error.message}`);
    }
  }
);
