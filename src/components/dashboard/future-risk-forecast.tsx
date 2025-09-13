"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { predictCO2Breaches, PredictCO2BreachesOutput } from "@/ai/flows/predict-co2-breaches";
import { mockHistoricalDataJSON } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, RefreshCw } from 'lucide-react';

export function FutureRiskForecast() {
  const [prediction, setPrediction] = useState<PredictCO2BreachesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getPrediction = async () => {
    setIsLoading(true);
    try {
      const input = {
        zoneId: 'Zone C - Lab 2',
        historicalCO2Data: mockHistoricalDataJSON,
        currentTime: new Date().toISOString(),
        alertThreshold: 50,
      };
      const result = await predictCO2Breaches(input);
      setPrediction(result);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction({
        breachProbability: 0,
        explanation: 'Could not fetch prediction from AI model.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPrediction();
  }, []);

  const probabilityPercentage = prediction ? (prediction.breachProbability * 100).toFixed(0) : 0;
  
  const getRiskColor = (prob: number) => {
    if (prob > 75) return 'text-red-500';
    if (prob > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <CardTitle>Future Risk Forecast</CardTitle>
        </div>
        <CardDescription>AI-powered prediction for the next hour in Zone C.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-6xl font-bold ${getRiskColor(Number(probabilityPercentage))}`}>{probabilityPercentage}%</div>
            <p className="text-lg font-medium text-muted-foreground">Breach Probability</p>
            <p className="mt-4 text-sm text-left">{prediction?.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={getPrediction} disabled={isLoading} className="w-full">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Recalculating...' : 'Recalculate Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}
