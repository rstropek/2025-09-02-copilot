'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import RobotArmScene from "@/components/arm";
import { RobotArmControl, JointAngles } from "@/components/slider";

export default function Home() {
  const [jointAngles, setJointAngles] = useState<JointAngles>({
    j0: 0,   // yaw: 0-360, default 0
    j1: 75,  // pitch: 0-90, default 75
    j2: 45,  // pitch: 0-90, default 45
    j3: 15,  // pitch: 0-90, default 15
    j4: 10   // pitch: 0-90, default 10
  });

  return (
    <>
      <RobotArmControl onChange={setJointAngles} />
      <RobotArmScene className="scene" jointAngles={jointAngles} />
    </>
  );
}
