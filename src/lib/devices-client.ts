// --- CLIENT-SIDE FUNCTIONS (using Client SDK) ---

import { db } from './firebase'; // Client-side DB
import {
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore'; // Client-side Firestore functions
import type { SensorDevice } from './types';

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
