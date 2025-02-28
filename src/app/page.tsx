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

const cardio = [
  {
    name: "Biggest Ride",
    distance: "25 km",
  },
  {
    name: "Fastest Run",
    distance: "5 km",
    time: "20:00",
  },
  {
    name: "Longest Swim",
    distance: "1 km",
  },
];

export default function Home() {
  const userId = "550e8400-e29b-41d4-a716-446655440000";
  const [workoutWithExercises, setWorkoutWithExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(null);

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

  const refreshWorkoutRoutine = async () => {
    const data = await fetchWorkoutData(userId);
    setWorkoutWithExercises(data);
    if (data.length > 0) {
      setCurrentExercise(data[0].exercises[0]);
    }
  };

  const handleWeightChange = (weight) => {
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

    if (parseFloat(weight) > currentExercise.weight) {
      toast.success(`New PR is HIT! You have lifted ${weight}kg, which is a new personal record!`);
    }
  };

  const handleRepsChange = (reps) => {
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
  };

  const handleNext = async () => {
    await updateWorkoutExercise(currentExercise.id, {
      weight: currentExercise.weight,
      reps: currentExercise.reps,
    });

    const currentWorkout = workoutWithExercises[currentExerciseIndex];
    const nextExerciseIndex = currentWorkout.exercises.indexOf(currentExercise) + 1;

    if (nextExerciseIndex < currentWorkout.exercises.length) {
      setCurrentExercise(currentWorkout.exercises[nextExerciseIndex]);
    } else if (currentExerciseIndex < workoutWithExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentExercise(workoutWithExercises[currentExerciseIndex + 1].exercises[0]);
    } else {
      alert("Workout complete!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="my-3 text-center">
              Welcome back Yaron!
            </CardTitle>
            <Avatar className={"mx-auto w-52 h-52"}>
              <AvatarImage src="https://avatars.githubusercontent.com/u/125354929?v=4" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cardio Progress</CardTitle>
            <>
              {cardio.map((workout, index) => (
                <Card key={index} className="dark:bg-gray-700 my-4">
                  <CardTitle className="text-center">{workout.name}</CardTitle>
                  <CardContent>
                    <p>{workout.distance}</p>
                    {workout?.time && <p>{workout.time}</p>}
                  </CardContent>
                </Card>
              ))}
            </>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Strongest lift</CardTitle>
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Bench Press</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-4">You are stronger than 70% of users.</p>
              </CardContent>
            </Card>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Today’s Workout</CardTitle>
          </CardHeader>
          <CardContent>
            {workoutWithExercises.length > 0 ? (
              workoutWithExercises.map((workout) => (
                <Card key={workout.id} className="dark:bg-gray-700 my-4">
                  <CardContent>
                    <p className="font-bold">{workout.name}</p>
                    {workout.exercises.map((exercise) => (
                      <p key={exercise.id}>
                        {exercise.name}: {exercise.weight}kg {exercise.sets} sets of {exercise.reps} reps
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No workout found for today.</p>
            )}
          </CardContent>
          <div className="flex flex-col mx-5">
            <Button className="w-full my-2 w-50">Edit Workout</Button>
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
                      value={currentExercise ? currentExercise.weight : ""}
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
                      onChange={(e) => handleRepsChange(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              </DrawerHeader>
              <DrawerFooter>
                <Button onClick={handleNext}>Next</Button>
                <DrawerClose asChild>
                  <Button>Stop</Button>
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