'use client';

import { useState, useEffect } from 'react';
import { SensorDevice } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { seedDatabase } from '@/lib/devices'; // Can still call server functions

// Listen for real-time updates on all devices
export function listenToDevices(callback: (devices: SensorDevice[]) => void) {
  return onSnapshot(collection(db, 'devices'), async (snapshot) => {
    if (snapshot.empty) {
      console.log("Client detected empty devices, seeding...");
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


export function useDevices() {
  const [devices, setDevices] = useState<SensorDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenToDevices((devices) => {
      setDevices(devices);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { devices, isLoading };
}
