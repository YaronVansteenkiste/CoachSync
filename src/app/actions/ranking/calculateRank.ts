'use server';
import { db } from '@/db/client'; 
import { user } from '@/db/schema/auth';
import { ranks } from '@/db/schema/challenges';
import { eq, desc, lte, isNotNull } from 'drizzle-orm';

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

    return { userExperience, userRank, nextRank };
}

async function getLeaderboard() {
    const users = await db.select({
        id: user.id,
        name: user.name,
        experience: user.totalExperience,
        rankName: ranks.name
    })
    .from(user)
    .leftJoin(ranks, eq(user.rankId, ranks.id))
    .where(isNotNull(user.rankId))
    .orderBy(desc(user.totalExperience))
    .limit(20);
    return users;
}

export { calculateRank, getUserData, getLeaderboard };