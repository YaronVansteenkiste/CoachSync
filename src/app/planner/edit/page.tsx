'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWorkout } from '@/app/actions/fetchWorkout';
import { handleUpdate } from '@/app/actions/handleUpdate';
import { addExercise } from '@/app/actions/addExercise';
import { removeExercise } from '@/app/actions/removeExercise';
import { fetchExercises } from '@/app/actions/fetchExercises';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from "@/lib/auth/client";
import { Exercise, Errors } from '@/app/types';

function EditWorkoutContent() {
  const {
    data: session,
    isPending,
    error,
    refetch
  } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const WORKOUT_NAME = searchParams!.get('day') || 'Monday';
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    async function loadWorkout() {
      if (!session && !isPending) {
        router.push('/auth/login');
        return;
      }

      if (!isPending && session) {
        try {
          const userIdFromDb = session.user?.id;
          setUserId(userIdFromDb);
          const { workoutId, exercisesData } = await fetchWorkout(userIdFromDb, WORKOUT_NAME);
          setWorkoutId(workoutId);
          setExercisesData(exercisesData);
        } catch (error) {
          console.error('Error fetching workout:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadWorkout();

    async function loadExercises() {
      try {
        const exercises = await fetchExercises();
        setAvailableExercises(exercises);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    }
    loadExercises();
  }, [WORKOUT_NAME, session, isPending, router]);

  function handleInputChange(exerciseId: number, field: string, value: string | number) {
    setExercisesData((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, [field]: value } : ex))
    );
  }

  function validateInputs() {
    const newErrors: Errors = {};
    exercisesData.forEach((exercise) => {
      if (exercise.weight === null || exercise.weight === undefined) newErrors[exercise.id] = 'Weight is required';
      if (exercise.sets === null || exercise.sets === undefined) newErrors[exercise.id] = 'Sets are required';
      if (exercise.reps === null || exercise.reps === undefined) newErrors[exercise.id] = 'Reps are required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validateInputs()) return;

    try {
      for (const exercise of exercisesData) {
        await handleUpdate(exercise.id, exercise);
      }
      router.push('/planner');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }

  async function handleAddExercise() {
    if (selectedExerciseId === null) return;

    try {
      const newExercise = await addExercise(workoutId, selectedExerciseId);
      const exerciseDetails = availableExercises.find(ex => ex.id === selectedExerciseId);
      if (exerciseDetails) {
        setExercisesData((prev) => [...prev, { ...newExercise, name: exerciseDetails.name, category: exerciseDetails.category, equipment: exerciseDetails.equipment }]);
      }
      setSelectedExerciseId(null);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  }

  async function handleRemoveExercise(id: number) {
    try {
      await removeExercise(id);
      setExercisesData((prev) => prev.filter((ex) => ex.id !== id));
    } catch (error) {
      console.error('Error removing exercise:', error);
      alert('Failed to remove exercise from the database');
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit {WORKOUT_NAME} Workout</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercisesData.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Category: {exercise.category} | Equipment: {exercise.equipment}</p>
                <div className="mt-2">
                  <label className="block text-sm font-medium">Weight</label>
                  <Input
                    type="number"
                    value={exercise.weight ?? ''}
                    onChange={(e) => handleInputChange(exercise.id, 'weight', e.target.value)}
                  />
                  {errors[exercise.id] && (exercise.weight === null || exercise.weight === undefined || exercise.weight === 0 || exercise.weight === 9) && (
                    <p className="text-red-500 text-sm">{errors[exercise.id]}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium">Sets</label>
                  <Input
                    type="number"
                    value={exercise.sets ?? ''}
                    onChange={(e) => handleInputChange(exercise.id, 'sets', e.target.value)}
                  />
                  {errors[exercise.id] && (exercise.weight === null || exercise.weight === undefined || exercise.weight === 0) && (
                    <p className="text-red-500 text-sm">{errors[exercise.id]}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium">Reps</label>
                  <Input
                    type="number"
                    value={exercise.reps ?? ''}
                    onChange={(e) => handleInputChange(exercise.id, 'reps', e.target.value)}
                  />
                  {errors[exercise.id] && (exercise.weight === null || exercise.weight === undefined || exercise.weight === 0) && (
                    <p className="text-red-500 text-sm">{errors[exercise.id]}</p>
                  )}
                </div>
                <Button onClick={() => handleRemoveExercise(exercise.id)} className="w-full mt-2">
                  Remove Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6">
        <label className="block text-sm font-medium">Add Exercise</label>
        <select
          value={selectedExerciseId ?? ''}
          onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
          className="w-full mt-2"
        >
          <option value="" disabled>Select an exercise</option>
          {availableExercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name} - {exercise.category} - {exercise.equipment}
            </option>
          ))}
        </select>
        <Button onClick={handleAddExercise} className="w-full mt-2">
          Add Exercise
        </Button>
      </div>
      <Button onClick={handleSave} className="w-full mt-4">
        Save & Go Back
      </Button>
    </div>
  );
}

export default function EditWorkoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditWorkoutContent />
    </Suspense>
  );
}