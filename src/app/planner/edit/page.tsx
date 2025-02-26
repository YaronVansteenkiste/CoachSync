'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWorkout } from "@/app/actions/fetchWorkout";
import { handleUpdate } from "@/app/actions/handleUpdate";
import { addExercise } from "@/app/actions/addExercise"; // Import the new action

const USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function EditWorkoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const WORKOUT_NAME = searchParams.get('day') || 'Monday';
    const [workoutId, setWorkoutId] = useState(null);
    const [exercisesData, setExercisesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newExerciseId, setNewExerciseId] = useState(''); // State for new exercise ID

    useEffect(() => {
        async function loadWorkout() {
            try {
                const { workoutId, exercisesData } = await fetchWorkout(USER_ID, WORKOUT_NAME);
                setWorkoutId(workoutId);
                setExercisesData(exercisesData);
            } catch (error) {
                console.error('Error fetching workout:', error);
            } finally {
                setLoading(false);
            }
        }
        loadWorkout();
    }, [WORKOUT_NAME]);

    async function updateExercise(exerciseId, updatedData) {
        try {
            await handleUpdate(exerciseId, updatedData);
            setExercisesData((prev) =>
                prev.map((ex) => (ex.id === exerciseId ? { ...ex, ...updatedData } : ex))
            );
        } catch (error) {
            console.error('Error updating exercise:', error);
        }
    }

    async function handleAddExercise() {
        try {
            const newExercise = await addExercise(workoutId, newExerciseId);
            setExercisesData((prev) => [...prev, newExercise]);
            setNewExerciseId(''); // Clear the input field
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Edit {WORKOUT_NAME} Workout</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                exercisesData.map((exercise) => (
                    <div key={exercise.id} className="space-y-4 border-b pb-4 mb-4">
                        <h2 className="text-lg font-semibold">{exercise.name}</h2>
                        <p className="text-sm text-gray-500">Category: {exercise.category} | Equipment: {exercise.equipment}</p>
                        <div>
                            <label className="block text-sm font-medium">Weight</label>
                            <input
                                type="number"
                                value={exercise.weight ?? ''}
                                onChange={(e) => updateExercise(exercise.id, { weight: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Sets</label>
                            <input
                                type="number"
                                value={exercise.sets ?? ''}
                                onChange={(e) => updateExercise(exercise.id, { sets: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Reps</label>
                            <input
                                type="number"
                                value={exercise.reps ?? ''}
                                onChange={(e) => updateExercise(exercise.id, { reps: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                ))
            )}
            <div className="mt-4">
                <label className="block text-sm font-medium">Add Exercise by ID</label>
                <input
                    type="text"
                    value={newExerciseId}
                    onChange={(e) => setNewExerciseId(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button onClick={handleAddExercise} className="w-full bg-green-500 text-white p-2 rounded mt-2">
                    Add Exercise
                </button>
            </div>
            <button onClick={() => router.push('/planner')} className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                Save & Go Back
            </button>
        </div>
    );
}