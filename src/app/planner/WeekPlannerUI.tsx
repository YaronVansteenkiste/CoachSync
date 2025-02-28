'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Exercise {
    id: number;
    name: string;
    weight?: number;
    sets: number;
    reps: number;
}

interface Workout {
    id: number;
    name: string;
    exercises: Exercise[];
}

export function WeekPlannerUI({ workoutsByDay }: { workoutsByDay: { [key: string]: Workout[] } }) {
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-4xl font-bold">Week Planner</h1>
            <Tabs defaultValue="Monday" className="w-full">
                <TabsList className="grid grid-cols-7">
                    {days.map((day, index) => (
                        <TabsTrigger
                            key={day}
                            value={day}
                            onClick={() => setSelectedDay(day)}
                        >
                            {isMobile ? shortDays[index] : day}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {days.map(day => (
                    <TabsContent key={day} value={day}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{day}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {workoutsByDay[day]?.length ? (
                                    workoutsByDay[day].map(workout => (
                                        <div key={workout.id} className="mb-4">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Exercise</TableHead>
                                                        <TableHead>Weight</TableHead>
                                                        <TableHead>Sets</TableHead>
                                                        <TableHead>Reps</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {workout.exercises.map(exercise => (
                                                        <TableRow key={exercise.id}>
                                                            <TableCell>{exercise.name}</TableCell>
                                                            <TableCell>{exercise.weight === 0 ? "body weight" : `${exercise.weight}kg`}</TableCell>
                                                            <TableCell>{exercise.sets}</TableCell>
                                                            <TableCell>{exercise.reps}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <button
                                                onClick={() => router.push(`/planner/edit?day=${day}`)}
                                                className="mt-2 p-2 bg-blue-500 text-white rounded"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No workouts planned for this day</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
