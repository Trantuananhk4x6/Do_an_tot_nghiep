// ============================================================================
// Result Type (Railway-Oriented Programming)
// ============================================================================

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export function Ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function Err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

// Helper to unwrap result or throw
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.data;
  }
  throw result.error;
}

// Helper to unwrap result or return default
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (isOk(result)) {
    return result.data;
  }
  return defaultValue;
}

// Helper to map success value
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return Ok(fn(result.data));
  }
  return result;
}

// Helper to map error value
export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  if (isErr(result)) {
    return Err(fn(result.error));
  }
  return result;
}
