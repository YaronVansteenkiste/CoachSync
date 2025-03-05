import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";

export default function WelcomeCard({ userName, image }: { userName: string, image: string }) {
  const router = useRouter();

  const handleProfileNavigation = () => {
    router.push('/profile');
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="my-3 text-center text-lg">
          Welcome back {userName}!
        </CardTitle>
        <BoringAvatar
          size={100}
          name={image}
          variant="beam"
          colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
        />
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Button onClick={handleProfileNavigation}>Go to Profile</Button>
      </CardFooter>
    </Card>
  );
}