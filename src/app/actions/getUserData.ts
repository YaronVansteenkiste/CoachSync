'use server';

import { db } from "@/db/client";
import { users, progress } from "@/db/schema/workouts";
import { eq, desc } from "drizzle-orm";

export async function getUserData(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId));

  if (!user) return null; 
  const progressData = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, userId))
    .orderBy(desc(progress.date)) 
    .limit(1);

  return {
    user: user,
    progressData: progressData,
  };
}
