/* -------------------------------------------------------------------------------------------------
 * PROMISE WITH EXPONENTIAL BACKOFF UTILS
 * -----------------------------------------------------------------------------------------------*/

export interface BackoffOptions {
  backoff?: number;
  maxRetries?: number;
  backoffFactor?: number;
  name?: string;
  onRetry?: (retry: number, backoff: number, name?: string) => void;
}

const DEFAULT_BACKOFF = 50;
const DEFAULT_MAX_RETRIES = 10;
const DEFAULT_BACKOFF_FACTOR = 1;

/**
 * Tries to execute the promise, with exponential backoff.
 * @param promise The promise to execute.
 * @param options.backoff The backoff in milliseconds.
 * @param options.maxRetries The maximum number of retries.
 * @param options.backoffFactor The backoff factor.
 * @param options.onRetry The function to call on retry.
 * @returns The result of the promise.
 */
export async function backoff<T>(
  promise: () => Promise<T>,
  options: BackoffOptions = {
    backoff: DEFAULT_BACKOFF,
    maxRetries: DEFAULT_MAX_RETRIES,
    backoffFactor: DEFAULT_BACKOFF_FACTOR,
    onRetry: (retry: number, backoff: number, name?: string) =>
      console.log(
        `${name ?? "Retry"} ${retry} - ${(backoff / 1000).toLocaleString(undefined, { unit: "second" })}s`,
      ),
  },
): Promise<T> {
  const { backoff, maxRetries, backoffFactor, onRetry } = options;
  let retries = 0;
  let currentBackoff =
    (backoff ?? DEFAULT_BACKOFF) *
    ((backoffFactor ?? DEFAULT_BACKOFF_FACTOR) * retries - 1) *
    retries;

  const tryPromise = async (): Promise<T> => {
    try {
      const res = await promise();
      return res;
    } catch (error) {
      retries += 1;
      currentBackoff +=
        (backoff ?? DEFAULT_BACKOFF) *
        ((backoffFactor ?? DEFAULT_BACKOFF_FACTOR) * retries) *
        retries;

      if (retries > 0) {
        if (onRetry) onRetry(retries, currentBackoff, options.name);
        if (retries >= (maxRetries ?? DEFAULT_MAX_RETRIES))
          throw new Error("Max retries reached");
      }

      await new Promise((resolve) => setTimeout(resolve, currentBackoff));
      return tryPromise();
    }
  };

  return tryPromise();
}
