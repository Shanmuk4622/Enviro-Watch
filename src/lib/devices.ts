'use client';

import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import type { SensorDevice } from './types';
import { mockDevices } from './data';

const devicesCollection = collection(db, 'devices');

// Function to get all devices once
export async function getDevices(): Promise<SensorDevice[]> {
  const snapshot = await getDocs(devicesCollection);
  if (snapshot.empty) {
    // If the collection is empty, populate it with mock data
    await seedDatabase();
    const seededSnapshot = await getDocs(devicesCollection);
    return seededSnapshot.docs.map(doc => doc.data() as SensorDevice);
  }
  return snapshot.docs.map(doc => doc.data() as SensorDevice);
}

// Function to add or update a device
export async function addDevice(device: SensorDevice): Promise<void> {
  const deviceRef = doc(db, 'devices', device.id);
  await setDoc(deviceRef, device, { merge: true });
}

// Function to delete a device
export async function deleteDevice(deviceId: string): Promise<void> {
  const deviceRef = doc(db, 'devices', deviceId);
  await deleteDoc(deviceRef);
}

// Function to listen for real-time updates
export function listenToDevices(callback: (devices: SensorDevice[]) => void) {
  return onSnapshot(devicesCollection, snapshot => {
    if (snapshot.empty) {
       // If the collection is empty, populate it with mock data
      seedDatabase().then(seededDevices => callback(seededDevices));
    } else {
      const devices = snapshot.docs.map(doc => doc.data() as SensorDevice);
      callback(devices);
    }
  }, (error) => {
    console.error("Error listening to devices:", error);
  });
}

// Seed the database with initial mock data if it's empty
async function seedDatabase(): Promise<SensorDevice[]> {
    console.log("Database is empty, seeding with mock data...");
    const promises = mockDevices.map(device => {
        const deviceRef = doc(db, 'devices', device.id);
        return setDoc(deviceRef, device);
    });
    await Promise.all(promises);
    console.log("Database seeded successfully.");
    return mockDevices;
}
