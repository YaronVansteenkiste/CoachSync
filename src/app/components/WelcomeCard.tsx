import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BoringAvatar from "boring-avatars";

export default function WelcomeCard({ userName }: { userName: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="my-3 text-center">
          Welcome back {userName}!
        </CardTitle>
        <div className="w-full flex justify-center">
          <BoringAvatar
            name={userName}
            width="50%"
            height="auto"
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
    </Card>
  );
}