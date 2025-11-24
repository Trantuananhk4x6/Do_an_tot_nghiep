"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";

const Header = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    loadRatingStats();
  }, []);

  const loadRatingStats = async () => {
    try {
      const response = await fetch("/api/ratings");
      if (response.ok) {
        const data = await response.json();
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      }
    } catch (error) {
      console.error("Error loading rating stats:", error);
    }
  };

  return (
    <header className="glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl w-full">
      <div className="mx-auto max-w-screen-xl px-2 sm:px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between h-auto min-h-[64px] py-2 gap-y-2">
          {/* Logo + Title */}
          <div className="flex-1 flex items-center gap-2 min-w-[160px]">
            <Link className="block hover:opacity-80 transition-opacity" href="/">
              <span className="sr-only">Home</span>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-neon">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-xl sm:text-2xl font-bold gradient-text whitespace-nowrap">
                  AI Interview
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation - Dashboard Button (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <SignedIn>
              <Link 
                href={"/resume"} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-10 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 inline-block text-lg font-semibold hover:scale-105"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>

          {/* Right Navigation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-end min-w-[220px]">
            {/* Mobile Dashboard Button */}
            <nav aria-label="Global" className="lg:hidden w-full">
              <SignedIn>
                <Link 
                  href={"/resume"} 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-6 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 inline-block font-semibold w-full text-center"
                >
                  Dashboard
                </Link>
              </SignedIn>
            </nav>

            {/* About Link */}
            <Link
              href="/about"
              className="glass-effect border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium min-w-[80px] text-center"
            >
              About
            </Link>

            {/* Quick link to guide page */}
            <Link
              href="/abouttutorial"
              className="glass-effect border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium min-w-[80px] text-center"
            >
              Tutorial 
            </Link>

            {/* Rating Button */}
              {/* Rating Button: nếu chưa đăng nhập thì chuyển tới đăng nhập */}
              <SignedIn>
                <Link
                  href="/reviews"
                  className="glass-effect border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 group min-w-[80px] text-center"
                >
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="hidden sm:inline font-medium">Reviews</span>
                  {totalRatings > 0 && (
                    <span className="text-yellow-400 font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                  )}
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="glass-effect border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1 group text-center text-sm justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="hidden sm:inline font-medium">Reviews</span>
                  </button>
                </SignInButton>
              </SignedOut>

            {/* Auth Buttons */}
            <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-end">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="glass-effect border border-white/10 hover:bg-white/5 text-gray-300 px-4 py-2 rounded-xl transition-all duration-300 w-full sm:w-auto">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 w-full sm:w-auto">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
