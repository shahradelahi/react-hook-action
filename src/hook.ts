import { tryIgnore, trySafe } from 'p-safe';
import * as React from 'react';
import { useStore } from 'zustand/react';

import { ActionStore } from './store';
import type { Action, AsyncFunc, UseActionOptions } from './typings';

/**
 * A custom React hook that wraps an asynchronous action with loading state management.
 *
 * @template T - The type of the asynchronous function being wrapped.
 * @template E - The type of the error that might occur.
 * @param actionKey
 * @param {T} action - The asynchronous function to be wrapped.
 * @param options
 * @returns {Action<T, E>} - An object containing the action state and methods to manage the action.
 * @example
 * export default function Page() {
 *   const { result, error, isLoading, dispatch, reset } = useAction(
 *     'fetchUser',
 *     async (id: number) => {
 *       const response = await fetch(`https://api.example.com/users/${id}`);
 *       return response.json();
 *     }
 *   );
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error.message}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {result && <div>User: {result.name}</div>}
 *       <button onClick={() => dispatch(1)}>Fetch User</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 */
export function useAction<T extends AsyncFunc, E = Error>(
  actionKey: string,
  action: T,
  options: UseActionOptions<T, E> = {}
): Action<T, E> {
  const state = useStore(ActionStore, (s) => s.getAction(actionKey));

  React.useEffect(() => {
    if (options.initialResult !== undefined) {
      ActionStore.getState().setActionResult(actionKey, options.initialResult);
    }
  }, [actionKey, options.initialResult]);

  const dispatch = React.useCallback(
    async (...args: Parameters<T>) => {
      ActionStore.getState().setAction(actionKey, {
        isLoading: true,
        error: undefined,
        result: undefined,
      });

      if (options.ignoreErrors) {
        const data = await tryIgnore(() => action(...args));
        ActionStore.getState().setAction(actionKey, {
          isLoading: false,
          error: undefined,
          result: data ?? undefined,
        });

        return { data: data ?? undefined };
      }

      const result = await trySafe<Awaited<ReturnType<T>>, E>(async (resolve) => {
        await action(...args).then(resolve);
      });

      if (result.error) {
        ActionStore.getState().setAction(actionKey, {
          isLoading: false,
          error: result.error,
          result: undefined,
        });
        options.onError && options.onError(result.error as unknown as E);
      } else {
        ActionStore.getState().setAction(actionKey, {
          isLoading: false,
          error: undefined,
          result: result.data,
        });
      }

      return result;
    },
    [actionKey, action, options.ignoreErrors, options.onError]
  );

  const reset = React.useCallback(() => {
    ActionStore.getState().resetAction(actionKey);
  }, [actionKey]);

  return { ...(state as Action<T, E>), reset, dispatch };
}
