'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-4xl font-bold">Week Planner</h1>
            <Tabs defaultValue="Monday" className="w-full">
                <TabsList className="grid grid-cols-7">
                    {days.map(day => (
                        <TabsTrigger
                            key={day}
                            value={day}
                            onClick={() => setSelectedDay(day)}
                        >
                            {day}
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
                                {workoutsByDay[day]?.map((workout) => (
                                    <div key={workout.id} className="mb-4">
                                        <ul className="list-disc pl-5 space-y-2">
                                            {workout.exercises.map((exercise) => (
                                                <li key={exercise.id} className="text-sm">
                                                    <span className="font-medium">{exercise.name}</span>
                                                    <span> - {exercise.sets}x{exercise.reps}</span>
                                                    {exercise.weight && <span> @ {exercise.weight}kg</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                {!workoutsByDay[day]?.length && (
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