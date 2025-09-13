export type SensorDevice = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  status: 'Normal' | 'Warning' | 'Critical';
  battery: number;
  coLevel: number; // in ppm
  lastReading: string;
};

export type AlertRule = {
    id: string;
    name: string;
    threshold: number; // in ppm
    timeframe: number; // in minutes
    enabled: boolean;
};

export type HistoricalData = {
    timestamp: string;
    coLevel: number;
};
