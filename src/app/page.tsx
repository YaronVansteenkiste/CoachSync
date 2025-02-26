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
import { Input } from "@/components/ui/input"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartComponent } from "@/app/components/Chart";
import { getTodaysWorkout } from "./actions/getTodaysWorkout";
import { getTodaysExercises } from "./actions/getTodaysExercises";


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

export default async function Home() {
  const userId = "550e8400-e29b-41d4-a716-446655440000";
  const todaysWorkout = await getTodaysWorkout(userId);

  const workoutWithExercises = await Promise.all(
    todaysWorkout.map(async (workout) => ({
      ...workout,
      exercises: await getTodaysExercises(workout.id),
    }))
  );

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
            {cardio.map((workout, index) => (
              <Card key={index} className="dark:bg-gray-700 my-4">
                <CardTitle className="text-center">{workout.name}</CardTitle>
                <CardContent>
                  <p>{workout.distance}</p>
                  {workout.time && <p>{workout.time}</p>}
                </CardContent>
              </Card>
            ))}
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
                <DrawerTitle>Workout 1 - Bench Press</DrawerTitle>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>Set {index + 1}:</span>
                      <Input type="number" defaultValue={120} className="w-20" />
                      <span>kg</span>
                    </div>
                  ))}
                </div>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Next</Button>
                <DrawerClose asChild>
                  <Button>Stop</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Card>
      </div>

    </div>
  );
}
