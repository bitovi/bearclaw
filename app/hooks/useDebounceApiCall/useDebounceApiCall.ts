import { useEffect } from "react";
import { usePrevious } from "../usePrevious";

/**
 * A simple utility hook for scheduling an abortable API call that listens to a stateful value
 */
export function useDebounceApiCall<T>({
  delay,
  apiCall,
}: {
  delay?: number;
  apiCall: T extends Function ? T : never;
}) {
  const prevCallback = usePrevious(apiCall);
  const prevDelay = usePrevious(delay);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    // previous checks to avoid early firing due to StrictMode in dev
    if (prevCallback !== apiCall || prevDelay !== delay) {
      timer = setTimeout(() => apiCall(), delay || 500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [delay, apiCall, prevDelay, prevCallback]);
}
