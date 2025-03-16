'use server'
import { user} from '@/db/schema/auth';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';


export const changeProfilePic = async (userId: string, image: string) => {
    await db
    .update(user)
    .set({image: image})
    .where(eq(user.id, userId));
}