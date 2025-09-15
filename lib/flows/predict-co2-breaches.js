"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictCO2Breaches = predictCO2Breaches;
/**
 * @fileOverview Forecasts the probability of CO2 safety limit breaches in specific zones.
 *
 * - predictCO2Breaches - A function that forecasts CO2 breach probability.
 * - PredictCO2BreachesInput - The input type for the predictCO2Breaches function.
 * - PredictCO2BreachesOutput - The return type for the predictCO2Breaches function.
 */
const genkit_1 = require("@/ai/genkit");
const genkit_2 = require("genkit");
const PredictCO2BreachesInputSchema = genkit_2.z.object({
    zoneId: genkit_2.z.string().describe('The ID of the zone to forecast for.'),
    historicalCO2Data: genkit_2.z.string().describe('Historical CO2 concentration data for the zone as a JSON string.'),
    currentTime: genkit_2.z.string().describe('The current time, formatted as an ISO string.'),
    alertThreshold: genkit_2.z.number().describe('The CO2 concentration level that triggers an alert.'),
});
const PredictCO2BreachesOutputSchema = genkit_2.z.object({
    breachProbability: genkit_2.z
        .number()
        .describe('The probability (0-1) of a CO2 breach occurring in the specified zone within the next hour.'),
    explanation: genkit_2.z
        .string()
        .describe('A brief explanation of why the model predicts the given breach probability, including key factors.'),
});
async function predictCO2Breaches(input) {
    return predictCO2BreachesFlow(input);
}
const prompt = genkit_1.ai.definePrompt({
    name: 'predictCO2BreachesPrompt',
    input: { schema: PredictCO2BreachesInputSchema },
    output: { schema: PredictCO2BreachesOutputSchema },
    model: 'gemini-1.5-flash',
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
const predictCO2BreachesFlow = genkit_1.ai.defineFlow({
    name: 'predictCO2BreachesFlow',
    inputSchema: PredictCO2BreachesInputSchema,
    outputSchema: PredictCO2BreachesOutputSchema,
}, async (input) => {
    const { output } = await prompt(input);
    return output;
});
