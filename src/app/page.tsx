'use client'
import { createOrUpdatePersonalRecord } from "@/app/actions/getPersonalRecords";
import RecentResponses from '@/components/home/recent-responses';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { fetchWorkoutData } from "./actions/fetchWorkoutData";
import { getExerciseIdByName } from "./actions/getWorkoutExercises";
import { updateWorkoutExercise } from "./actions/updateWorkoutExercise";
import StrongestLiftCard from "@/components/home/strongest-lift";
import TotalProgressCard from "@/components/home/total-progress";
import WelcomeCard from "@/components/home/welcome-card";
import { Exercise, Workout } from "../lib/types";
import { BedSingle } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [workoutWithExercises, setWorkoutWithExercises] = useState<Workout[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [tempWeight, setTempWeight] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [permission, setPermission] = useState<NotificationPermission>();
  const [isRestDay, setIsRestDay] = useState(false);

  useEffect(() => {
    if (!session && !isPending) {
      router.push('/auth/login');
      return;
  }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    async function fetchData() {
      if (!isPending && session && session.user) {
        try {
          const data = await fetchWorkoutData(session.user.id);
          setWorkoutWithExercises(data);
          if (data.length > 0 && data[0].exercises.length > 0) {
            setCurrentExercise(data[0].exercises[0]);
            setTempWeight(data[0].exercises[0].weight?.toString() || '');
            setTempReps(data[0].exercises[0].reps?.toString() || '');
            setIsRestDay(false);
          } else {
            setIsRestDay(true);
          }
        } catch (error) {
          console.error("Failed to fetch workout data:", error);
          toast.error("Failed to fetch workout data. Please try again later.");
        }
      }
    }
    fetchData();
  }, [isPending, session, router]);

  useEffect(() => {
    if (currentExercise) {
      setTempWeight(currentExercise!.weight!.toString());
      setTempReps(currentExercise.reps.toString());
    }
  }, [currentExercise]);

  useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  async function requestPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      console.log(permission);
      setPermission(permission);
    }
  }

  async function sendNotification(message: string) {
    if (typeof window !== "undefined" && "Notification" in window && permission === "granted") {
      new Notification(message);
      console.log("Notification sent");
    }
  }

  const handleNext = async () => {
    if (currentExercise) {
      const updatedExercise = {
        ...currentExercise,
        weight: parseFloat(tempWeight) || currentExercise.weight,
        reps: parseInt(tempReps) || currentExercise.reps
      };

      await updateWorkoutExercise(currentExercise.id, {
        weight: updatedExercise.weight,
        reps: updatedExercise.reps,
      });

      const exerciseId = await getExerciseIdByName(currentExercise.name);

      await createOrUpdatePersonalRecord({
        userId: session!.user?.id || '',
        exerciseId: exerciseId,
        maxWeight: updatedExercise.weight,
        maxReps: updatedExercise.reps,
      });

      if (updatedExercise!.weight! > (currentExercise.previousWeight || 0)) {
        const message = `New PR HIT! ${updatedExercise.weight}kg is a new record!`;
        toast.success(message);
        sendNotification(message);
      }

      const currentWorkout = workoutWithExercises[currentExerciseIndex];
      const nextExerciseIndex = currentWorkout.exercises.indexOf(currentExercise) + 1;

      if (nextExerciseIndex < currentWorkout.exercises.length) {
        setCurrentExercise(currentWorkout.exercises[nextExerciseIndex]);
      } else if (currentExerciseIndex < workoutWithExercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentExercise(workoutWithExercises[currentExerciseIndex + 1].exercises[0]);
      } else {
        toast.success("Workout complete!");
        document.getElementById("stop-btn")?.click();
      }
    }
  };

  const handleEditWorkout = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    router.push(`/planner/edit/${currentDay}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 col-span-2">
        <WelcomeCard userName={session?.user?.name || 'User'} image={session?.user?.image || 'STANDARD'} />
        <StrongestLiftCard userId={session?.user?.id || ''} />
        <Card className="w-full h-full">
          <CardHeader>
            <h2 className="text-2xl font-bold">Recent Responses</h2>
          </CardHeader>
          <CardContent>
            <RecentResponses userId={session?.user?.id || ''} />
          </CardContent>
        </Card>
        <TotalProgressCard userId={session?.user?.id || ''} />
      </div>
      <div className="col-span-1 md:row-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Today’s Workout</CardTitle>
          </CardHeader>
          <CardContent>
            {isRestDay ? (
              <div className="flex flex-col items-center justify-center h-full">
                <BedSingle  />
                <p className="text-2xl font-bold">Rest day</p>
                <p className="text-lg text-gray-500">Take it easy and recover!</p>
              </div>
            ) : workoutWithExercises.length > 0 ? (
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
                <Button className="flex flex-col w-full" onClick={requestPermission}>Start Workout</Button>
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
                      value={tempWeight}
                      onChange={(e) => setTempWeight(e.target.value)}
                      className="w-20"
                    />
                    <span>kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Reps:</span>
                    <Input
                      type="number"
                      value={tempReps}
                      onChange={(e) => setTempReps(e.target.value)}
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