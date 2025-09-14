
'use client';

import { useState, useEffect } from 'react';
import { SensorDevice } from '@/lib/types';
import { listenToDevices } from '@/lib/devices';

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
