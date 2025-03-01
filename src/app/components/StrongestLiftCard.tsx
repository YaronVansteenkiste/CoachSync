import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StrongestLiftCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strongest lift</CardTitle>
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Bench Press</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mt-4">You are stronger than 70% of users.</p>
          </CardContent>
        </Card>
      </CardHeader>
    </Card>
  );
}
