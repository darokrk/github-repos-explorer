import { useCallback, useEffect, useRef } from 'react';

export interface DebouncedCallback<TValue> {
  readonly run: (value: TValue) => void;
  readonly cancel: () => void;
}

export function useDebouncedCallback<TValue>(
  callback: (value: TValue) => void,
  delayMs: number,
): DebouncedCallback<TValue> {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  const run = (value: TValue) => {
    cancel();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      callback(value);
    }, delayMs);
  };

  return { run, cancel };
}
