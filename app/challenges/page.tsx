import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  import { Button } from "@/components/ui/button";



export default async function Page() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Challenges Dashboard</h1>

      <Card className="shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Current Level: Platinum Lifter</h2>
          <span className="text-sm text-gray-500">Experience required till Diamond Lifter</span>
        </div>
        <Progress value={33.33} max={100} className="my-4" />
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">0%</span>
          <span className="text-sm text-gray-500">33.33%</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="shadow-lg p-4">
          <h3 className="font-semibold">Challenge 1: Iron Grip</h3>
          <p className="text-sm text-gray-500">Deadlift 200kg</p>
          <Button className="mt-4 text-blue-500">Accept Challenge</Button>
        </Card>

        <Card className="shadow-lg p-4">
          <h3 className="font-semibold">Challenge 2: Titan Shoulders!</h3>
          <p className="text-sm text-gray-500">Overhead press 80kg</p>
          <Button className="mt-4 text-blue-500">Accept Challenge</Button>
        </Card>
        <Card className="shadow-lg p-4">
          <h3 className="font-semibold">Challenge 3: Core Crusher</h3>
          <p className="text-sm text-gray-500">Hold a 3-minute plank</p>
          <Button className="mt-4 text-blue-500">Accept Challenge</Button>
        </Card>
        <Card className="shadow-lg p-4">
          <h3 className="font-semibold">Challenge 4: Legs of Steel!</h3>
          <p className="text-sm text-gray-500">Squat 150kg</p>
          <Button className="mt-4 text-blue-500">Accept Challenge</Button>
        </Card>
      </div>
    </div>
  );
}
