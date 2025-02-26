"use server";
import { db } from "@/db/client";
import { workouts, workoutExercises, exercises } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import dotenv from 'dotenv';

dotenv.config();

export async function fetchWorkout(userId: string, workoutName: string) {
    const workoutResult = await db
        .select()
        .from(workouts)
        .where(and(eq(workouts.userId, userId), eq(workouts.name, workoutName)));

    if (workoutResult.length > 0) {
        const exercisesResult = await db
            .select({
                id: workoutExercises.id,
                weight: workoutExercises.weight,
                sets: workoutExercises.sets,
                reps: workoutExercises.reps,
                name: exercises.name,
                category: exercises.category,
                equipment: exercises.equipment,
            })
            .from(workoutExercises)
            .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
            .where(eq(workoutExercises.workoutId, workoutResult[0].id));

        return { workoutId: workoutResult[0].id, exercisesData: exercisesResult };
    }
    return { workoutId: null, exercisesData: [] };
}