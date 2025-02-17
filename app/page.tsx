import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {ChartComponent} from "@/app/components/Chart";

export default function Home() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 col-span-2">
                <Card className="dark">
                    <CardHeader>
                        <CardTitle className="my-3 text-center">Welcome back Yaron!</CardTitle>
                        <Avatar className={"mx-auto w-52 h-52"}>
                            <AvatarImage src="https://avatars.githubusercontent.com/u/125354929?v=4"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                </Card>
                <Card className="dark">
                    <CardHeader>
                        <CardTitle>Cardio Progress</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="dark">
                    <CardHeader>
                        <CardTitle>Strongest lift</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="dark">
                    <CardHeader>
                        <CardTitle>Total Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartComponent />
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-1">
                <Card className="dark">
                    <CardHeader>
                        <CardTitle>Today’s Workout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li>Bench Press: 120 kg, 4 sets of 7</li>
                            <li>Incline Dumbbell Press: 40 kg, 3 sets of 12</li>
                            <li>Barbell Rows: 100 kg, 4 sets of 10</li>
                            <li>Bicep Curls: 18 kg, 3 sets of 8</li>
                            <li>Pull-Ups: Bodyweight, 4 sets of 10</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}