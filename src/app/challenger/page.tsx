'use client'
import { calculateRank, getLeaderboard, getUserData } from "@/app/actions/ranking/calculateRank";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { authClient } from "@/lib/auth/client";
import { cn } from '@/lib/utils';
import BoringAvatar from 'boring-avatars';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function ChallengerPage() {
  const {
    data: session,
    isPending  } = authClient.useSession();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [userExperience, setUserExperience] = useState<number>(0);
  const [userRank, setUserRank] = useState<any[]>([]);
  const [nextRank, setNextRank] = useState<any[]>([]);
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

  const currentLevelXp = userRank[0]?.requiredXp || 0;
  const nextLevelXp = nextRank[0]?.requiredXp || 1;
  const isMaxLevel = nextRank?.length === 0;
  const progressValue = isMaxLevel ? 100 : ((userExperience - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Challenger</h1>
      <Card className="shadow-lg p-6 relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl z-0"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-500 opacity-30 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10">
          <div className="flex justify-center">
            {userRank[0]?.image && (
              <div className="flex flex-col items-center">
                <Image src={userRank[0].image} alt={userRank[0]?.name} width={150} height={150} />
                <TextGenerateEffect words={userRank[0]?.name.toUpperCase()} className="font-bold text-center" />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <span className="text-sm text-gray-500">
              {isMaxLevel ? "Max Level" : `Experience required till ${nextRank[0]?.name}`}
            </span>
          </div>
          <Progress value={progressValue} max={100} className={`my-4 ${isMaxLevel ? 'bg-gold' : ''}`} />
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">0%</span>
            <span className="text-sm text-gray-500">{isMaxLevel ? "100%" : `${progressValue.toFixed(2)}%`}</span>
          </div>
        </div>
      </Card>

      <div>
        <Table>
          <TableCaption>A list of top 20 challengers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead >#</TableHead >
              <TableHead ></TableHead >
              <TableHead >User</TableHead >
              <TableHead >Rank</TableHead >
              <TableHead >Experience</TableHead >
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell> {index + 1}</TableCell>
                <TableCell>
                  <BoringAvatar
                    size={50}
                    name={user.image}
                    variant="beam"
                    colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                  /></TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.rankImage && (
                      <Image src={user.rankImage} alt={user.rankName} width={40} height={60} className="inline-block" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{user.experience}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

