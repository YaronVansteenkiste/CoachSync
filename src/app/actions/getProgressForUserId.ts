"use server";
import { db } from "@/db/client";
import { progress } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProgressForUserId(userId: string) {
  return await db.select().from(progress).where(eq(progress.userId, userId));
}
