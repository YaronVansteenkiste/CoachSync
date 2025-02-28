// src/app/actions/fetchWorkoutData.ts
import { getTodaysWorkout } from "./getTodaysWorkout";
import { getWorkoutExercises } from "./getWorkoutExercises";

export async function fetchWorkoutData(userId: string) {
  const todaysWorkout = await getTodaysWorkout(userId);

  return await Promise.all(
    todaysWorkout.map(async (workout) => ({
      ...workout,
      exercises: await getWorkoutExercises(workout.id),
    }))
  );
}