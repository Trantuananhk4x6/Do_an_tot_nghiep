// ============================================================================
// Gemini AI Client - Clean wrapper around Google Generative AI
// ============================================================================

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Result, Ok, Err } from '../../lib/result';
import { AIServiceError, RateLimitError, QuotaExceededError } from '../../lib/errors';

// ============================================================================
// Types
// ============================================================================

export interface GeminiConfig {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// ============================================================================
// Gemini Client Class
// ============================================================================

class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;
  private lastCallTime: number = 0;
  private readonly MIN_DELAY_MS = 10000; // Minimum 2 seconds between API calls

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('[Gemini Client] API key not configured');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.isInitialized = true;
    console.log('[Gemini Client] Initialized successfully');
  }

  isAvailable(): boolean {
    return this.isInitialized && this.genAI !== null;
  }

  private getModel(config: GeminiConfig = {}): GenerativeModel {
    if (!this.genAI) {
      throw new AIServiceError(
        'Gemini AI not initialized',
        'AI service is not configured. Please check your API key.'
      );
    }

    // Using gemini-2.0-flash-exp (fastest, works with v1beta API)
    // Note: gemini-1.5-flash is NOT available in v1beta API
    return this.genAI.getGenerativeModel({
      model: config.model || 'gemini-2.0-flash',
      generationConfig: {
        temperature: config.temperature ?? 0.3,
        maxOutputTokens: config.maxOutputTokens,
      }
    });
  }

  async generateContent(
    prompt: string,
    config: GeminiConfig = {}
  ): Promise<Result<GeminiResponse, Error>> {
    if (!this.isAvailable()) {
      return Err(new AIServiceError(
        'Gemini client not available',
        'AI service is temporarily unavailable'
      ));
    }

    // ⏱️ Auto-delay: Wait if needed to prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (this.lastCallTime > 0 && timeSinceLastCall < this.MIN_DELAY_MS) {
      const delayNeeded = this.MIN_DELAY_MS - timeSinceLastCall;
      console.log(`[Gemini Client] Auto-delay: waiting ${delayNeeded}ms to prevent rate limit`);
      await sleep(delayNeeded);
    }

    try {
      const model = this.getModel(config);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Update last call time for next request
      this.lastCallTime = Date.now();

      return Ok({
        text,
        usage: {
          promptTokens: 0, // Gemini doesn't provide this
          completionTokens: 0,
          totalTokens: 0
        }
      });
    } catch (error: any) {
      console.error('[Gemini Client] Error:', error);
      
      // Still update last call time even on error
      this.lastCallTime = Date.now();
      
      return Err(this.handleError(error));
    }
  }

  private handleError(error: any): Error {
    // Rate limit
    if (
      error?.status === 429 ||
      error?.message?.includes('429') ||
      error?.message?.includes('Resource exhausted') ||
      error?.message?.includes('quota')
    ) {
      return new RateLimitError('API rate limit exceeded', 1800);
    }

    // Quota exceeded
    if (error?.message?.includes('QUOTA_EXCEEDED')) {
      return new QuotaExceededError('Daily API quota exceeded');
    }

    // Generic error
    return new AIServiceError(
      error?.message || 'Unknown error',
      'AI service encountered an error'
    );
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const geminiClient = new GeminiClient();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sleep utility to add delays between API calls
 * Helps prevent rate limiting by spacing out requests
 * 
 * @param ms - Milliseconds to sleep (recommended: 2000-4000ms)
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute multiple prompts sequentially with delays
 * ⚠️ Use this instead of Promise.all() to prevent rate limiting
 * 
 * @example
 * ```typescript
 * // ❌ DON'T DO THIS (parallel calls cause rate limiting):
 * // const tasks = sections.map(section => model.generateContent(section));
 * // await Promise.all(tasks);
 * 
 * // ✅ DO THIS (sequential calls with delays):
 * const results = await generateSequentially(
 *   sections.map(section => () => geminiClient.generateContent(section))
 * );
 * ```
 * 
 * @param prompts - Array of functions that return API call promises
 * @param delayMs - Delay between calls (default: 2000ms)
 * @returns Array of results in the same order
 */
export async function generateSequentially<T>(
  prompts: Array<() => Promise<T>>,
  delayMs: number = 2000
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < prompts.length; i++) {
    const result = await prompts[i]();
    results.push(result);
    
    // Add delay between calls (except after the last one)
    if (i < prompts.length - 1) {
      await sleep(delayMs);
    }
  }
  
  return results;
}

export function cleanJSONResponse(text: string): string {
  let cleaned = text.trim();

  // Remove markdown code blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '');
  }

  return cleaned.trim();
}

export function parseJSONResponse<T>(text: string): Result<T, Error> {
  try {
    const cleaned = cleanJSONResponse(text);
    const parsed = JSON.parse(cleaned);
    return Ok(parsed);
  } catch (error) {
    return Err(new Error(`Failed to parse JSON: ${error}`));
  }
}
