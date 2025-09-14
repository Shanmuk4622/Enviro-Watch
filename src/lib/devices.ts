import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import type { SensorDevice } from './types';
import { mockDevices } from './data';

const devicesCollection = collection(db, 'devices');

// --- SERVER-SIDE & SHARED FUNCTIONS ---

// Add or update a device (Server-side)
export async function addDevice(device: SensorDevice): Promise<void> {
  const deviceRef = doc(db, 'devices', device.id);
  await setDoc(deviceRef, device, { merge: true });
}

// Delete a device (Server-side)
export async function deleteDevice(deviceId: string): Promise<void> {
  const deviceRef = doc(db, 'devices', deviceId);
  await deleteDoc(deviceRef);
}

// Get all devices once (Server-side)
export async function getDevices(): Promise<SensorDevice[]> {
  const snapshot = await getDocs(devicesCollection);
  if (snapshot.empty) {
    await seedDatabase();
    const seededSnapshot = await getDocs(devicesCollection);
    return seededSnapshot.docs.map(doc => doc.data() as SensorDevice);
  }
  return snapshot.docs.map(doc => doc.data() as SensorDevice);
}

// Seed the database with initial mock data if it's empty
export async function seedDatabase(): Promise<SensorDevice[]> {
    console.log("Database is empty, seeding with mock data...");
    const promises = mockDevices.map(device => {
        const deviceRef = doc(db, 'devices', device.id);
        return setDoc(deviceRef, device);
    });
    await Promise.all(promises);
    console.log("Database seeded successfully.");
    return mockDevices;
}

// Listen for real-time updates on all devices
export function listenToDevices(callback: (devices: SensorDevice[]) => void) {
  return onSnapshot(devicesCollection, async (snapshot) => {
    if (snapshot.empty) {
      // Temporarily call seed from here for initial setup.
      // Note: This might be better handled on server startup in a real app.
      const seededDevices = await seedDatabase();
      callback(seededDevices);
    } else {
      const devices = snapshot.docs.map(doc => doc.data() as SensorDevice);
      callback(devices);
    }
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
