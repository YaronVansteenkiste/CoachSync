'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeekPlanner() {
    const [tasks, setTasks] = useState<{ [key: string]: string[] }>(
        Object.fromEntries(days.map(day => [day, []]))
    );
    const [input, setInput] = useState("");
    const [selectedDay, setSelectedDay] = useState("Monday");

    const addTask = () => {
        if (input.trim() === "") return;
        setTasks(prev => ({
            ...prev,
            [selectedDay]: [...prev[selectedDay], input],
        }));
        setInput("");
    };

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
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Add a task"
                                    />
                                    <Button onClick={addTask}>Add</Button>
                                </div>
                                <ul className="list-disc pl-5 space-y-1">
                                    {tasks[day].map((task, index) => (
                                        <li key={index}>{task}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}