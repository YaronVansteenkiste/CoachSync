"use client"
import BodyPartChart from "../components/BodyPartChart";
import {TrendingUp} from "lucide-react"
import {PolarAngleAxis, PolarGrid, Radar, RadarChart} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useEffect, useState} from "react";
import {getPersonalRecords} from "@/app/actions/getPersonalRecords";

const chartData = [
    {subject: "Shoulders", strength: 80},
    {subject: "Chest", strength: 70},
    {subject: "Quads", strength: 85},
    {subject: "Hamstrings", strength: 75},
    {subject: "Lats", strength: 90},
    {subject: "Arms", strength: 80},
]

const chartConfig = {
    strength: {
        label: "Strength",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function Page() {

        const [personalRecords, setPersonalRecords] = useState([]);

        useEffect(() => {
            async function fetchPersonalRecords() {
                const userId = "550e8400-e29b-41d4-a716-446655440000";
                const records = await getPersonalRecords(userId);
                setPersonalRecords(records);
            }

            fetchPersonalRecords();
        }, []);

    return (
        <>
            <h1 className="text-4xl font-bold">Strength Dashboard</h1>

            <div className="flex flex-col items-center">

                <div className="p-6 space-y-6 text-white min-h-screen">
                    <h1 className="text-4xl font-bold">Strength Dashboard</h1>

                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="items-center">
                                    <CardTitle>Strength Progress Radar</CardTitle>
                                    <CardDescription>
                                        Showing strength progress across different muscle groups
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-0">
                                    <ChartContainer
                                        config={chartConfig}
                                        className="mx-auto aspect-square max-h-[250px]"
                                    >
                                        <RadarChart data={chartData}>
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
                                            <PolarAngleAxis dataKey="subject"/>
                                            <PolarGrid/>
                                            <Radar
                                                dataKey="strength"
                                                fill="var(--color-strength)"
                                                fillOpacity={0.6}
                                                dot={{
                                                    r: 4,
                                                    fillOpacity: 1,
                                                }}
                                            />
                                        </RadarChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col gap-2 text-sm">
                                    <div className="flex items-center gap-2 font-medium leading-none">
                                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4"/>
                                    </div>
                                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                        January - February 2025
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader className="items-center">
                                    <CardTitle>Body Part Hit Percentage</CardTitle>
                                    <CardDescription>
                                        Showing the percentage of how much each body part is hit
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-0">
                                    <BodyPartChart/>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {personalRecords.map(record => (
                            <Card key={record.id}>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-medium">{record.exerciseName}</h3>
                                    <p className="text-2xl font-bold">{record.maxWeight}kg</p>
                                    <p className="text-lg">{record.maxReps} reps</p>
                                    <p className="text-muted-foreground">{record.achievedAt}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}
