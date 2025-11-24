"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface Floating3DTextProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
}

export default function Floating3DText({
  text,
  position = [0, 0, 0],
  color = "#8b5cf6",
  size = 1
}: Floating3DTextProps) {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={textRef} position={position}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={size}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </Text3D>
      </Center>
    </group>
  );
}
