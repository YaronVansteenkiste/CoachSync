'use server'
import { db } from "@/db/client";
import { progress } from "@/db/schema/workouts";
import { eq } from "drizzle-orm";

export async function addProgressRecord(userId: string, weightKg: number, bodyFatPercentage: number) {
  await db.insert(progress).values({
    userId: userId,
    date: new Date().toISOString(),
    weightKg: weightKg,
    bodyFatPercentage: bodyFatPercentage,
  });
}

export async function getProgressRecord(userId: string) {
  return await db.select().from(progress).where(eq(progress.userId, userId));
}
