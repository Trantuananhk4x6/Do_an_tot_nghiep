// ============================================================================
// Gemini AI Client - Clean wrapper around Google Generative AI
// ============================================================================

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Result, Ok, Err } from '../../lib/result';
import { AIServiceError, RateLimitError, QuotaExceededError } from '../../lib/errors';

// ============================================================================
// Utility Functions (defined first so they can be used in class)
// ============================================================================

/**
 * Sleep utility to add delays between API calls
 * Helps prevent rate limiting by spacing out requests
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Clean JSON response from AI - removes markdown code blocks and extra whitespace
 */
export function cleanJSONResponse(text: string): string {
  let cleaned = text.trim();

  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?```\s*$/i, '');
  
  // Remove any remaining backticks
  cleaned = cleaned.replace(/^`+|`+$/g, '');
  
  // Try to find JSON object or array in the text
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  }

  return cleaned.trim();
}

/**
 * Parse JSON response from AI with better error handling
 */
export function parseJSONResponse<T>(text: string): Result<T, Error> {
  if (!text || typeof text !== 'string') {
    return Err(new Error('Empty or invalid response from AI'));
  }

  try {
    const cleaned = cleanJSONResponse(text);
    
    if (!cleaned) {
      return Err(new Error('No JSON content found in response'));
    }
    
    const parsed = JSON.parse(cleaned);
    return Ok(parsed);
  } catch (error: any) {
    console.error('[parseJSONResponse] Failed to parse:', text.substring(0, 200));
    return Err(new Error(`Failed to parse JSON: ${error?.message || 'Unknown error'}`));
  }
}

/**
 * Execute multiple prompts sequentially with delays
 * Use this instead of Promise.all() to prevent rate limiting
 */
export async function generateSequentially<T>(
  prompts: Array<() => Promise<T>>,
  delayMs: number = 2000
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < prompts.length; i++) {
    const result = await prompts[i]();
    results.push(result);
    
    if (i < prompts.length - 1) {
      await sleep(delayMs);
    }
  }
  
  return results;
}

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
  private readonly MIN_DELAY_MS = 20000; // Increased to 20 seconds between API calls
  private callCount: number = 0;

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

    // Using gemini-2.5-flash (faster and less likely to hit rate limits)
    return this.genAI.getGenerativeModel({
      model: config.model || 'gemini-2.5-flash',
      generationConfig: {
        temperature: config.temperature ?? 0.3,
        maxOutputTokens: config.maxOutputTokens || 2048, // Limit output to reduce API usage
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
      console.log(`[Gemini Client] ⏱️ Auto-delay: waiting ${Math.round(delayNeeded/1000)}s to prevent rate limit`);
      await sleep(delayNeeded);
    }

    try {
      this.callCount++;
      console.log(`[Gemini Client] 📤 API call #${this.callCount}`);
      
      const model = this.getModel(config);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Update last call time for next request
      this.lastCallTime = Date.now();
      
      console.log(`[Gemini Client] ✓ Response received (${text.length} chars)`);

      return Ok({
        text,
        usage: {
          promptTokens: 0, // Gemini doesn't provide this
          completionTokens: 0,
          totalTokens: 0
        }
      });
    } catch (error: any) {
      console.error('[Gemini Client] ❌ Error:', error?.message || error);
      
      // Still update last call time even on error
      this.lastCallTime = Date.now();
      
      return Err(this.handleError(error));
    }
  }

  private handleError(error: any): Error {
    const errorMessage = error?.message || '';
    
    // Rate limit
    if (
      error?.status === 429 ||
      errorMessage.includes('429') ||
      errorMessage.includes('Resource exhausted') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('RATE_LIMIT')
    ) {
      console.warn('[Gemini Client] 🚫 Rate limit detected');
      return new RateLimitError('API rate limit exceeded. Please wait a few minutes.', 300);
    }

    // Quota exceeded
    if (errorMessage.includes('QUOTA_EXCEEDED')) {
      return new QuotaExceededError('Daily API quota exceeded');
    }

    // Generic error
    return new AIServiceError(
      errorMessage || 'Unknown error',
      'AI service encountered an error. Please try again later.'
    );
  }

  getCallCount(): number {
    return this.callCount;
  }

  resetCallCount(): void {
    this.callCount = 0;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const geminiClient = new GeminiClient();
