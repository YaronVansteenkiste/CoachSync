"use server";
import { getExercisesFromWorkout } from "@/app/actions/getExercisesFromWorkout";
import { getWorkoutFromDay } from "@/app/actions/getWorkoutFromDay";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Exercise {
    id: number;
    name: string;
    weight?: number;
    sets: number;
    reps: number;
}

interface Workout {
    id: number;
    name: string;
    exercises: Exercise[];
}

export async function getWorkoutsByDay(userId: string): Promise<{ [key: string]: Workout[] }> {
    const workoutsByDay: { [key: string]: Workout[] } = Object.fromEntries(
        await Promise.all(
            days.map(async (day) => {
                const workouts = await getWorkoutFromDay(userId, day);
                const workoutsWithExercises = await Promise.all(
                    workouts.map(async (workout) => ({
                        ...workout,
                        exercises: await getExercisesFromWorkout(workout.id),
                    }))
                );
                return [day, workoutsWithExercises];
            })
        )
    );
    return workoutsByDay;
}