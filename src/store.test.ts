import { beforeEach, describe, expect, test } from 'vitest';

import { ActionStore } from './store';

describe('ActionStore', () => {
  beforeEach(() => {
    ActionStore.getState().reset();
  });

  test('should get default action state', () => {
    const action = ActionStore.getState().getAction('non-existent');
    expect(action).toEqual({ isLoading: false, error: undefined, result: undefined });
  });

  test('should set and get action state', () => {
    ActionStore.getState().setAction('test', {
      isLoading: true,
      error: new Error('test'),
      result: 'data',
    });
    const action = ActionStore.getState().getAction('test');
    expect(action).toEqual({ isLoading: true, error: expect.any(Error), result: 'data' });
  });

  test('should set action result', () => {
    ActionStore.getState().setActionResult('test', 'data2');
    const action = ActionStore.getState().getAction('test');
    expect(action).toEqual({ isLoading: false, error: undefined, result: 'data2' });
  });

  test('should set action loading', () => {
    ActionStore.getState().setActionLoading('test', true);
    const action = ActionStore.getState().getAction('test');
    expect(action).toEqual({ isLoading: true, error: undefined, result: undefined });
  });

  test('should reset specific action', () => {
    ActionStore.getState().setAction('test', {
      isLoading: true,
      error: new Error('test'),
      result: 'data',
    });
    ActionStore.getState().resetAction('test');
    const action = ActionStore.getState().getAction('test');
    expect(action).toEqual({ isLoading: false, error: undefined, result: undefined });
  });

  test('should reset all actions', () => {
    ActionStore.getState().setAction('test1', {
      isLoading: true,
      error: undefined,
      result: 'data1',
    });
    ActionStore.getState().setAction('test2', {
      isLoading: false,
      error: new Error(),
      result: undefined,
    });

    ActionStore.getState().reset();

    expect(ActionStore.getState().actions).toEqual({});
  });
});
