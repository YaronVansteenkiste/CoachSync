"use server";
import { db } from "@/db/client";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getTodaysWorkout(userId: string) {
  const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });
  return db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), eq(workouts.name, dayOfWeek)));
}