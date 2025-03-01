'use server'
import { db } from "@/db/client";
import { progress } from "@/db/schema/workouts";

export async function addProgressRecord(userId: string, weightKg: number, bodyFatPercentage: number) {
  await db.insert(progress).values({
    userId: userId,
    date: new Date().toISOString(),
    weightKg: weightKg,
    bodyFatPercentage: bodyFatPercentage,
  });
}
