'use server'
import { and, eq } from "drizzle-orm";
import {workoutExercises} from "@/db/schema";
import {db} from "@/db/client";

export async function addExercise(workoutId: number, exerciseId: string) {
    const [newExercise] = await db
        .insert(workoutExercises)
        .values({
            workoutId,
            exerciseId,
            weight: 0,
            sets: 0,
            reps: 0,
        })
        .returning();

    return newExercise;
}
