import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartComponent } from "@/app/components/Chart";

export default function TotalProgressCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartComponent />
      </CardContent>
    </Card>
  );
}
