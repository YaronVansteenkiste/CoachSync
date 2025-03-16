'use server';
import { db } from '@/db/client'; 
import { user } from '@/db/schema/auth';
import { ranks } from '@/db/schema/ranks';
import { eq, desc, lte, isNotNull, sql } from 'drizzle-orm';

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

    if (rank && rank.length > 0) {
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

    console.log(userRank)
    const nextRank = (userRank && userRank.length > 0)
        ? await db.select().from(ranks).where(eq(ranks.level, userRank[0].level + 1)).limit(1)
        : [];
    console.log(nextRank)
    return { userExperience, userRank, nextRank };
}

async function getLeaderboard() {
    const users = await db.select({
        id: user.id,
        name: user.name,
        image: user.image,
        experience: user.totalExperience,
        rankName: ranks.name,
        rankImage: ranks.image
    })
    .from(user)
    .leftJoin(ranks, eq(user.rankId, ranks.id))
    .where(isNotNull(user.rankId))
    .orderBy(desc(user.totalExperience))
    .limit(20);

    if (!users) {
        throw new Error('No users found on the leaderboard');
    }

    return users;
}

export async function addExperience(userId: string, experience: number) {
    await db.update(user)
        .set({
            totalExperience: sql`${user.totalExperience} + ${experience}`
        })
        .where(eq(user.id, userId));
}

export { calculateRank, getUserData, getLeaderboard };