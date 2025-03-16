"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getProgressRecord } from '@/app/actions/charts/progressRecords';

interface TotalProgressCardProps {
  userId: string;
}

const chartConfig = {
  weightKg: {
    label: "Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
  bodyFatPercentage: {
    label: "Body Fat (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function TotalProgressCard({ userId }: TotalProgressCardProps) {
  interface ProgressData {
    id: number;
    userId: string | null;
    date: string;
    weightKg: number;
    bodyFatPercentage: number;
  }
  
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgressData() {
      const data = await getProgressRecord(userId);
      setProgressData(data);

      if (data.length > 1) {
        const firstRecord = data[0];
        const lastRecord = data[data.length - 1];
        const weightChange = ((lastRecord.weightKg - firstRecord.weightKg) / firstRecord.weightKg) * 100;
        setPercentageChange(weightChange);

        const startDate = new Date(firstRecord.date).toLocaleDateString();
        const endDate = new Date(lastRecord.date).toLocaleDateString();
        setDateRange(`${startDate} - ${endDate}`);
      }
    }
    fetchProgressData();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Chart</CardTitle>
        <CardDescription>Showing progress data for the user</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={progressData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="weightKg"
              type="monotone"
              fill="var(--color-weightKg)"
              fillOpacity={0.4}
              stroke="var(--color-weightKg)"
              strokeWidth={2}
            />
            <Area
              dataKey="bodyFatPercentage"
              type="monotone"
              fill="var(--color-bodyFatPercentage)"
              fillOpacity={0.4}
              stroke="var(--color-bodyFatPercentage)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {percentageChange !== null && (
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending {percentageChange >= 0 ? 'up' : 'down'} by {Math.abs(percentageChange).toFixed(2)}% this period <TrendingUp className="h-4 w-4" />
              </div>
            )}
            {dateRange && (
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {dateRange}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}