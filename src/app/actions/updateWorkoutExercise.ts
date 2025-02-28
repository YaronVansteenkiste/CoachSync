"use server";
import { db } from "@/db/client";
import { workoutExercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateWorkoutExercise(exerciseId: number, updatedData: any) {
  await db
    .update(workoutExercises)
    .set(updatedData)
    .where(eq(workoutExercises.id, exerciseId));
}