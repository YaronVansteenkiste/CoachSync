import { getWorkoutsByDay } from "../actions/getWorkoutsByDay";
import { WeekPlannerUI } from "@/app/planner/WeekPlannerUI";

export default async function WeekPlannerPage() {
    const userId = "550e8400-e29b-41d4-a716-446655440000";
    const workoutsByDay = await getWorkoutsByDay(userId);

    return <WeekPlannerUI workoutsByDay={workoutsByDay} />;
}