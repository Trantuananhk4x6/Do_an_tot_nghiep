"use client";

import { ReactNode, Suspense, useEffect, useState } from 'react';

interface Scene3DProps {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  enableControls?: boolean;
  className?: string;
}

export default function Scene3D({ 
  children, 
  camera = { position: [0, 0, 5], fov: 75 },
  enableControls = false,
  className = ""
}: Scene3DProps) {
  const [mounted, setMounted] = useState(false);
  const [Canvas, setCanvas] = useState<any>(null);
  const [Drei, setDrei] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Lazy load React Three Fiber components
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei')
    ]).then(([fiber, drei]) => {
      setCanvas(() => fiber.Canvas);
      setDrei(drei);
    }).catch(err => {
      console.error('Failed to load 3D dependencies:', err);
    });
  }, []);

  if (!mounted || !Canvas || !Drei) {
    return <div className={`w-full h-full ${className}`} />;
  }

  const { OrbitControls, PerspectiveCamera } = Drei;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={camera.position} fov={camera.fov || 75} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#3b82f6" />
          
          {children}
          
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
