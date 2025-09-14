import { config } from 'dotenv';
config();

import '@/ai/flows/predict-co2-breaches.ts';
import '@/ai/flows/ingest-device-data.ts';
