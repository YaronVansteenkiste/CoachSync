import { Card, CardContent } from "@/components/ui/card";
import { ChartComponent } from "@/app/components/Chart";
import ActivityTable from "./components/ActivityTable";
import SummaryCard from "./components/SummaryCard";
import RecentActivities from "./components/RecentActivities";

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
                <ActivityTable totalDistances={totalDistances} />
                <SummaryCard>
                    <ChartComponent />
                </SummaryCard>
            </div>
            <RecentActivities recentActivities={recentActivities} />
        </div>
    );
}
