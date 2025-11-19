"use client";

import React, { useState } from "react";
import { Button } from "./button";
import WaitlistDialog from "./waitlistDialog";
import { AnimatedStars } from "./animated-stars";

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
          {/* Floating decorative elements */}
          <div className="absolute -top-10 left-10 w-20 h-20 border border-purple-500/20 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-pink-500/20 rounded-lg rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full animate-bounce-slow"></div>
          
          {/* Icon with animation */}
          <div className="mb-8 inline-block relative">
            {/* Pulsing rings behind icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-purple-500/20 animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center animation-delay-2000">
              <div className="w-28 h-28 rounded-2xl bg-pink-500/10 animate-ping"></div>
            </div>
            
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto animate-float shadow-neon">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold sm:text-6xl text-gray-100 leading-tight mb-6">
            Ace Your Next Interview with{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-lg opacity-50"></span>
              <strong className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered
              </strong>
            </span>
            {" "}🚀
          </h1>

          <p className="mt-6 sm:text-xl/relaxed text-gray-300 max-w-2xl mx-auto">
            Boost your confidence, refine your answers, and land your dream job
            with your AI Interview Copilot. We are launching!
          </p>
          
          {/* Stats or features mini cards */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm">
            <div className="glass-effect px-6 py-3 rounded-full border border-purple-500/20">
              <span className="text-purple-400 font-semibold">✨ AI-Powered</span>
            </div>
            <div className="glass-effect px-6 py-3 rounded-full border border-pink-500/20">
              <span className="text-pink-400 font-semibold">🎯 Real-time Feedback</span>
            </div>
            <div className="glass-effect px-6 py-3 rounded-full border border-blue-500/20">
              <span className="text-blue-400 font-semibold">📈 Track Progress</span>
            </div>
            <a 
              href="/reviews"
              className="glass-effect px-6 py-3 rounded-full border border-yellow-500/20 hover:border-yellow-500/50 transition-all hover:scale-105"
            >
              <span className="text-yellow-400 font-semibold">⭐ See Reviews</span>
            </a>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center px-8">
            <Button
              size="lg"
              onClick={() => setIsWaitlistOpen(true)}
              className="relative w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10">Join Waitlist</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
          
          {/* Decorative elements around CTA */}
          <div className="mt-8 flex items-center justify-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>100+ Early Adopters</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 Rating</span>
            </div>
          </div>
          {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded-sm bg-indigo-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:ring-3 focus:outline-hidden sm:w-auto"
              href="/resume"
            >
              Get Started
            </Link>

            <Link
              className="block w-full rounded-sm px-12 py-3 text-sm font-medium text-indigo-600 shadow-sm hover:text-indigo-700 focus:ring-3 focus:outline-hidden sm:w-auto"
              href="#"
            >
              Learn More
            </Link>
          </div> */}
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
