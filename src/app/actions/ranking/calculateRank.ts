'use server';
import { db } from '@/db/client'; 
import { user } from '@/db/schema/auth';
import { ranks, challenges } from '@/db/schema/challenges';
import { eq, desc, lte } from 'drizzle-orm';

async function calculateRank(userId: String) {
    const userRecord = await db.select().from(user).where(eq(user.id, userId.toString()));
    if (!userRecord || userRecord.length === 0) {
        throw new Error('User not found');
    }

    const userExperience = userRecord[0].totalExperience;

    const rank = await db.select()
        .from(ranks)
        .where(lte(ranks.requiredXp, userExperience))
        .orderBy(desc(ranks.requiredXp))
        .limit(1);

    if (rank.length > 0) {
        await db.update(user)
            .set({ rankId: rank[0].id })
            .where(eq(user.id, userId.toString()));
    } else if (userRecord[0].rankId === null) {
        await db.update(user)
            .set({ rankId: 1 })
            .where(eq(user.id, userId.toString()));
    }
}

async function getUserData(userId: string) {
    const userRecord = await db.select().from(user).where(eq(user.id, userId));
    console.log(userRecord)
    if (!userRecord || userRecord.length === 0) {
        throw new Error('User not found');
    }
    const userExperience = userRecord[0].totalExperience;


    const userRank = userRecord[0].rankId !== null
        ? await db.select().from(ranks).where(eq(ranks.id, userRecord[0].rankId))
        : [];


    const nextRank = userRank.length > 0
        ? await db.select().from(ranks).where(eq(ranks.level, userRank[0].level + 1)).limit(1)
        : [];

    const challengesList = await db.select().from(challenges);

    return { userExperience, userRank, nextRank, challengesList };
}

export { calculateRank, getUserData };