'use client'
import { useState, useEffect } from 'react';
import { OpenAI } from 'openai';
import { getWorkoutsByDay } from '@/app/actions/getWorkoutsByDay';
import { marked } from 'marked';
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
            setResponse(completion.choices[0].message.content);
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
            setResponse(completion.choices[0].message.content);
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

    return (
        <div className="p-6 font-sans">
            <h1 className="mb-4">DeepSeek Search</h1>
            <Button onClick={handleCheckWorkoutPlan} className="mb-4">
                Check if my workout plan is optimal
            </Button>
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <Input
                        type="text"
                        placeholder="Enter your question"
                        onKeyDown={handleInputKeyDown}
                        className="w-full"
                    />
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
