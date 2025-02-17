import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartComponent } from "@/app/components/Chart";

const workouts = [
  "Bench Press: 120 kg, 4 sets of 7",
  "Incline Dumbbell Press: 40 kg, 3 sets of 12",
  "Barbell Rows: 100 kg, 4 sets of 10",
  "Bicep Curls: 18 kg, 3 sets of 8",
  "Pull-Ups: Bodyweight, 4 sets of 10",
];

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
                <CardTitle>{workout.name}</CardTitle>
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
                <img
                  src="https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif"
                  alt="Example Image"
                  className="w-20 h-auto"
                />
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
            {workouts.map((workout, index) => (
              <Card key={index} className="dark:bg-gray-700 my-4">
                <CardContent>{workout}</CardContent>
              </Card>
            ))}
          </CardContent>
          <div className="flex flex-col mx-5">
            <Button className="w-full my-2 w-50">Edit Workout</Button>
          </div>
          <Drawer>
            <div className="flex flex-col mx-5 mb-5">
              <Button className="flex flex-col w-full">
                <DrawerTrigger className="w-full">Start Workout</DrawerTrigger>
              </Button>
            </div>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Workout 1 - Bench Press</DrawerTitle>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Set 1:</span>
                    <Input type="number" value={120} className="w-20" />
                    <span>kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Set 2:</span>
                    <Input type="number" value={120} className="w-20" />
                    <span>kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Set 3:</span>
                    <Input type="number" value={120} className="w-20" />
                    <span>kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Set 4:</span>
                    <Input type="number" value={120} className="w-20" />
                    <span>kg</span>
                  </div>
                </div>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Next</Button>
                <DrawerClose>
                  <Button variant="outline">Stop</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Card>
      </div>
    </div>
  );
}
