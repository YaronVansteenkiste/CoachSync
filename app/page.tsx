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
                <Card className="dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle>Welcome back Yaron!</CardTitle>
                        <Avatar className={"mx-auto w-52 h-52"}>
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardHeader>
                </Card>
                <Card className="dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle>Cardio Progress</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle>Strongest lift</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle>Total Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartComponent />
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-1">
                <Card className="dark:bg-gray-800 h-full">
                    <CardHeader>
                        <CardTitle>Today’s Workout</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}