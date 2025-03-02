'use client'
import { useState, useEffect } from 'react';
import { OpenAI } from 'openai';
import { getWorkoutsByDay } from '@/app/actions/getWorkoutsByDay';
import { marked } from 'marked';
import { db } from "@/db/client";
import { responses } from "@/db/schema/workouts";
import { saveResponseToDB } from '@/app/actions/saveResponseToDB';
import {
    Card,
    CardContent, CardHeader
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

const presetQuestions = [
    "Check if my workout plan is optimal",
    "What are the benefits of cardio workouts?",
    "How often should I do cardio exercises?",
    "What are some good cardio exercises for beginners?",
];

export default function Page() {
    const [response, setResponse] = useState<string | null>(null);
    const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
    const [workoutsByDay, setWorkoutsByDay] = useState<any>(null);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    useEffect(() => {
        async function fetchWorkouts() {
            const userId = "550e8400-e29b-41d4-a716-446655440000";
            const workouts = await getWorkoutsByDay(userId);
            setWorkoutsByDay(workouts);
        }

        fetchWorkouts();
    }, []);

    const handleDeepSeek = async (query: string) => {
        setIsTyping(true);
        try {
            const completion = await client.chat.completions.create({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "user",
                        content: query,
                    },
                ],
            });
            const responseContent = completion.choices[0].message.content;
            if (responseContent) {
                if (responseContent) {
                    if (responseContent) {
                        if (responseContent) {
                            setResponse(responseContent);
                            await saveResponseToDB("550e8400-e29b-41d4-a716-446655440000", responseContent);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error with DeepSeek search:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleCheckWorkoutPlan = async () => {
        setIsTyping(true);
        try {
            const completion = await client.chat.completions.create({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "user",
                        content: "Check if my workout plan is optimal: " + JSON.stringify(workoutsByDay),
                    },
                ],
            });
            const responseContent = completion.choices[0].message.content;
            setResponse(responseContent);
            await saveResponseToDB("550e8400-e29b-41d4-a716-446655440000", responseContent!);
        } catch (error) {
            console.error("Error with DeepSeek search:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const query = e.currentTarget.value.toLowerCase();
            if (query.includes('check') && query.includes('workout') && query.includes('plan')) {
                handleCheckWorkoutPlan();
            } else {
                handleDeepSeek(e.currentTarget.value);
            }
        }
    };

    const handleSend = (query: string) => {
        if (query.toLowerCase().includes('check') && query.toLowerCase().includes('workout') && query.toLowerCase().includes('plan')) {
            handleCheckWorkoutPlan();
        } else {
            handleDeepSeek(query);
        }
    };

    return (
        <div className="p-6 font-sans">
            <h1 className="mb-4 text-3xl font-bold">CoachGPT</h1>
            <div className="mb-4">
                {presetQuestions.map((question, index) => (
                    <Button
                        key={index}
                        onClick={() => {
                            const inputElement = document.querySelector('input') as HTMLInputElement;
                            handleSend(question);
                        }}
                        className="mr-2 mb-2"
                    >
                        {question}
                    </Button>
                ))}
            </div>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <div className="flex">
                        <Input
                            type="text"
                            placeholder="Enter your question"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend(e.currentTarget.value);
                                }
                            }}
                            className="w-full"
                        />
                        <Button onClick={() => handleSend((document.querySelector('input') as HTMLInputElement).value)} className="ml-2">
                            Send
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isTyping && (
                        <p className="italic text-gray-500">
                            AI is typing...
                        </p>
                    )}
                    {response && (
                        <div className="mt-4">
                            <h2>Response:</h2>
                            <p dangerouslySetInnerHTML={{ __html: marked(response) }}></p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
