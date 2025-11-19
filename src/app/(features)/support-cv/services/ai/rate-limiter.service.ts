// ============================================================================
// Rate Limiter Service - Clean implementation
// ============================================================================

import { RateLimitError } from '../../lib/errors';

// ============================================================================
// Types
// ============================================================================

interface RateLimitConfig {
  maxRequests: number;    // Max requests per window
  windowMs: number;       // Time window in milliseconds
  blockDurationMs: number; // How long to block after exceeding
}

interface RateLimitState {
  requests: number[];     // Timestamps of requests
  isBlocked: boolean;
  blockUntil: number | null;
}

// ============================================================================
// Rate Limiter Class
// ============================================================================

class RateLimiterService {
  private config: RateLimitConfig;
  private state: RateLimitState;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxRequests: config.maxRequests || 10,
      windowMs: config.windowMs || 60000, // 1 minute
      blockDurationMs: config.blockDurationMs || 1800000 // 30 minutes
    };

    this.state = {
      requests: [],
      isBlocked: false,
      blockUntil: null
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if currently blocked
    if (this.isCurrentlyBlocked()) {
      const remainingMs = this.state.blockUntil! - Date.now();
      throw new RateLimitError(
        'Rate limiter is in emergency block',
        Math.ceil(remainingMs / 1000)
      );
    }

    // Clean old requests outside window
    this.cleanOldRequests();

    // Check if we can make request
    if (this.state.requests.length >= this.config.maxRequests) {
      // Activate emergency block
      this.activateBlock();
      throw new RateLimitError(
        'Rate limit exceeded',
        Math.ceil(this.config.blockDurationMs / 1000)
      );
    }

    // Record this request
    this.state.requests.push(Date.now());

    // Execute the function
    try {
      return await fn();
    } catch (error: any) {
      // If error is rate limit from API, activate block
      if (
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('Resource exhausted')
      ) {
        this.activateBlock();
      }
      throw error;
    }
  }

  private isCurrentlyBlocked(): boolean {
    if (!this.state.isBlocked || !this.state.blockUntil) {
      return false;
    }

    // Check if block has expired
    if (Date.now() >= this.state.blockUntil) {
      this.deactivateBlock();
      return false;
    }

    return true;
  }

  private cleanOldRequests(): void {
    const cutoff = Date.now() - this.config.windowMs;
    this.state.requests = this.state.requests.filter(ts => ts > cutoff);
  }

  private activateBlock(): void {
    console.warn('[Rate Limiter] Activating emergency block for', this.config.blockDurationMs / 1000, 'seconds');
    this.state.isBlocked = true;
    this.state.blockUntil = Date.now() + this.config.blockDurationMs;
  }

  private deactivateBlock(): void {
    console.log('[Rate Limiter] Block expired, resetting');
    this.state.isBlocked = false;
    this.state.blockUntil = null;
    this.state.requests = [];
  }

  getStatus() {
    return {
      isBlocked: this.state.isBlocked,
      remainingSeconds: this.state.blockUntil 
        ? Math.ceil((this.state.blockUntil - Date.now()) / 1000)
        : 0,
      requestsInWindow: this.state.requests.length,
      maxRequests: this.config.maxRequests
    };
  }

  reset(): void {
    this.state = {
      requests: [],
      isBlocked: false,
      blockUntil: null
    };
    console.log('[Rate Limiter] Manual reset');
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const rateLimiter = new RateLimiterService({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  blockDurationMs: 1800000 // 30 minutes
});
