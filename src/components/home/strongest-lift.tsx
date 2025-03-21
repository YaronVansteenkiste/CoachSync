import { getPersonalRecords } from '@/app/actions/personal-records/getPersonalRecords';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Exercise {
  id: number;
  name: string;
  weight: number | null;
  image: string;
}

export default function StrongestLiftCard({ userId }: { userId: string }) {
  const [strongestLift, setStrongestLift] = useState<Exercise | null>(null);
  const router = useRouter();

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
        weight: records[0].maxWeight,
        image: records[0].exerciseImage
      });
    }

    fetchRecords();
  }, [userId]);

  const navigateToStrength = () => {
    router.push('/strength');
  };

  return (
    <Card className="w-full max-w-screen-md mx-auto px-4">
      <CardHeader>
        <CardTitle>Strongest Lift</CardTitle>
      </CardHeader>
      <CardContent>
        {strongestLift ? (
          <div className="text-center">
            <h3 className="text-xl font-bold">{strongestLift.name}</h3>
            <p className="mt-4 text-4xl font-extrabold text-blue-300 text-generate-effect">
              {strongestLift.weight} kg
            </p>
            <div className="flex justify-center mt-4">
              <Image
                src={strongestLift.image}
                alt={strongestLift.name}
                width={300}
                height={300}
                className="w-auto max-h-[300px] rounded sm:max-h-[200px] sm:w-[200px] max-w-full"
              />
            </div>
          </div>
        ) : (
          <p>No personal records set</p>
        )}
        <div className="flex justify-center">
          <Button className="w-full my-2 w-50" onClick={navigateToStrength}>Check your strengths</Button>
        </div>
      </CardContent>
    </Card>
  );
}