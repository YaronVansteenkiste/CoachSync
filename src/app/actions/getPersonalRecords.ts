"use server";
import { db } from "@/db/client";
import { personalRecords, exercises } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getPersonalRecords(userId: string) {
    return db
        .select({
            id: personalRecords.id,
            exerciseName: exercises.name,
            maxWeight: personalRecords.maxWeight,
            maxReps: personalRecords.maxReps,
            achievedAt: personalRecords.achievedAt,
        })
        .from(personalRecords)
        .where(eq(personalRecords.userId, userId))
        .innerJoin(exercises, eq(personalRecords.exerciseId, exercises.id));
}

export async function createOrUpdatePersonalRecord(record: { userId: string, exerciseId: string, maxWeight: number, maxReps: number }) {
    const existingRecord = await db
        .select()
        .from(personalRecords)
        .where(and(eq(personalRecords.exerciseId, record.exerciseId), eq(personalRecords.userId, record.userId)))
        .limit(1)
        .then(records => records[0]);

    if (existingRecord) {
        await db.update(personalRecords)
            .set({
                maxWeight: Math.max(record.maxWeight, existingRecord.maxWeight),
                maxReps: Math.max(record.maxReps, existingRecord.maxReps),
                achievedAt: new Date().toISOString()
            })
            .where(eq(personalRecords.id, existingRecord.id))
            .execute();
    } else {
        await db.insert(personalRecords).values({
            userId: record.userId,
            exerciseId: record.exerciseId,
            maxWeight: record.maxWeight,
            maxReps: record.maxReps,
            achievedAt: new Date().toISOString()
        }).execute();
    }

    return { success: true };
}