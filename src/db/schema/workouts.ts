import { pgTable, serial, text, integer, real, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), 
  createdAt: text("created_at").default('now()'),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), 
});

export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "cascade" }),
  weight: real("weight"),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
});