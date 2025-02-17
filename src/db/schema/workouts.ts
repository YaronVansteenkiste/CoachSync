import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const todos = pgTable("workouts", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar(),
    description: varchar(),
    isDone: boolean(),
    createdAt: timestamp(),
    updatedAt: timestamp(),
});


export type Todo = typeof todos.$inferSelect;