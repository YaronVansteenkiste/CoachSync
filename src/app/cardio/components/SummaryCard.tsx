import { Card, CardContent } from "@/components/ui/card";

import { ReactNode } from "react";

export default function SummaryCard({ children }: { children: ReactNode }) {
    return (
        <Card className="w-1/3">
            <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Cardio Activity Summary</h3>
                {children}
            </CardContent>
        </Card>
    );
}
