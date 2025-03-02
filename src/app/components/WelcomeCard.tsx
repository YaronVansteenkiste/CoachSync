import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="my-3 text-center">
          Welcome back Yaron!
        </CardTitle>
        <Avatar className={"mx-auto w-52 h-52"}>
          <AvatarImage src="https://avatars.githubusercontent.com/u/125354929?v=4" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>
    </Card>
  );
}
