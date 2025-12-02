// ============================================================================
// Rate Limiter Service - Enhanced implementation with retry and caching
// ============================================================================

import { RateLimitError } from '../../lib/errors';

// ============================================================================
// Types
// ============================================================================

interface RateLimitConfig {
  maxRequests: number;       // Max requests per window
  windowMs: number;          // Time window in milliseconds
  blockDurationMs: number;   // How long to block after exceeding
  minDelayMs: number;        // Minimum delay between requests
  maxRetries: number;        // Max retry attempts
  retryDelayMs: number;      // Base delay for retries (exponential backoff)
}

interface RateLimitState {
  requests: number[];        // Timestamps of requests
  isBlocked: boolean;
  blockUntil: number | null;
  lastRequestTime: number;
  consecutiveErrors: number;
}

// ============================================================================
// Rate Limiter Class
// ============================================================================

class RateLimiterService {
  private config: RateLimitConfig;
  private state: RateLimitState;
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxRequests: config.maxRequests || 5,         // Reduced from 10 to 5
      windowMs: config.windowMs || 60000,           // 1 minute
      blockDurationMs: config.blockDurationMs || 300000, // 5 minutes (reduced from 30)
      minDelayMs: config.minDelayMs || 15000,       // 15 seconds between requests
      maxRetries: config.maxRetries || 3,           // Up to 3 retries
      retryDelayMs: config.retryDelayMs || 5000,    // Start with 5 second retry delay
    };

    this.state = {
      requests: [],
      isBlocked: false,
      blockUntil: null,
      lastRequestTime: 0,
      consecutiveErrors: 0,
    };
  }

  /**
   * Execute function with rate limiting, caching, and retry logic
   */
  async execute<T>(fn: () => Promise<T>, cacheKey?: string): Promise<T> {
    // Check cache first
    if (cacheKey) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log('[Rate Limiter] Cache hit for:', cacheKey.substring(0, 50));
        return cached;
      }
    }

    // Check if currently blocked
    if (this.isCurrentlyBlocked()) {
      const remainingMs = this.state.blockUntil! - Date.now();
      const remainingSecs = Math.ceil(remainingMs / 1000);
      console.warn(`[Rate Limiter] Blocked for ${remainingSecs}s more`);
      throw new RateLimitError(
        'Rate limiter is in emergency block. Please wait before making more requests.',
        remainingSecs
      );
    }

    // Ensure minimum delay between requests
    await this.enforceMinDelay();

    // Clean old requests outside window
    this.cleanOldRequests();

    // Check if we can make request
    if (this.state.requests.length >= this.config.maxRequests) {
      console.warn('[Rate Limiter] Window limit reached, activating block');
      this.activateBlock();
      throw new RateLimitError(
        'Rate limit exceeded. Please wait before making more requests.',
        Math.ceil(this.config.blockDurationMs / 1000)
      );
    }

    // Execute with retry logic
    return this.executeWithRetry(fn, cacheKey);
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, cacheKey?: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Record this request
        this.state.requests.push(Date.now());
        this.state.lastRequestTime = Date.now();

        const result = await fn();
        
        // Success - reset consecutive errors
        this.state.consecutiveErrors = 0;

        // Cache result if key provided
        if (cacheKey) {
          this.setCache(cacheKey, result, 300000); // Cache for 5 minutes
        }

        return result;

      } catch (error: any) {
        lastError = error;
        this.state.consecutiveErrors++;
        
        // Check if it's a rate limit error
        const isRateLimitError = 
          error?.status === 429 ||
          error?.message?.includes('429') ||
          error?.message?.includes('Resource exhausted') ||
          error?.message?.includes('RATE_LIMIT') ||
          error?.message?.includes('quota');

        if (isRateLimitError) {
          console.warn(`[Rate Limiter] Rate limit hit (attempt ${attempt + 1}/${this.config.maxRetries + 1})`);
          
          // If max retries reached, activate block
          if (attempt >= this.config.maxRetries) {
            this.activateBlock();
            throw error;
          }

          // Exponential backoff: 5s, 10s, 20s...
          const delayMs = this.config.retryDelayMs * Math.pow(2, attempt);
          console.log(`[Rate Limiter] Waiting ${delayMs / 1000}s before retry...`);
          await this.sleep(delayMs);
          
          continue;
        }

        // Not a rate limit error, don't retry
        throw error;
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  private async enforceMinDelay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.state.lastRequestTime;

    if (this.state.lastRequestTime > 0 && timeSinceLastRequest < this.config.minDelayMs) {
      const delayNeeded = this.config.minDelayMs - timeSinceLastRequest;
      console.log(`[Rate Limiter] Enforcing ${delayNeeded}ms delay between requests`);
      await this.sleep(delayNeeded);
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
    // Dynamic block duration based on consecutive errors
    const multiplier = Math.min(this.state.consecutiveErrors, 5);
    const blockDuration = this.config.blockDurationMs * multiplier;
    
    console.warn(`[Rate Limiter] 🚫 Activating block for ${blockDuration / 1000}s (${multiplier}x multiplier)`);
    this.state.isBlocked = true;
    this.state.blockUntil = Date.now() + blockDuration;
  }

  private deactivateBlock(): void {
    console.log('[Rate Limiter] ✓ Block expired, resetting');
    this.state.isBlocked = false;
    this.state.blockUntil = null;
    this.state.requests = [];
    this.state.consecutiveErrors = 0;
  }

  // Cache methods
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
    
    // Clean old cache entries
    if (this.cache.size > 50) {
      const now = Date.now();
      for (const [k, v] of this.cache.entries()) {
        if (v.expiry < now) {
          this.cache.delete(k);
        }
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    return {
      isBlocked: this.state.isBlocked,
      remainingSeconds: this.state.blockUntil 
        ? Math.max(0, Math.ceil((this.state.blockUntil - Date.now()) / 1000))
        : 0,
      requestsInWindow: this.state.requests.length,
      maxRequests: this.config.maxRequests,
      consecutiveErrors: this.state.consecutiveErrors,
      cacheSize: this.cache.size,
    };
  }

  reset(): void {
    this.state = {
      requests: [],
      isBlocked: false,
      blockUntil: null,
      lastRequestTime: 0,
      consecutiveErrors: 0,
    };
    this.cache.clear();
    console.log('[Rate Limiter] ✓ Manual reset complete');
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[Rate Limiter] ✓ Cache cleared');
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const rateLimiter = new RateLimiterService({
  maxRequests: 5,            // Max 5 requests per minute
  windowMs: 60000,           // 1 minute window
  blockDurationMs: 300000,   // 5 minute block (increases with errors)
  minDelayMs: 15000,         // 15 seconds between requests
  maxRetries: 3,             // Retry up to 3 times
  retryDelayMs: 5000,        // 5s base retry delay
});
