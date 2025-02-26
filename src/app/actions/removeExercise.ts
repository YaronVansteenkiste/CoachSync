'use server'
import { db } from "@/db/client";
import { workoutExercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function removeExercise(id: number) {
    const result = await db
        .delete(workoutExercises)
        .where(eq(workoutExercises.id, id));

    if (result.rowCount === 0) {
        throw new Error("Failed to remove exercise from the database");
    }
}