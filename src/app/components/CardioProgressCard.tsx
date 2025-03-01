import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cardio } from "../data";

export default function CardioProgressCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cardio Progress</CardTitle>
        <>
          {cardio.map((workout, index) => (
            <Card key={index} className="dark:bg-gray-700 my-4">
              <CardTitle className="text-center">{workout.name}</CardTitle>
              <CardContent>
                <p>{workout.distance}</p>
                {workout?.time && <p>{workout.time}</p>}
              </CardContent>
            </Card>
          ))}
        </>
      </CardHeader>
    </Card>
  );
}
