import { act, renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, test } from 'vitest';

import { useAction } from './hook';

describe('useAction', () => {
  test('should return initial state and infer correct types', () => {
    const { result } = renderHook(() => useAction('test1', async (a: string) => Number(a)));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.result).toBeUndefined();

    expectTypeOf(result.current.result).toEqualTypeOf<number | undefined>();
    expectTypeOf(result.current.error).toEqualTypeOf<Error | undefined>();
    expectTypeOf(result.current.dispatch).parameters.toEqualTypeOf<[string]>();
    expectTypeOf(result.current.dispatch).returns.resolves.toMatchTypeOf<{
      data?: number;
      error?: Error;
    }>();
  });

  test('should handle successful dispatch', async () => {
    const action = async (id: number, name: string) => ({ id, name });
    const { result } = renderHook(() => useAction('test2', action));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promise: Promise<any>;
    act(() => {
      promise = result.current.dispatch(1, 'Alice');
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.result).toBeUndefined();

    const dispatchResult = await act(async () => await promise);

    expect(dispatchResult?.data).toEqual({ id: 1, name: 'Alice' });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toEqual({ id: 1, name: 'Alice' });
    expect(result.current.error).toBeUndefined();
  });

  test('should handle failed dispatch', async () => {
    const action = async (shouldFail: boolean) => {
      if (shouldFail) throw new Error('Failed');
      return 'success';
    };

    const { result } = renderHook(() => useAction('test3', action));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promise: Promise<any>;
    act(() => {
      promise = result.current.dispatch(true);
    });

    expect(result.current.isLoading).toBe(true);

    const dispatchResult = await act(async () => await promise);

    expect(dispatchResult?.error).toBeInstanceOf(Error);
    expect((dispatchResult?.error as Error).message).toBe('Failed');

    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed');
  });

  test('should handle ignoreErrors option', async () => {
    const action = async () => {
      throw new Error('Failed but ignored');
    };

    const { result } = renderHook(() => useAction('test4', action, { ignoreErrors: true }));

    const dispatchResult = await act(async () => {
      return await result.current.dispatch();
    });

    expect(dispatchResult).toEqual({ data: undefined });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  test('should use initialResult option', () => {
    const { result } = renderHook(() =>
      useAction('test5', async () => 'data', { initialResult: 'initial' })
    );

    expect(result.current.result).toBe('initial');
  });

  test('should reset state', async () => {
    const { result } = renderHook(() => useAction('test6', async () => 'data'));

    await act(async () => {
      await result.current.dispatch();
    });

    expect(result.current.result).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  test('should call onError option', async () => {
    let capturedError: Error | undefined;
    const { result } = renderHook(() =>
      useAction(
        'test7',
        async () => {
          throw new Error('onError test');
        },
        {
          onError: (err) => {
            capturedError = err;
          },
        }
      )
    );

    await act(async () => {
      await result.current.dispatch();
    });

    expect(capturedError).toBeInstanceOf(Error);
    expect(capturedError?.message).toBe('onError test');
  });

  test('should support custom error type', async () => {
    class CustomError extends Error {
      code: number;
      constructor(msg: string, code: number) {
        super(msg);
        this.code = code;
      }
    }

    const { result } = renderHook(() =>
      useAction<() => Promise<string>, CustomError>('test8', async () => {
        throw new CustomError('custom', 400);
      })
    );

    expectTypeOf(result.current.error).toEqualTypeOf<CustomError | undefined>();
    expectTypeOf(result.current.dispatch).returns.resolves.toMatchTypeOf<{
      data?: string;
      error?: CustomError;
    }>();

    await act(async () => {
      await result.current.dispatch();
    });

    expect(result.current.error).toBeInstanceOf(CustomError);
    expect(result.current.error?.code).toBe(400);
  });
});
