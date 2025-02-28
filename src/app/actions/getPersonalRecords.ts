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

export async function createOrUpdatePersonalRecord(record: {
    exerciseId: any;
    maxReps: number;
    maxWeight: number | null;
    userId: string
}) {
    const parsedExerciseId = Number(record.exerciseId);

    if (isNaN(parsedExerciseId)) {
        throw new Error("Invalid exerciseId. Must be a number.");
    }

    const existingRecord = await db
        .select()
        .from(personalRecords)
        .where(and(eq(personalRecords.exerciseId, parsedExerciseId), eq(personalRecords.userId, record.userId)))
        .limit(1)
        .then(records => records[0]);

    if (existingRecord) {
        await db.update(personalRecords)
            .set({
                maxWeight: Math.max(record.maxWeight ?? 0, existingRecord.maxWeight ?? 0),
                maxReps: Math.max(record.maxReps, existingRecord.maxReps),
                achievedAt: new Date().toISOString()
            })
            .where(eq(personalRecords.id, existingRecord.id))
            .execute();
    } else {
        await db.insert(personalRecords).values({
            exerciseId: parsedExerciseId,
            maxWeight: record.maxWeight ?? 0,
            maxReps: record.maxReps,
            achievedAt: new Date().toISOString()
        }).execute();
    }

    return { success: true };
}