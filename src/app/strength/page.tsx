"use client"
import { getChartData } from "@/app/actions/charts/getChartData"
import { getPersonalRecords } from "@/app/actions/personal-records/getPersonalRecords"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { authClient } from "@/lib/auth/client"
import Image from 'next/image'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

const chartConfig = {
    strength: {
        label: "Strength",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function StrengthPage() {
    const {
        data: session,
        isPending } = authClient.useSession();
    const router = useRouter();
    const [personalRecords, setPersonalRecords] = useState<{ id: number; exerciseName: string; exerciseImage: string; maxWeight: number; maxReps: number; achievedAt: string | null; }[]>([]);
    const [chartData, setChartData] = useState<{ subject: string; strength: number }[]>([]);
    const [leastTrained, setLeastTrained] = useState<{ bodyPart: string; percentage: number } | null>(null);
    const [overTrained, setOverTrained] = useState<{ bodyPart: string; percentage: number } | null>(null);

    useEffect(() => {
        if (!session && !isPending) {
            router.push('/auth/login');
            return;
        }
        if (!isPending && session) {
            const userId = session!.user!.id;
            async function fetchPersonalRecords() {
                if (!userId) {
                    console.error('User not authenticated');
                    return;
                }
                const records = await getPersonalRecords(userId);
                setPersonalRecords(records);
            }

            async function fetchChartData() {
                if (!userId) {
                    console.error('User not authenticated');
                    return;
                }
                const data = await getChartData(userId);
                const formattedData = Object.entries(data).map(([subject, strength]) => ({
                    subject,
                    strength: strength * 100,
                }));
                setChartData(formattedData);

                const sortedData = formattedData.sort((a, b) => a.strength - b.strength);
                setLeastTrained({ bodyPart: sortedData[0].subject, percentage: sortedData[0].strength });
                setOverTrained({ bodyPart: sortedData[sortedData.length - 1].subject, percentage: sortedData[sortedData.length - 1].strength });
            }

            fetchPersonalRecords();
            fetchChartData();
        }
    }, [session]);

    return (
        <>
            <h1 className="text-4xl font-bold mb-6">Strength Dashboard</h1>

            <div className="flex flex-col items-center">

                <div className="p-6 space-y-6 text-white min-h-screen">
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <Card className="col-span-2">
                                <CardHeader className="items-center">
                                    <CardTitle>Strength Progress Radar</CardTitle>
                                    <CardDescription>
                                        Showing the percentage of how much each body part is hit
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-0">
                                    <div className="flex flex-col md:flex-row">
                                        <ChartContainer
                                            config={chartConfig}
                                            className="mx-auto aspect-square max-h-[500px] w-full md:w-1/2"
                                        >
                                            <RadarChart data={chartData}>
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <PolarAngleAxis dataKey="subject" />
                                                <PolarGrid />
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
                                        <div className="w-full md:w-1/2 p-4">
                                            <h3 className="text-lg font-medium mb-4">Body Part Percentages</h3>
                                            <ul>
                                                {chartData.map((data) => (
                                                    <li key={data.subject} className="mb-2">
                                                        <strong>{data.subject}:</strong> {data.strength.toFixed(2)}%
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {leastTrained && (
                            <Card className="flex flex-col items-center">
                                <CardHeader className="items-center">
                                    <CardTitle>Least Trained Muscle</CardTitle>
                                    <CardDescription className="text-center">
                                        <p>You are currently undertraining your</p>
                                        <strong className="text-xl">{leastTrained.bodyPart}</strong>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-0 flex flex-col items-center">
                                    <p className="text-4xl font-bold text-red-500">{leastTrained.percentage.toFixed(2)}%</p>
                                </CardContent>
                            </Card>
                        )}

                        {overTrained && (
                            <Card className="flex flex-col items-center">
                                <CardHeader className="items-center">
                                    <CardTitle>Overtrained Muscle</CardTitle>
                                    <CardDescription className="text-center">
                                        <p>You are currently overtraining your</p>
                                        <strong className="text-xl">{overTrained.bodyPart}</strong>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-0 flex flex-col items-center">
                                    <p className="text-4xl font-bold text-green-500">{overTrained.percentage.toFixed(2)}%</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {personalRecords.map(record => (
                            <Card key={record.id}>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-medium">{record.exerciseName}</h3>
                                    <p className="text-2xl font-bold">{record.maxWeight}kg</p>
                                    <p className="text-lg">{record.maxReps} reps</p>
                                    <p className="text-muted-foreground">{record.achievedAt}</p>
                                    <div className="flex justify-center mt-4">
                                        <Image
                                            src={record.exerciseImage}
                                            alt={record.exerciseName}
                                            width={300}
                                            height={300}
                                            className="w-auto max-h-[300px] rounded"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}