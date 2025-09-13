'use server';
/**
 * @fileOverview Forecasts the probability of CO2 safety limit breaches in specific zones.
 *
 * - predictCO2Breaches - A function that forecasts CO2 breach probability.
 * - PredictCO2BreachesInput - The input type for the predictCO2Breaches function.
 * - PredictCO2BreachesOutput - The return type for the predictCO2Breaches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCO2BreachesInputSchema = z.object({
  zoneId: z.string().describe('The ID of the zone to forecast for.'),
  historicalCO2Data: z.string().describe('Historical CO2 concentration data for the zone as a JSON string.'),
  currentTime: z.string().describe('The current time, formatted as an ISO string.'),
  alertThreshold: z.number().describe('The CO2 concentration level that triggers an alert.'),
});
export type PredictCO2BreachesInput = z.infer<typeof PredictCO2BreachesInputSchema>;

const PredictCO2BreachesOutputSchema = z.object({
  breachProbability: z
    .number()
    .describe(
      'The probability (0-1) of a CO2 breach occurring in the specified zone within the next hour.'
    ),
  explanation: z
    .string()
    .describe(
      'A brief explanation of why the model predicts the given breach probability, including key factors.'
    ),
});
export type PredictCO2BreachesOutput = z.infer<typeof PredictCO2BreachesOutputSchema>;

export async function predictCO2Breaches(input: PredictCO2BreachesInput): Promise<PredictCO2BreachesOutput> {
  return predictCO2BreachesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCO2BreachesPrompt',
  input: {schema: PredictCO2BreachesInputSchema},
  output: {schema: PredictCO2BreachesOutputSchema},
  prompt: `You are an expert AI assistant specializing in predicting CO2 concentration breaches in specific zones.

You will receive historical CO2 data, the current time, and an alert threshold.
Your task is to forecast the probability of a CO2 breach occurring in the specified zone within the next hour.

Historical CO2 Data (JSON):
{{historicalCO2Data}}

Current Time: {{currentTime}}
Alert Threshold: {{alertThreshold}} ppm

Zone ID: {{zoneId}}

Consider trends, patterns, and any other relevant factors in the historical data.
Provide a probability (0-1) and a brief explanation of your reasoning.
Ensure the explanation includes the key factors influencing your prediction.

Output in JSON format:
{ 
  "breachProbability": number,
  "explanation": string
}`,
});

const predictCO2BreachesFlow = ai.defineFlow(
  {
    name: 'predictCO2BreachesFlow',
    inputSchema: PredictCO2BreachesInputSchema,
    outputSchema: PredictCO2BreachesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
