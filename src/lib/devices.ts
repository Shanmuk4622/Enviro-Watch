import { adminDb } from './firebase-admin'; // Server-side DB
import type { SensorDevice } from './types';
import { mockDevices } from './data';

// --- SERVER-SIDE FUNCTIONS (using Admin SDK) ---

const devicesAdminCollection = adminDb.collection('devices');

// Add or update a device (Server-side)
export async function addDevice(device: SensorDevice): Promise<void> {
  const deviceRef = devicesAdminCollection.doc(device.id);
  await deviceRef.set(device, { merge: true });
}

// Delete a device (Server-side)
export async function deleteDevice(deviceId: string): Promise<void> {
  const deviceRef = devicesAdminCollection.doc(deviceId);
  await deviceRef.delete();
}

// Get all devices once (Server-side)
export async function getDevices(): Promise<SensorDevice[]> {
  const snapshot = await devicesAdminCollection.get();
  if (snapshot.empty) {
    await seedDatabase();
    const seededSnapshot = await devicesAdminCollection.get();
    return seededSnapshot.docs.map(doc => doc.data() as SensorDevice);
  }
  return snapshot.docs.map(doc => doc.data() as SensorDevice);
}

// Seed the database with initial mock data if it's empty (Server-side)
export async function seedDatabase(): Promise<SensorDevice[]> {
    console.log("Database is empty, seeding with mock data...");
    const batch = adminDb.batch();
    mockDevices.forEach(device => {
        const deviceRef = devicesAdminCollection.doc(device.id);
        batch.set(deviceRef, device);
    });
    await batch.commit();
    console.log("Database seeded successfully.");
    return mockDevices;
}
