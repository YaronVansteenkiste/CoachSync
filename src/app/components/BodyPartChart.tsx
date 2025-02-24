import React, { useState, useEffect } from "react";
import { BodyComponent } from "@darshanpatel2608/human-body-react";

interface BodyPartData {
  bodyPart: string;
  percentage: number;
}

const bodyPartMap: Record<string, string[]> = {
  front_delts: ["left_shoulder", "right_shoulder"],
  chest: ["chest"],
  abs: ["stomach"],
  triceps: ["left_arm", "right_arm"],
  biceps: ["left_arm", "right_arm"],
  forearms: ["left_hand", "right_hand"],
  quads: ["left_leg_upper", "right_leg_upper"],
  hamstrings: ["left_leg_upper", "right_leg_upper"],
  calves: ["left_leg_lower", "right_leg_lower"],
};

const data: BodyPartData[] = [
  { bodyPart: "front_delts", percentage: 30 },
  { bodyPart: "chest", percentage: 40 },
  { bodyPart: "abs", percentage: 35 },
  { bodyPart: "triceps", percentage: 28 },
  { bodyPart: "biceps", percentage: 30 },
  { bodyPart: "forearms", percentage: 20 },
  { bodyPart: "quads", percentage: 50 },
  { bodyPart: "hamstrings", percentage: 45 },
  { bodyPart: "calves", percentage: 10 },
];

const getColor = (percentage: number) => {
  if (percentage < 20) return "red"; // Undertrained
  if (percentage > 40) return "yellow"; // Overtrained
  return "green"; // Optimal
};

const generateParams = () => {
  const params: Record<string, any> = {};
  data.forEach(({ bodyPart, percentage }) => {
    const color = getColor(percentage);
    const mappedParts = bodyPartMap[bodyPart] || [bodyPart]; // Map to actual body part names

    mappedParts.forEach((part) => {
      params[part] = { selected: true, color };
    });
  });
  return params;
};

export const BodyPartChart: React.FC = () => {
  const [params, setParams] = useState<any>({});

  useEffect(() => {
    setParams(generateParams());
  }, []);

  useEffect(() => {
    // 🔹 Wait for the SVG to load, then apply colors dynamically
    const updateColors = () => {
      data.forEach(({ bodyPart, percentage }) => {
        const mappedParts = bodyPartMap[bodyPart] || [];
        mappedParts.forEach((part) => {
          const elements = document.querySelectorAll(`[id^="${part}"]`); // Select all matching parts
          elements.forEach((element) => {
            (element as HTMLElement).style.fill = getColor(percentage); // Apply color
          });
        });
      });
    };

    setTimeout(updateColors, 500); // Ensure SVG is loaded before updating
  }, [params]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Body Part Training Distribution</h2>
      <BodyComponent partsInput={params} mode="pain" onChange={() => {}} />
    </div>
  );
};

export default BodyPartChart;
