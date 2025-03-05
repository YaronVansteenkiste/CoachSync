'use server';

import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { eq, desc } from "drizzle-orm";

export const getUserId = async (email: string) => {
  const userDb = await db.select().from(user).where(eq(user.email, email)).then(users => users[0]);
  return userDb.id;
};