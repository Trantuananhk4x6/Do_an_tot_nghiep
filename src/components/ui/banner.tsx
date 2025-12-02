"use client";

import React, { useState } from "react";
import { Button } from "./button";
import WaitlistDialog from "./waitlistDialog";
import { AnimatedStars } from "./animated-stars";
import { motion } from 'framer-motion';

const Banner = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Animated Stars Background */}
      <AnimatedStars />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none"></div>
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center lg:h-screen relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Floating decorative elements with enhanced animations */}
          <motion.div 
            className="absolute -top-10 left-10 w-20 h-20 border-2 border-purple-500/30 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-20 right-20 w-16 h-16 border-2 border-pink-500/30 rounded-lg"
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full"
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Icon with enhanced 3D animation */}
          <motion.div 
            className="mb-8 inline-block relative"
            initial={{ scale: 0, rotateY: 0 }}
            animate={{ scale: 1, rotateY: 360 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Pulsing rings behind icon */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-24 h-24 rounded-2xl bg-purple-500/30 border-2 border-purple-500/50"></div>
            </motion.div>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-28 h-28 rounded-2xl bg-pink-500/20 border-2 border-pink-500/30"></div>
            </motion.div>
            
            <motion.div 
              className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto shadow-neon"
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              whileHover={{ 
                scale: 1.1,
                rotateY: 180,
                transition: { duration: 0.6 }
              }}
            >
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-100 leading-tight mb-4 sm:mb-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ace Your Next Interview with{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-lg opacity-50"></span>
              <strong className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered
              </strong>
            </span>
            {" "}🚀
          </motion.h1>

          <motion.p 
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Boost your confidence, refine your answers, and land your dream job
            with your AI Interview Copilot. We are launching!
          </motion.p>
          
          {/* Stats or features mini cards with stagger animation */}
          <motion.div 
            className="mt-6 sm:mt-10 lg:mt-12 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-sm px-2 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div 
              className="glass-effect px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-purple-500/20 hover:border-purple-500/50 hover:scale-105 transition-all cursor-pointer"
              whileHover={{ y: -3 }}
            >
              <span className="text-purple-400 font-semibold text-[10px] sm:text-xs md:text-sm whitespace-nowrap">✨ AI-Powered</span>
            </motion.div>
            <motion.div 
              className="glass-effect px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-pink-500/20 hover:border-pink-500/50 hover:scale-105 transition-all cursor-pointer"
              whileHover={{ y: -3 }}
            >
              <span className="text-pink-400 font-semibold text-[10px] sm:text-xs md:text-sm whitespace-nowrap">🎯 Feedback</span>
            </motion.div>
            <motion.div 
              className="glass-effect px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-blue-500/20 hover:border-blue-500/50 hover:scale-105 transition-all cursor-pointer"
              whileHover={{ y: -3 }}
            >
              <span className="text-blue-400 font-semibold text-[10px] sm:text-xs md:text-sm whitespace-nowrap">📈 Progress</span>
            </motion.div>
            <motion.a 
              href="/reviews"
              className="glass-effect px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-yellow-500/20 hover:border-yellow-500/50 transition-all"
              whileHover={{ y: -3, scale: 1.05 }}
            >
              <span className="text-yellow-400 font-semibold text-[10px] sm:text-xs md:text-sm whitespace-nowrap">⭐ Reviews</span>
            </motion.a>
          </motion.div>
          <motion.div 
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center px-4 sm:px-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                onClick={() => setIsWaitlistOpen(true)}
                className="relative w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Join Waitlist</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Decorative elements around CTA - REMOVED early adopters section */}
        </div>
      </div>

      <WaitlistDialog
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </section>
  );
};

export default Banner;
