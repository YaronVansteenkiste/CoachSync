'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartComponent } from "@/app/components/Chart";
import { fetchWorkoutData } from "./actions/fetchWorkoutData";
import { updateWorkoutExercise } from "./actions/updateWorkoutExercise";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createOrUpdatePersonalRecord } from "@/app/actions/getPersonalRecords";
import { getExerciseIdByName } from "./actions/getWorkoutExercises";
import { Exercise, Workout } from "./types";
import WelcomeCard from "./components/WelcomeCard";
import StrongestLiftCard from "./components/StrongestLiftCard";
import TotalProgressCard from "./components/TotalProgressCard";
import RecentResponses from '@/components/RecentResponses';

export default function Home() {
  const userId = "550e8400-e29b-41d4-a716-446655440000";
  const [workoutWithExercises, setWorkoutWithExercises] = useState<Workout[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const data = await fetchWorkoutData(userId);
      setWorkoutWithExercises(data);
      if (data.length > 0) {
        setCurrentExercise(data[0].exercises[0]);
      }
    }
    fetchData();
  }, [userId]);

  const handleWeightChange = (weight: string) => {
    if (currentExercise) {
      const updatedExercise = { ...currentExercise, weight: parseFloat(weight) };
      setCurrentExercise(updatedExercise);

      const updatedWorkoutWithExercises = workoutWithExercises.map((workout, index) => {
        if (index === currentExerciseIndex) {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) =>
              exercise.id === currentExercise.id ? updatedExercise : exercise
            ),
          };
        }
        return workout;
      });

      setWorkoutWithExercises(updatedWorkoutWithExercises);
    }
  };

  const handleRepsChange = (reps: number) => {
    if (currentExercise) {
      const updatedExercise = { ...currentExercise, reps };
      setCurrentExercise(updatedExercise);

      const updatedWorkoutWithExercises = workoutWithExercises.map((workout, index) => {
        if (index === currentExerciseIndex) {
          return {
            ...workout,
            exercises: workout.exercises.map((exercise) =>
              exercise.id === currentExercise.id ? updatedExercise : exercise
            ),
          };
        }
        return workout;
      });

      setWorkoutWithExercises(updatedWorkoutWithExercises);
    }
  };

  const handleNext = async () => {
    if (currentExercise) {
      await updateWorkoutExercise(currentExercise.id, {
        weight: currentExercise.weight,
        reps: currentExercise.reps,
      });

      const exerciseId = await getExerciseIdByName(currentExercise.name);

      await createOrUpdatePersonalRecord({
        userId: userId, 
        exerciseId: exerciseId,
        maxWeight: currentExercise.weight,
        maxReps: currentExercise.reps,
      });

      if (currentExercise.weight !== null && currentExercise.weight > (currentExercise.previousWeight || 0)) {
        toast.success(`New PR HIT! ${currentExercise.weight}kg is a new record!`);
      }

      const currentWorkout = workoutWithExercises[currentExerciseIndex];
      const nextExerciseIndex = currentWorkout.exercises.indexOf(currentExercise) + 1;

      if (nextExerciseIndex < currentWorkout.exercises.length) {
        setCurrentExercise(currentWorkout.exercises[nextExerciseIndex]);
      } else if (currentExerciseIndex < workoutWithExercises.length - 1) {
        const nextWorkoutIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextWorkoutIndex);
        setCurrentExercise(workoutWithExercises[nextWorkoutIndex].exercises[0]);
      } else {
        toast.success("Workout complete!");
        document.getElementById("stop-btn")?.click();
      }
    }
  };

  const handleEditWorkout = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    router.push(`/planner/edit?day=${currentDay}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 col-span-2">
        <WelcomeCard/>
        <StrongestLiftCard  />
        <Card className="w-full h-full">
          <CardHeader>
            <h2 className="text-2xl font-bold">Recent Responses</h2>
          </CardHeader>
          <CardContent>
            <RecentResponses userId="550e8400-e29b-41d4-a716-446655440000" />
          </CardContent>
        </Card>
        <TotalProgressCard userId={userId} />
      </div>
      <div className="col-span-1 md:row-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Today’s Workout</CardTitle>
          </CardHeader>
          <CardContent>
            {workoutWithExercises.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercise</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Sets</TableHead>
                    <TableHead>Reps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workoutWithExercises.flatMap((workout) =>
                    workout.exercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>{exercise.name}</TableCell>
                        <TableCell>{exercise.weight}kg</TableCell>
                        <TableCell>{exercise.sets}</TableCell>
                        <TableCell>{exercise.reps}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              <p>No workout found for today.</p>
            )}
          </CardContent>
          <div className="flex flex-col mx-5">
            <Button className="w-full my-2 w-50" onClick={handleEditWorkout}>Edit Workout</Button>
          </div>
          <Drawer>
            <div className="flex flex-col mx-5 mb-5">
              <DrawerTrigger asChild>
                <Button className="flex flex-col w-full">Start Workout</Button>
              </DrawerTrigger>
            </div>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {currentExercise ? `${currentExercise.name}` : "Loading..."}
                </DrawerTitle>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Weight:</span>
                    <Input
                        type="number"
                        value={currentExercise && currentExercise.weight !== null ? currentExercise.weight : ""}
                        onChange={(e) => handleWeightChange(e.target.value)}
                        className="w-20"
                    />
                    <span>kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Reps:</span>
                    <Input
                      type="number"
                      value={currentExercise ? currentExercise.reps : ""}
                      onChange={(e) => handleRepsChange(parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
              </DrawerHeader>
              <DrawerFooter>
                <Button onClick={handleNext}>Next</Button>
                <DrawerClose asChild>
                  <Button id="stop-btn">Stop</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}