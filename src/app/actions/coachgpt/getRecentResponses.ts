'use server'
import { db } from "@/db/client";
import { responses } from "@/db/schema/workouts";
import {eq, desc} from 'drizzle-orm';

export const getRecentResponses = async (userId: string, limit: number = 5) => {
    const recentResponses = await db.select().from(responses)
        .where(eq(responses.userId, userId))
        .orderBy(desc(responses.createdAt))
        .limit(limit);
    return recentResponses;
};
