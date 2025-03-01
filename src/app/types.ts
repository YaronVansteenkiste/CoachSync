export interface Exercise {
  id: number;
  name: string;
  weight: number | null;
  sets: number;
  reps: number;
  previousWeight?: number;
}

export interface Workout {
  id: number;
  userId: string | null;
  name: string;
  createdAt: string | null;
  durationMinutes: number;
  intensity: string;
  exercises: Exercise[];
}
