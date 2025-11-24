"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function HolographicCard({ 
  children, 
  className = "",
  glowColor = "purple"
}: HolographicCardProps) {
  const glowColors = {
    purple: "shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:shadow-[0_0_80px_rgba(139,92,246,0.8)]",
    pink: "shadow-[0_0_50px_rgba(236,72,153,0.6)] hover:shadow-[0_0_80px_rgba(236,72,153,0.8)]",
    blue: "shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:shadow-[0_0_80px_rgba(59,130,246,0.8)]",
    cyan: "shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:shadow-[0_0_80px_rgba(6,182,212,0.8)]"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        rotateX: 5,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className={`
        relative group perspective-1000
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Holographic border effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-75 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500 animate-gradient-xy" />
      
      {/* Main card */}
      <div className={`relative bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 ${glowColors[glowColor as keyof typeof glowColors]} transition-all duration-500`}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/50 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-pink-500/50 rounded-br-2xl" />
      </div>
    </motion.div>
  );
}
