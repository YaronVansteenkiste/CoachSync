import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface TotalDistances {
    Run: number;
    Swim: number;
    Ride: number;
}

export default function ActivityTable({ totalDistances }: { totalDistances: TotalDistances }) {
    return (
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
    );
}
