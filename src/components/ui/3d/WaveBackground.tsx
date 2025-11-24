"use client";

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaveBackgroundProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export default function WaveBackground({
  color = "#8b5cf6",
  amplitude = 0.5,
  frequency = 2,
  speed = 1
}: WaveBackgroundProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && meshRef.current.geometry) {
      const positions = meshRef.current.geometry.attributes.position;
      const array = positions.array as Float32Array;

      for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        
        array[i + 2] = 
          Math.sin(x * frequency + state.clock.elapsedTime * speed) * amplitude +
          Math.cos(y * frequency + state.clock.elapsedTime * speed * 0.5) * amplitude * 0.5;
      }

      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
