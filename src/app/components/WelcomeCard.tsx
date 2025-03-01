import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getUserData } from "@/app/actions/getUserData";
import { addProgressRecord } from "@/app/actions/addProgressRecord";

export default function WelcomeCard() {
  const [userData, setUserData] = useState({ username: "", weightKg: 0, bodyFatPercentage: 0 });
  const [newWeight, setNewWeight] = useState("");
  const [newBodyFat, setNewBodyFat] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getUserData("550e8400-e29b-41d4-a716-446655440000"); 
      if (data) {
        const { user, progressData } = data;
        if (user.length > 0) {
          const latestProgress = progressData[progressData.length - 1];
          setUserData({
            username: user[0].username,
            weightKg: latestProgress ? latestProgress.weightKg : 0,
            bodyFatPercentage: latestProgress ? latestProgress.bodyFatPercentage : 0,
          });
        }
      }
    }
    fetchData();
  }, []);

  const handleAddRecord = async () => {
    await addProgressRecord("550e8400-e29b-41d4-a716-446655440000", parseFloat(newWeight), parseFloat(newBodyFat)); 
    const data = await getUserData("550e8400-e29b-41d4-a716-446655440000"); // Refresh data
    if (data) {
      const { user, progressData } = data;
      if (user.length > 0) {
        const latestProgress = progressData[progressData.length - 1];
        setUserData({
          username: user[0].username,
          weightKg: latestProgress ? latestProgress.weightKg : 0,
          bodyFatPercentage: latestProgress ? latestProgress.bodyFatPercentage : 0,
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="my-3 text-center">
          Welcome back {userData.username}!
        </CardTitle>
        <Avatar className={"mx-auto w-52 h-52"}>
          <AvatarImage src="https://avatars.githubusercontent.com/u/125354929?v=4" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-center mt-4">
          <p>Weight: {userData.weightKg} kg</p>
          <p>Body Fat: {userData.bodyFatPercentage} %</p>
        </div>
        <div className="mt-4">
          <input
            type="number"
            placeholder="New Weight (kg)"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="block mx-auto mb-2"
          />
          <input
            type="number"
            placeholder="New Body Fat (%)"
            value={newBodyFat}
            onChange={(e) => setNewBodyFat(e.target.value)}
            className="block mx-auto mb-2"
          />
          <button onClick={handleAddRecord} className="block mx-auto mt-2">
            Add Record
          </button>
        </div>
      </CardHeader>
    </Card>
  );
}
