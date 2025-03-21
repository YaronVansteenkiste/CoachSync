import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { gymQuotes } from '@/lib/quotes';
import { useEffect, useState } from "react";
import { getUserData } from "@/app/actions/ranking/calculateRank";
import Image from 'next/image';

export default function WelcomeCard({ userName, image, userId }: { userName: string, image: string, userId: string }) {
  const router = useRouter();
  const [randomQuote, setRandomQuote] = useState("");
  const [rankImage, setRankImage] = useState<string | null>(null);

  useEffect(() => {
    const updateQuote = () => {
      setRandomQuote(gymQuotes[Math.floor(Math.random() * gymQuotes.length)]);
    };

    updateQuote();
    const intervalId = setInterval(updateQuote, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (userId) {
          const { userRank } = await getUserData(userId);
          if (userRank && userRank.length > 0 && userRank[0].image) {
            setRankImage(userRank[0].image);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    fetchUserData();
  }, []);

  const handleProfileNavigation = () => {
    router.push('/profile');
  };

  return (
    <div className="mb-0 h-full">
      <Card className="h-full">
        <CardHeader className="flex flex-col items-center relative">
          <CardTitle className="my-3 text-center text-lg">
            <span className="font-light text-generate-effect">Welcome back</span>
            <span className="text-blue-300 font-bold block text-2xl mt-2 text-generate-effect">
              {userName}!
            </span>
          </CardTitle>
          <div className="relative">
            <BoringAvatar
              size={100}
              name={image}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
            {rankImage && (
              <div className="absolute bottom-0 right-0">
                <Image src={rankImage} alt="Rank Image" width={30} height={30} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500 italic text-generate-effect">{randomQuote}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleProfileNavigation}>Go to Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}