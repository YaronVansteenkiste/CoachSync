'use client';
import React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWorkout } from '@/app/actions/workouts/fetchWorkout';
import { handleUpdateExercise } from '@/app/actions/exercises/handleUpdateExercise';
import { addExercise } from '@/app/actions/exercises/addExercise';
import { removeExercise } from '@/app/actions/exercises/removeExercise';
import { fetchExercises } from '@/app/actions/exercises/fetchExercises';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from "@/lib/auth/client";
import { Exercise, Errors } from '@/lib/types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

function DraggableCard({ exercise, index, moveCard, handleInputChange, handleRemoveExercise, errors }: { exercise: Exercise, index: number, moveCard: (dragIndex: number, hoverIndex: number) => void, handleInputChange: (id: number, field: string, value: string | number) => void, handleRemoveExercise: (id: number) => void, errors: Errors }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<{ id: number; index: number }, void, { handlerId: string | symbol }>({
    accept: ItemTypes.CARD,
    collect: (monitor) => {
      const handlerId = monitor.getHandlerId();
      return {
        handlerId: handlerId as string | symbol,
      };
    },
    hover(item, monitor) {
      if (!ref.current || item.id === undefined || item.index < 0) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: exercise.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Card key={exercise.id} ref={ref} style={{ opacity: isDragging ? 0.5 : 1, height: 'auto' }} data-handler-id={handlerId}>
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
            min="0"
            onMouseDown={(e) => e.stopPropagation()}
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
            min="0"
            onMouseDown={(e) => e.stopPropagation()}
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
            min="0"
            onMouseDown={(e) => e.stopPropagation()}
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
  );
}

function AddExerciseCard({ exercise, handleAddExercise }: { exercise: Exercise, handleAddExercise: (exerciseId: number) => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: exercise.id, index: -1 },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ added?: boolean }>();
      if (item && (!dropResult || !dropResult.added)) {
        handleAddExercise(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} style={{ opacity: isDragging ? 0.5 : 1, height: 'auto' }}>
      <Card key={exercise.id} className="p-2 mt-2">
        <CardHeader>
          <CardTitle className="text-sm">{exercise.name}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

function EmptyDropZone({ handleAddExercise }: { handleAddExercise: (exerciseId: number) => void }) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: { id: number }) => {
      handleAddExercise(item.id);
      return { added: true }; // Return a result indicating the drop was handled
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`border-2 border-dashed ${isOver ? 'border-blue-500' : 'border-gray-300'} h-64 flex items-center justify-center`}>
      <p className="text-gray-500">Drag exercises here to add them to your workout</p>
    </div>
  );
}

function EditWorkoutContent({ params }: { params: { day: string } }) {
  const {
    data: session,
    isPending,
    error,
    refetch
  } = authClient.useSession();
  const router = useRouter();
  const [WORKOUT_NAME, setWORKOUT_NAME] = useState<string>('');
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [workoutId, setWorkoutId] = useState<number | null>(null);
  const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setWORKOUT_NAME(unwrappedParams.day);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const loadWorkout = async () => {
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
    };

    if (WORKOUT_NAME) {
      loadWorkout();
    }

    const loadExercises = async () => {
      try {
        const exercises = await fetchExercises();
        setAvailableExercises(exercises);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    loadExercises();
  }, [WORKOUT_NAME, session, isPending, router]);

  function handleInputChange(exerciseId: number, field: string, value: string | number) {
    const numericValue = value === '' ? 0 : Math.max(0, Number(value));
    setExercisesData((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, [field]: numericValue } : ex))
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
        await handleUpdateExercise(exercise.id, exercise);
      }
      router.push('/planner');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }

  async function handleAddExercise(exerciseId: number) {
    if (workoutId === null) {
      console.error('Workout ID is null');
      return;
    }
    try {
      const newExercise = await addExercise(workoutId, exerciseId);
      const exerciseDetails = availableExercises.find(ex => ex.id === exerciseId);
      if (exerciseDetails) {
        setExercisesData((prev) => [...prev, { ...newExercise, name: exerciseDetails.name, category: exerciseDetails.category, equipment: exerciseDetails.equipment }]);
      }
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

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = exercisesData[dragIndex];
    setExercisesData((prev) => {
      const updated = [...prev];
      updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragCard);
      return updated;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit {WORKOUT_NAME} Workout</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercisesData.length === 0 ? (
                <EmptyDropZone handleAddExercise={handleAddExercise} />
              ) : (
                exercisesData.map((exercise, index) => (
                  <DraggableCard
                    key={exercise.id}
                    index={index}
                    exercise={exercise}
                    moveCard={moveCard}
                    handleInputChange={handleInputChange}
                    handleRemoveExercise={handleRemoveExercise}
                    errors={errors}
                  />
                ))
              )}
            </div>
            <div className="lg:col-span-1 lg:h-full">
              <h2 className="text-xl font-bold mb-4">Add Exercise</h2>
              <div className="overflow-y-auto max-h-80 lg:h-full">
              {availableExercises.map((exercise) => (
                <AddExerciseCard
                key={exercise.id}
                exercise={exercise}
                handleAddExercise={handleAddExercise}
                />
              ))}
              </div>
            </div>
          </div>
        )}
        <Button onClick={handleSave} className="w-full mt-4">
          Save & Go Back
        </Button>
      </div>
    </DndProvider>
  );
}

export default function EditWorkoutPage({ params }: { params: Promise<{ day: string }> }) {
  const unwrappedParams = React.use(params);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditWorkoutContent params={unwrappedParams} />
    </Suspense>
  );
}