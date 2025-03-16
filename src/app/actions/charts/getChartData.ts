'use server'
import { db } from "@/db/client";
import { workouts, workoutExercises, exercises } from "@/db/schema/workouts";
import {eq} from "drizzle-orm";


export async function getChartData(userId: string) {
  const workoutData = await db
    .select({
      workoutId: workouts.id,
      exerciseId: workoutExercises.exerciseId,
      category: exercises.category,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(eq(workouts.userId, userId))
    .execute();

  const categoryCount: { [key: string]: number } = {};

  workoutData.forEach((row) => {
    const category = row.category;
    if (category) {
      if (!categoryCount[category]) {
        categoryCount[category] = 0;
      }
      categoryCount[category] += 1;
    }
  });

  const totalExercises = Object.values(categoryCount).reduce((acc, count) => acc + count, 0);
  const categoryRatio: { [key: string]: number } = {};

  for (const category in categoryCount) {
    categoryRatio[category] = categoryCount[category] / totalExercises;
  }

  return categoryRatio;
}
