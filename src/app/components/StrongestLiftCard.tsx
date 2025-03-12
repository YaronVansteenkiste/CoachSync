import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPersonalRecords } from '@/app/actions/getPersonalRecords';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Exercise {
  id: number;
  name: string;
  weight: number | null;
  image: string; 
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
          weight: records[0].maxWeight,
          image: records[0].exerciseImage 
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
          <div className="text-center">
            <h3 className="text-xl font-bold">{strongestLift.name}</h3>
            <motion.p 
              className="mt-4 text-4xl font-extrabold text-blue-500"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 0.5, yoyo: Infinity }}
            >
              {strongestLift.weight} kg
            </motion.p>
            <Image src={strongestLift.image} alt={strongestLift.name} width={200} height={200} className="mt-4 mx-auto rounded-lg" />
          </div>
        ) : (
          <p>No personal records set</p>
        )}
      </CardContent>
    </Card>
  );
}
