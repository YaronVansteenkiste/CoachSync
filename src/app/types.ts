import { ReactNode } from "react";

export interface Exercise {
  id: number;
  name: string;
  weight: number | null;
  sets: number;
  reps: number;
  category?: string;
  equipment?: string;
  previousWeight?: number;
}

export interface Workout {
  id: number;
  userId: string | null;
  name: string;
  exercises: Exercise[];
}

export interface Errors {
  [key: number]: string;
}
