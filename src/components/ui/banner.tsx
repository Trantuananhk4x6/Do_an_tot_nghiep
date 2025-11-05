"use client";

import React, { useState } from "react";
import { Button } from "./button";
import WaitlistDialog from "./waitlistDialog";

const Banner = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center lg:h-screen relative z-10">
        <div className="mx-auto max-w-xl text-center">
          {/* Icon with animation */}
          <div className="mb-8 inline-block">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto animate-float shadow-neon">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold sm:text-6xl text-gray-100 leading-tight">
            Ace Your Next Interview with{" "}
            <strong className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse-glow">
              AI-Powered
            </strong>
            🚀
          </h1>

          <p className="mt-6 sm:text-xl/relaxed text-gray-300">
            Boost your confidence, refine your answers, and land your dream job
            with your AI Interview Copilot. We are launching!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center px-8">
            <Button
              size="lg"
              onClick={() => setIsWaitlistOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300"
            >
              Join Waitlist
            </Button>
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
