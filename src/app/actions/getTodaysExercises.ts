"use server";
import { db } from "@/db/client";
import { workoutExercises, exercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTodaysExercises(workoutId: number) {
  return db
      .select({
          id: workoutExercises.id,
          name: exercises.name,
          weight: workoutExercises.weight,
          sets: workoutExercises.sets,
          reps: workoutExercises.reps,
      })
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
      .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id));
}