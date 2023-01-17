import { useEffect, useRef } from 'react';

/**
 * Custom hook for calling a function at a specified interval
 * @param callback function to be called
 * @param delay interval in milliseconds, null to stop the interval
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const interval = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(interval);
  }, [delay]);
};
