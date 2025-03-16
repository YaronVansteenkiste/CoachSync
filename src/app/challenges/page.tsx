'use client'
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calculateRank, getUserData, getLeaderboard } from "@/app/actions/ranking/calculateRank";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableRow, TableCell, TableBody, TableCaption, TableHeader } from "@/components/ui/table";

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
  const [rankIdIsNull, setRankIdIsNull] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

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

        const { userExperience, userRank, nextRank } = await getUserData(userId);
        setUserExperience(userExperience);
        setUserRank(userRank);
        setNextRank(nextRank);

        const leaderboardData = await getLeaderboard();
        setLeaderboard(leaderboardData);
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
      <h1 className="text-4xl font-bold">Leaderboard</h1>

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

      <div>
        <Table>
        <TableCaption>A list of top 20 challengers.</TableCaption>
        <TableHeader>
            <TableRow>
              <TableHead ></TableHead >
              <TableHead >User</TableHead >
              <TableHead >Rank</TableHead >
              <TableHead >Experience</TableHead >
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.rankName}</TableCell>
                <TableCell>{user.experience}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

