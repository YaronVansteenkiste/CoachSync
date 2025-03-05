import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPersonalRecords } from '@/app/actions/getPersonalRecords';

interface Exercise {
  id: number;
  name: string;
  weight: number | null;
}

export default function StrongestLiftCard({ userId }: { userId: string }) {
  const [strongestLift, setStrongestLift] = useState<Exercise | null>(null);

  useEffect(() => {
    async function fetchRecords() {
        const records = await getPersonalRecords(userId);
        if (records.length === 0) {
            setStrongestLift(null);
            return;
        }
        records.sort((a, b) => b.maxWeight - a.maxWeight);
        setStrongestLift({
          id: records[0].id,
          name: records[0].exerciseName,
          weight: records[0].maxWeight
        });
    }

    fetchRecords();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strongest Lift</CardTitle>
      </CardHeader>
      <CardContent>
        {strongestLift ? (
          <div>
            <h3 className="text-xl font-bold">{strongestLift.name}</h3>
            <p className="mt-4">Weight: {strongestLift.weight} kg</p>
          </div>
        ) : (
          <p>No personal records set</p>
        )}
      </CardContent>
    </Card>
  );
}
