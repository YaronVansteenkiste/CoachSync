import { db } from "@/db/client"; 
import { workouts, workoutExercises, exercises } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getTodaysWorkout(userId: string) {
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' }); // Gets the full name of the day (e.g., "Monday")

  return await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.name, dayOfWeek))); 
}

export async function getTodaysExercises(workoutId: number) {
  return await db
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
