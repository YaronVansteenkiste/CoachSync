import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Activity {
    type: string;
    distance: number;
    time: string;
    date: string;
}

interface RecentActivitiesProps {
    recentActivities: Activity[];
}

export default function RecentActivities({ recentActivities }: RecentActivitiesProps) {
    return (
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
    );
}
