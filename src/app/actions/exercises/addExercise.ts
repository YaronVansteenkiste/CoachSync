'use server'
import { workoutExercises } from "@/db/schema";
import { db } from "@/db/client";

export interface Exercise {
    id: number;
    workoutId: number;
    exerciseId: number;
    weight: number;
    sets: number;
    reps: number;
}

async function addExercise(workoutId: number | null, exerciseId: number | string): Promise<Exercise> {
    const parsedWorkoutId = Number(workoutId);
    const parsedExerciseId = Number(exerciseId);

    if (isNaN(parsedWorkoutId) || isNaN(parsedExerciseId)) {
        throw new Error("Invalid workoutId or exerciseId. Must be numbers.");
    }

    const [newExercise] = await db
        .insert(workoutExercises)
        .values({
            workoutId: parsedWorkoutId,
            exerciseId: parsedExerciseId,
            weight: 0,
            sets: 0,
            reps: 0
        })
        .returning();

    return {
        id: newExercise.id,
        workoutId: newExercise.workoutId!,
        exerciseId: newExercise.exerciseId!,
        weight: newExercise.weight!,
        sets: newExercise.sets,
        reps: newExercise.reps,
    };
}

export { addExercise };