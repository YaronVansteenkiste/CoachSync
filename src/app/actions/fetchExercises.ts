"use server";
import { db } from "@/db/client";
import { exercises } from "@/db/schema";
import { Exercise } from "@/app/types";

export async function fetchExercises(): Promise<Exercise[]> {
    const result = await db.select().from(exercises).execute();
    return result.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        weight: null,
        sets: 0,
        reps: 0,
        previousWeight: undefined,
        category: null,
        equipment: null
    }));
}
