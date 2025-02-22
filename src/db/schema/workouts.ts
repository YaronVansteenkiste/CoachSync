import { pgTable, serial, text, integer, real, uuid } from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default("now()"),
  lastLogin: text("last_login"),
});

// Workouts Table (Added Duration & Intensity)
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: text("created_at").default("now()"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  intensity: text("intensity").notNull().default("Medium"), // Low, Medium, High
});

// Exercises Table (Added Category & Equipment)
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(), // Chest, Legs, Back, etc.
  equipment: text("equipment").notNull(), // Barbell, Dumbbell, Machine, etc.
});

// Workout Exercises Table (Tracking Sets, Reps, and Weights)
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "cascade" }),
  weight: real("weight"),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
});

// Personal Records Table (Tracking PRs)
export const personalRecords = pgTable("personal_records", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "cascade" }),
  maxWeight: real("max_weight").notNull(),
  maxReps: integer("max_reps").notNull(),
  achievedAt: text("achieved_at").default("now()"),
});

// Progress Tracking Table (Tracking Weight & Body Fat % Over Time)
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  weightKg: real("weight_kg").notNull(),
  bodyFatPercentage: real("body_fat_percentage").notNull(),
});
