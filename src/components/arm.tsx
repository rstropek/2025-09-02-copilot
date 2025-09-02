'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
}

// Robot arm dimensions (in meters, 1cm = 0.01m)
const DIMENSIONS = {
  base: { diameter: 0.5, height: 0.2 },
  segment1: { width: 0.1, height: 0.1, length: 0.6 }, // shoulder link
  segment2: { width: 0.08, height: 0.08, length: 0.45 }, // elbow link
  segment3: { width: 0.06, height: 0.06, length: 0.25 }, // wrist link
  segment4: { diameter: 0.02, height: 0.1 }, // pipette
  joints: {
    shoulder: 0.06,
    elbow: 0.05,
    wrist: 0.04,
    pipette: 0.015
  }
};

// Home pose angles (in degrees) - adjusted for upward reaching pose
const HOME_POSE = {
  j0: 0, // base yaw (0°)
  j1: 65, // shoulder pitch (65° to reach upward)
  j2: 60, // elbow pitch (60° to fold naturally)
  j3: 45, // wrist pitch (45° to point forward)
  j4: 90, // pipette tilt (90° to point straight)
};

// Helper function to convert degrees to radians
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

export default function RobotArmScene({ className = '' }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mountRef.current) return;

    const container = mountRef.current;
    const { clientWidth: width, clientHeight: height } = container;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(1.6, 1.1, 1.8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add renderer to DOM
    container.appendChild(renderer.domElement);

    // Lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    scene.add(directionalLight);

    // Ground grid
    const gridHelper = new THREE.GridHelper(4, 40, 0x888888, 0xcccccc);
    scene.add(gridHelper);

    // Axes helper at world origin
    const axesHelper = new THREE.AxesHelper(0.2);
    scene.add(axesHelper);

    // Materials
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const segment1Material = new THREE.MeshStandardMaterial({ color: 0x777777 });
    const segment2Material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const segment3Material = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const pipetteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const jointMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

    // Create robot arm
    const robotArm = new THREE.Group();

    // Base (cylinder) - center sits so bottom rests on ground
    const baseGeometry = new THREE.CylinderGeometry(
      DIMENSIONS.base.diameter / 2,
      DIMENSIONS.base.diameter / 2,
      DIMENSIONS.base.height,
      32
    );
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = DIMENSIONS.base.height / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    robotArm.add(base);

    // J0 Group (base rotation around Y)
    const j0Group = new THREE.Group();
    j0Group.position.y = DIMENSIONS.base.height;
    j0Group.rotation.y = degToRad(HOME_POSE.j0);
    robotArm.add(j0Group);

    // Shoulder joint sphere
    const shoulderJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.shoulder, 16, 16);
    const shoulderJoint = new THREE.Mesh(shoulderJointGeometry, jointMaterial);
    shoulderJoint.castShadow = true;
    j0Group.add(shoulderJoint);

    // J1 Group (shoulder pitch around X)
    const j1Group = new THREE.Group();
    j1Group.rotation.x = degToRad(-HOME_POSE.j1);
    j0Group.add(j1Group);

    // Segment 1 (shoulder link)
    const segment1Geometry = new THREE.BoxGeometry(
      DIMENSIONS.segment1.width,
      DIMENSIONS.segment1.height,
      DIMENSIONS.segment1.length
    );
    const segment1 = new THREE.Mesh(segment1Geometry, segment1Material);
    segment1.position.z = DIMENSIONS.segment1.length / 2;
    segment1.castShadow = true;
    segment1.receiveShadow = true;
    j1Group.add(segment1);

    // Elbow joint sphere
    const elbowJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.elbow, 16, 16);
    const elbowJoint = new THREE.Mesh(elbowJointGeometry, jointMaterial);
    elbowJoint.position.z = DIMENSIONS.segment1.length;
    elbowJoint.castShadow = true;
    j1Group.add(elbowJoint);

    // J2 Group (elbow pitch around X)
    const j2Group = new THREE.Group();
    j2Group.position.z = DIMENSIONS.segment1.length;
    j2Group.rotation.x = degToRad(-HOME_POSE.j2);
    j1Group.add(j2Group);

    // Segment 2 (elbow link)
    const segment2Geometry = new THREE.BoxGeometry(
      DIMENSIONS.segment2.width,
      DIMENSIONS.segment2.height,
      DIMENSIONS.segment2.length
    );
    const segment2 = new THREE.Mesh(segment2Geometry, segment2Material);
    segment2.position.z = DIMENSIONS.segment2.length / 2;
    segment2.castShadow = true;
    segment2.receiveShadow = true;
    j2Group.add(segment2);

    // Wrist joint sphere
    const wristJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.wrist, 16, 16);
    const wristJoint = new THREE.Mesh(wristJointGeometry, jointMaterial);
    wristJoint.position.z = DIMENSIONS.segment2.length;
    wristJoint.castShadow = true;
    j2Group.add(wristJoint);

    // J3 Group (wrist pitch around X)
    const j3Group = new THREE.Group();
    j3Group.position.z = DIMENSIONS.segment2.length;
    j3Group.rotation.x = degToRad(-HOME_POSE.j3);
    j2Group.add(j3Group);

    // Segment 3 (wrist link)
    const segment3Geometry = new THREE.BoxGeometry(
      DIMENSIONS.segment3.width,
      DIMENSIONS.segment3.height,
      DIMENSIONS.segment3.length
    );
    const segment3 = new THREE.Mesh(segment3Geometry, segment3Material);
    segment3.position.z = DIMENSIONS.segment3.length / 2;
    segment3.castShadow = true;
    segment3.receiveShadow = true;
    j3Group.add(segment3);

    // Pipette joint sphere
    const pipetteJointGeometry = new THREE.SphereGeometry(DIMENSIONS.joints.pipette, 16, 16);
    const pipetteJoint = new THREE.Mesh(pipetteJointGeometry, jointMaterial);
    pipetteJoint.position.z = DIMENSIONS.segment3.length;
    pipetteJoint.castShadow = true;
    j3Group.add(pipetteJoint);

    // J4 Group (pipette tilt around X)
    const j4Group = new THREE.Group();
    j4Group.position.z = DIMENSIONS.segment3.length;
    j4Group.rotation.x = degToRad(-HOME_POSE.j4);
    j3Group.add(j4Group);

    // Segment 4 (pipette)
    const segment4Geometry = new THREE.CylinderGeometry(
      DIMENSIONS.segment4.diameter / 2,
      DIMENSIONS.segment4.diameter / 2,
      DIMENSIONS.segment4.height,
      16
    );
    const segment4 = new THREE.Mesh(segment4Geometry, pipetteMaterial);
    segment4.position.z = DIMENSIONS.segment4.height / 2;
    segment4.rotation.x = Math.PI / 2; // Orient cylinder along Z-axis
    segment4.castShadow = true;
    segment4.receiveShadow = true;
    j4Group.add(segment4);

    // Add robot arm to scene
    scene.add(robotArm);

    // Animation loop (static scene, no rotation)
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      baseGeometry.dispose();
      segment1Geometry.dispose();
      segment2Geometry.dispose();
      segment3Geometry.dispose();
      segment4Geometry.dispose();
      shoulderJointGeometry.dispose();
      elbowJointGeometry.dispose();
      wristJointGeometry.dispose();
      pipetteJointGeometry.dispose();
      baseMaterial.dispose();
      segment1Material.dispose();
      segment2Material.dispose();
      segment3Material.dispose();
      pipetteMaterial.dispose();
      jointMaterial.dispose();
      renderer.dispose();
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div>
        <span>Loading 3D Scene...</span>
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
}