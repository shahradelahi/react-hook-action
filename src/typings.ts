import type { SafeReturn } from 'p-safe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFunc = (...args: any[]) => Promise<any>;

export interface UseActionOptions<T extends AsyncFunc, E = Error> {
  /**
   * The initial result of the action.
   */
  initialResult?: Awaited<ReturnType<T>>;

  /**
   * A callback function that is called when an error occurs during the action execution.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: E) => any;

  /**
   * Whether to ignore errors and not update the error state.
   */
  ignoreErrors?: boolean;
}

export interface Action<T extends AsyncFunc, E = Error> {
  /**
   * The result of the most recent successful action execution.
   */
  result: Awaited<ReturnType<T>> | undefined;

  /**
   * The error that occurred during the most recent failed action execution.
   */
  error: E | undefined;

  /**
   * A boolean indicating whether the action is currently in progress.
   */
  isLoading: boolean;

  /**
   * Triggers the asynchronous action and manages the loading state.
   *
   * @param args - The arguments to be passed to the asynchronous function.
   * @returns A Promise that resolves with the safe result of the asynchronous function.
   */
  dispatch: (...args: Parameters<T>) => Promise<SafeReturn<Awaited<ReturnType<T>>, E>>;

  /**
   * Resets the action state to its initial state.
   */
  reset: () => void;
}
