'use client'
import { useState, useEffect } from 'react';
import { authClient } from "@/lib/auth-client";
import { getWorkoutsByDay } from "../actions/getWorkoutsByDay";
import { WeekPlannerUI } from "@/app/planner/WeekPlannerUI";
import { useRouter } from "next/navigation";

export default function WeekPlannerPage() {
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();
    const router = useRouter();

    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [workoutsByDay, setWorkoutsByDay] = useState<any>({}); 

    useEffect(() => {
        async function fetchData() {
            if (!session && !isPending) {
                router.push('/auth/login');
                return;
            }

            if (!isPending && session) {
                try {
                    const userIdFromDb = session.user?.id;
                    setUserId(userIdFromDb);
                    const workouts = await getWorkoutsByDay(userIdFromDb);
                    setWorkoutsByDay(workouts);
                } catch (error) {
                    console.error("Failed to fetch workouts by day:", error);
                }
            }
        }
        fetchData();
    }, [isPending, session, router]);

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (!userId) {
        return <p>No user ID found.</p>;
    }

    return <WeekPlannerUI workoutsByDay={workoutsByDay} />;
}