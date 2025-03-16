"use server";
import { db } from "@/db/client";
import { workoutExercises } from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from 'dotenv';

dotenv.config();

export async function handleUpdateExercise(exerciseId: number, updatedData: any) {
    await db
        .update(workoutExercises)
        .set(updatedData)
        .where(eq(workoutExercises.id, exerciseId));
}