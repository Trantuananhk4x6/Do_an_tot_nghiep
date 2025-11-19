'use client';

import React, { useState, useEffect } from 'react';
import { rateLimiter } from '../../services/ai/rate-limiter.service';

// ============================================================================
// Component
// ============================================================================

export function QuotaWarning() {
  const [status, setStatus] = useState(rateLimiter.getStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check status every 5 seconds
    const interval = setInterval(() => {
      const newStatus = rateLimiter.getStatus();
      setStatus(newStatus);
      setIsVisible(newStatus.isBlocked || newStatus.requestsInWindow >= newStatus.maxRequests * 0.8);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  const isBlocked = status.isBlocked;
  const isWarning = status.requestsInWindow >= status.maxRequests * 0.8 && !isBlocked;

  return (
    <div className={`relative z-20 ${isBlocked ? 'bg-red-900/90' : 'bg-yellow-900/90'} border-b border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {isBlocked ? '🔴' : '⚠️'}
            </span>
            <div>
              <h4 className="font-bold text-white text-sm">
                {isBlocked ? 'API Quota Exceeded' : 'API Usage Warning'}
              </h4>
              <p className="text-xs text-gray-200">
                {isBlocked ? (
                  <>
                    AI service temporarily blocked. Retry in {Math.ceil(status.remainingSeconds / 60)} minutes.
                    The app will use basic processing during this time.
                  </>
                ) : (
                  <>
                    You're approaching the API limit ({status.requestsInWindow}/{status.maxRequests} requests).
                    Consider spacing out your requests.
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
