'use client';

import React, { useEffect, useState } from 'react';
import { rateLimiter } from '@/app/(features)/support-cv/services/ai/rate-limiter.service';

export function QuotaStatusBanner() {
  const [status, setStatus] = useState<{
    isBlocked: boolean;
    remainingSeconds: number;
    requestsInWindow: number;
    maxRequests: number;
  }>({
    isBlocked: false,
    remainingSeconds: 0,
    requestsInWindow: 0,
    maxRequests: 10,
  });

  useEffect(() => {
    // Check status every second
    const interval = setInterval(() => {
      const currentStatus = rateLimiter.getStatus();
      setStatus(currentStatus);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't show if not blocked
  if (!status.isBlocked) return null;

  const remainingMinutes = Math.ceil(status.remainingSeconds / 60);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            {/* Message */}
            <div>
              <h3 className="font-bold text-sm md:text-base">
                🔴 API Quota Exceeded
              </h3>
              <p className="text-xs md:text-sm opacity-90">
                Using fallback mode. AI features will resume in <span className="font-bold">{remainingMinutes}</span> minute{remainingMinutes !== 1 ? 's' : ''} or tomorrow when quota resets.
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono font-bold text-lg">
              {remainingMinutes}:00
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{ 
              width: `${Math.max(0, 100 - (remainingMinutes / 30) * 100)}%` 
            }}
          />
        </div>

        {/* Info Text */}
        <p className="mt-2 text-xs opacity-75 text-center">
          📝 You can still upload CVs, review, and export - using basic analysis mode
        </p>
      </div>
    </div>
  );
}
