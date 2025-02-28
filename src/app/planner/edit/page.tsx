'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWorkout } from "@/app/actions/fetchWorkout";
import { handleUpdate } from "@/app/actions/handleUpdate";
import { addExercise } from "@/app/actions/addExercise";
import { removeExercise } from "@/app/actions/removeExercise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function EditWorkoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const WORKOUT_NAME = searchParams.get('day') || 'Monday';
    const [workoutId, setWorkoutId] = useState(null);
    const [exercisesData, setExercisesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newExerciseId, setNewExerciseId] = useState('');
    const [errors, setErrors] = useState({});

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

    function handleInputChange(exerciseId, field, value) {
        setExercisesData((prev) =>
            prev.map((ex) => (ex.id === exerciseId ? { ...ex, [field]: value } : ex))
        );
    }

    function validateInputs() {
        const newErrors = {};
        exercisesData.forEach((exercise) => {
            if (exercise.weight === '') newErrors[exercise.id] = 'Weight is required';
            if (exercise.sets === '') newErrors[exercise.id] = 'Sets are required';
            if (exercise.reps === '') newErrors[exercise.id] = 'Reps are required';
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
        try {
            const newExercise = await addExercise(workoutId, newExerciseId);
            setExercisesData((prev) => [...prev, newExercise]);
            setNewExerciseId('');
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    }

    async function handleRemoveExercise(id) {
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
                                    {errors[exercise.id] && exercise.weight === '' && (
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
                                    {errors[exercise.id] && exercise.sets === '' && (
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
                                    {errors[exercise.id] && exercise.reps === '' && (
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
                <label className="block text-sm font-medium">Add Exercise by ID</label>
                <Input
                    type="text"
                    value={newExerciseId}
                    onChange={(e) => setNewExerciseId(e.target.value)}
                />
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