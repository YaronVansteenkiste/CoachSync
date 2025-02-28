import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChartComponent } from "@/app/components/Chart";

const recentActivities = [
    { type: "Run", distance: 10.2, time: "45:30", date: "2025-02-16" },
    { type: "Swim", distance: 1.5, time: "30:10", date: "2025-02-15" },
    { type: "Ride", distance: 25.4, time: "1:15:20", date: "2025-02-14" },
    { type: "Run", distance: 5.3, time: "28:45", date: "2025-02-13" },
];

const totalDistances = {
    Run: recentActivities.filter(a => a.type === "Run").reduce((sum, a) => sum + a.distance, 0),
    Swim: recentActivities.filter(a => a.type === "Swim").reduce((sum, a) => sum + a.distance, 0),
    Ride: recentActivities.filter(a => a.type === "Ride").reduce((sum, a) => sum + a.distance, 0),
};

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-4xl font-bold">Cardio Dashboard</h1>

            <div className="flex gap-6">
                <Card className="flex-1">
                    <CardContent className="p-4">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Distance (km)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Run</TableCell>
                            <TableCell>{totalDistances.Run} km</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Swim</TableCell>
                            <TableCell>{totalDistances.Swim} km</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ride</TableCell>
                            <TableCell>{totalDistances.Ride} km</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                    </CardContent>
                </Card>

                <Card className="w-1/3">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-4">Cardio Activity Summary</h3>
                        <ChartComponent />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Distance (km)</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentActivities.map((activity, index) => (
                                <TableRow key={index}>
                                    <TableCell>{activity.type}</TableCell>
                                    <TableCell>{activity.distance}</TableCell>
                                    <TableCell>{activity.time}</TableCell>
                                    <TableCell>{activity.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
