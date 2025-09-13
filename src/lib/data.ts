import { SensorDevice, AlertRule, HistoricalData } from './types';
import { subHours, subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const mockDevices: SensorDevice[] = [
  {
    id: 'SN-001',
    name: 'Main Atrium Sensor',
    location: { lat: 40.7128, lng: -74.0060, name: 'Zone A - Atrium' },
    status: 'Normal',
    battery: 95,
    coLevel: 3,
    lastReading: formatISO(subMinutes(now, 2)),
  },
  {
    id: 'SN-002',
    name: 'Cafeteria Vent Sensor',
    location: { lat: 40.7135, lng: -74.0065, name: 'Zone B - Cafeteria' },
    status: 'Warning',
    battery: 80,
    coLevel: 12,
    lastReading: formatISO(subMinutes(now, 1)),
  },
  {
    id: 'SN-003',
    name: 'Lab 2 Exhaust',
    location: { lat: 40.7140, lng: -74.0055, name: 'Zone C - Lab 2' },
    status: 'Critical',
    battery: 65,
    coLevel: 55,
    lastReading: formatISO(subMinutes(now, 5)),
  },
  {
    id: 'SN-004',
    name: 'West Wing Corridor',
    location: { lat: 40.7122, lng: -74.0070, name: 'Zone D - West Wing' },
    status: 'Normal',
    battery: 100,
    coLevel: 2,
    lastReading: formatISO(subMinutes(now, 10)),
  },
    {
    id: 'SN-005',
    name: 'Parking Garage L1',
    location: { lat: 40.7118, lng: -74.0080, name: 'Zone E - Garage L1' },
    status: 'Offline',
    battery: 0,
    coLevel: 0,
    lastReading: formatISO(subHours(now, 3)),
  },
];

export const mockAlertRules: AlertRule[] = [
    { id: 'RULE-01', name: 'High CO Warning', threshold: 10, timeframe: 5, enabled: true },
    { id: 'RULE-02', name: 'Critical CO Alert', threshold: 50, timeframe: 1, enabled: true },
    { id: 'RULE-03', name: 'Sustained Low-level CO', threshold: 5, timeframe: 60, enabled: false },
];

export function getMockHistoricalData(baseLevel: number, variation: number, points: number = 60): HistoricalData[] {
  const data: HistoricalData[] = [];
  let currentTime = subHours(now, 1);
  for (let i = 0; i < points; i++) {
    const coLevel = baseLevel + (Math.random() - 0.5) * variation;
    data.push({
      timestamp: formatISO(currentTime),
      coLevel: Math.max(0, parseFloat(coLevel.toFixed(1))), // Ensure non-negative
    });
    currentTime = subMinutes(currentTime, -1); // Move forward one minute
  }
  return data;
}

export const mockHistoricalDataJSON = JSON.stringify(getMockHistoricalData(30, 20));
