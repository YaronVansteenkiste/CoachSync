"use server";
import { getExercisesFromWorkout } from "@/app/actions/getExercisesFromWorkout";
import { db } from "@/db/client";
import { workouts as workoutsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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

export async function getWorkoutsByDay(userId: string): Promise<{ [key: string]: Workout[] }> {
    const workoutsByDay: { [key: string]: Workout[] } = Object.fromEntries(
        await Promise.all(
            days.map(async (day) => {
                const workoutName = day;
                const workouts = await db
                    .select()
                    .from(workoutsTable)
                    .where(and(eq(workoutsTable.userId, userId), eq(workoutsTable.name, workoutName)));
                const workoutsWithExercises = await Promise.all(
                    workouts.map(async (workout) => ({
                        ...workout,
                        exercises: await getExercisesFromWorkout(workout.id),
                    }))
                );
                return [day, workoutsWithExercises];
            })
        )
    );
    return workoutsByDay;
}