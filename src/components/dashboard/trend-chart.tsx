"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getMockHistoricalData } from "@/lib/data"
import { subMinutes, format } from "date-fns"

const initialData = getMockHistoricalData(8, 15, 60);

export function TrendChart() {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)];
        const lastTimestamp = new Date(newData[newData.length - 1].timestamp);
        const newTimestamp = subMinutes(lastTimestamp, -1);
        const newCoLevel = 8 + (Math.random() - 0.5) * 15;
        newData.push({
          timestamp: newTimestamp.toISOString(),
          coLevel: Math.max(0, parseFloat(newCoLevel.toFixed(1))),
        });
        return newData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);
  
  const chartConfig = {
    coLevel: {
      label: "CO Level (ppm)",
      color: "hsl(var(--primary))",
    },
  } satisfies React.ComponentProps<typeof ChartContainer>["config"]

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
        <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => format(new Date(value), "HH:mm")}
            />
            <YAxis dataKey="coLevel" domain={[0, 'dataMax + 10']} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
            dataKey="coLevel"
            type="monotone"
            stroke="var(--color-coLevel)"
            strokeWidth={2}
            dot={false}
            />
        </LineChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
