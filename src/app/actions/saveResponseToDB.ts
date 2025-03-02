'use server'
import { db } from "@/db/client";
import { responses } from "@/db/schema/workouts";

export const saveResponseToDB = async (userId: string, content: string) => {
    const truncatedContent = content.length > 500 ? content.substring(0, 500) + "..." : content;
    await db.insert(responses).values({
        userId,
        content: truncatedContent,
    });
};
