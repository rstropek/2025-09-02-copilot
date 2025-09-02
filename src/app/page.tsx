'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import RobotArmScene from "@/components/arm";

export default function Home() {
  return (
    <>
      <h1>Hello World!</h1>
      <RobotArmScene className="scene" />
    </>
  );
}
