import { pgTable, serial, text, integer, real, uuid, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: text("created_at").default("now()"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  intensity: text("intensity").notNull().default("Medium"),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  equipment: text("equipment").notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "cascade" }),
  weight: real("weight"),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
});

export const personalRecords = pgTable("personal_records", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "cascade" }),
  maxWeight: real("max_weight").notNull(),
  maxReps: integer("max_reps").notNull(),
  achievedAt: text("achieved_at").default("now()"),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  weightKg: real("weight_kg").notNull(),
  bodyFatPercentage: real("body_fat_percentage").notNull(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: text("created_at").default("now()"),
});