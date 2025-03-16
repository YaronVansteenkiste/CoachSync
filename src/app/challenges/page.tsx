'use client'
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calculateRank, getUserData } from "@/app/actions/ranking/calculateRank";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const {
    data: session,
    isPending,
    error,
    refetch
  } = authClient.useSession();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userExperience, setUserExperience] = useState<number>(0);
  const [userRank, setUserRank] = useState<any[]>([]);
  const [nextRank, setNextRank] = useState<any[]>([]);
  const [challengesList, setChallengesList] = useState<any[]>([]);
  const [rankIdIsNull, setRankIdIsNull] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session && !isPending) {
        router.push('/auth/login');
        return;
      }

      if (session?.user?.id) {
        const userId = session.user.id;
        setUserId(userId);

        if (typeof userId === 'string') {
          await calculateRank(userId);
        } else {
          console.error('User ID is not a string:', userId);
        }

        const { userExperience, userRank, nextRank, challengesList } = await getUserData(userId);
        setUserExperience(userExperience);
        setUserRank(userRank);
        setNextRank(nextRank);
        setChallengesList(challengesList);
      }
    };

    fetchData();
  }, [session]);

  if (rankIdIsNull) {
    alert("Oh hi it's your first time!");
    return null;
  }

  const currentLevelXp = userRank[0]?.requiredXp || 0;
  const nextLevelXp = nextRank[0]?.requiredXp || 1;
  const isMaxLevel = nextRank.length === 0;
  const progressValue = isMaxLevel ? 100 : ((userExperience - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Challenges Dashboard</h1>

      <Card className="shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Current Level: {userRank[0]?.name}</h2>
          <span className="text-sm text-gray-500">
            {isMaxLevel ? "Max Level" : `Experience required till ${nextRank[0]?.name}`}
          </span>
        </div>
        <Progress value={progressValue} max={100} className={`my-4 ${isMaxLevel ? 'bg-gold' : ''}`} />
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">0%</span>
          <span className="text-sm text-gray-500">{isMaxLevel ? "100%" : `${progressValue.toFixed(2)}%`}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {challengesList.map((challenge) => (
          <Card key={challenge.id} className="shadow-lg p-4">
            <h3 className="font-semibold">{challenge.title}</h3>
            <p className="text-sm text-gray-500">{challenge.description}</p>
            <Button className="mt-4 text-blue-500">Accept Challenge</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

