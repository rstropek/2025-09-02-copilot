'use client';

import { useState } from "react";
import RobotArmScene from "@/components/arm";
import { RobotArmControl, JointAngles } from "@/components/slider";
import ColorSelector, { RobotColor } from "@/components/color-selector";

export default function Home() {
  const [jointAngles, setJointAngles] = useState<JointAngles>({
    j0: 0,   // yaw: 0-360, default 0
    j1: 75,  // pitch: 0-90, default 75
    j2: 45,  // pitch: 0-90, default 45
    j3: 15,  // pitch: 0-90, default 15
    j4: 10   // pitch: 0-90, default 10
  });

  const [robotColor, setRobotColor] = useState<RobotColor>('red');

  return (
    <>
      <RobotArmControl onChange={setJointAngles} />
      <ColorSelector 
        label="Robot Color" 
        value={robotColor} 
        onChange={setRobotColor} 
      />
      <RobotArmScene className="scene" jointAngles={jointAngles} color={robotColor} />
    </>
  );
}
