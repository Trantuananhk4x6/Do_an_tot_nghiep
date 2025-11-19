// ============================================================================
// Custom Error Classes
// ============================================================================

export class CVError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'CVError';
  }
}

export class AIServiceError extends CVError {
  constructor(message: string, userMessage: string, recoverable = true) {
    super(message, 'AI_SERVICE_ERROR', userMessage, recoverable);
    this.name = 'AIServiceError';
  }
}

export class RateLimitError extends CVError {
  constructor(
    message: string,
    public retryAfter: number // seconds
  ) {
    super(
      message,
      'RATE_LIMIT_ERROR',
      `AI service is temporarily busy. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      true
    );
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends CVError {
  constructor(message: string) {
    super(
      message,
      'QUOTA_EXCEEDED',
      'Daily API quota has been exceeded. The app will use basic parsing. Try again tomorrow or use manual edit.',
      true
    );
    this.name = 'QuotaExceededError';
  }
}

export class PDFExtractionError extends CVError {
  constructor(message: string) {
    super(
      message,
      'PDF_EXTRACTION_ERROR',
      'Failed to extract text from PDF. Please ensure it\'s a text-based PDF (not scanned image).',
      false
    );
    this.name = 'PDFExtractionError';
  }
}

export class ValidationError extends CVError {
  constructor(message: string, userMessage: string) {
    super(message, 'VALIDATION_ERROR', userMessage, false);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// Error Handler Utilities
// ============================================================================

export function handleAPIError(error: any): CVError {
  // Check for rate limit
  if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Resource exhausted')) {
    return new RateLimitError('Rate limit exceeded', 1800); // 30 minutes
  }

  // Check for quota exceeded
  if (error?.message?.includes('quota') || error?.message?.includes('QUOTA_EXCEEDED')) {
    return new QuotaExceededError('API quota exceeded');
  }

  // Check for emergency block
  if (error?.message?.includes('EMERGENCY_BLOCK')) {
    return new RateLimitError('Emergency block active', 1800);
  }

  // Generic AI service error
  return new AIServiceError(
    error?.message || 'Unknown AI service error',
    'AI service is temporarily unavailable. The app will use basic processing.'
  );
}

export function getUserFriendlyError(error: any): string {
  if (error instanceof CVError) {
    return error.userMessage;
  }

  if (error?.message) {
    return `An error occurred: ${error.message}`;
  }

  return 'An unexpected error occurred. Please try again.';
}

export function isRecoverableError(error: any): boolean {
  if (error instanceof CVError) {
    return error.recoverable;
  }
  return true; // Assume recoverable by default
}
