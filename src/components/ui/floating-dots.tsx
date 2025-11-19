"use client";

import { useEffect, useRef } from 'react';

export function FloatingDots() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating dots
    const dotCount = 30;
    const dots: HTMLDivElement[] = [];

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 20 + 15;
      const animationDelay = Math.random() * 5;
      
      dot.className = 'absolute rounded-full';
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${left}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.background = Math.random() > 0.5 
        ? 'rgba(139, 92, 246, 0.3)' 
        : 'rgba(236, 72, 153, 0.3)';
      dot.style.animation = `floatDot ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
      dot.style.filter = 'blur(1px)';
      
      container.appendChild(dot);
      dots.push(dot);
    }

    return () => {
      dots.forEach(dot => dot.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
