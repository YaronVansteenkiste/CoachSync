import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="my-3 text-center">
          Welcome back Yaron!
        </CardTitle>
        <Avatar className={"mx-auto w-48 h-48 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"}>
          <AvatarImage src="https://avatars.githubusercontent.com/u/125354929?v=4" className="object-cover w-full h-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>
    </Card>
  );
}
