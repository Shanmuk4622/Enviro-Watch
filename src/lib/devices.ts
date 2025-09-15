import { db } from './firebase'; // Client-side DB
import { adminDb } from './firebase-admin'; // Server-side DB
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'; // Client-side Firestore functions
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


// --- CLIENT-SIDE FUNCTIONS (using Client SDK) ---

const devicesClientCollection = collection(db, 'devices');

// Listen for real-time updates on all devices
export function listenToDevices(callback: (devices: SensorDevice[]) => void) {
  return onSnapshot(devicesClientCollection, async (snapshot) => {
    const devices = snapshot.docs.map(doc => doc.data() as SensorDevice);
    callback(devices);
  }, (error) => {
    console.error("Error listening to devices:", error);
  });
}

// Listen for real-time updates on a single device
export function listenToDevice(deviceId: string, callback: (device: SensorDevice | null) => void) {
  const deviceRef = doc(db, 'devices', deviceId);
  return onSnapshot(deviceRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as SensorDevice);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error listening to device ${deviceId}:`, error);
    callback(null);
  });
}
