"use server";
import { db } from "@/db/client";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkoutFromDay(userId: string, day: string) {
  return db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), eq(workouts.name, day)));
}