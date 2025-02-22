import { getWorkoutFromDay, getExercisesFromWorkout } from "@/app/actions";
import { WeekPlannerUI } from "./WeekPlannerUI";

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

export default async function WeekPlanner() {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    
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

    return <WeekPlannerUI workoutsByDay={workoutsByDay} />;
}
