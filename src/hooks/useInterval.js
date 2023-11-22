import { useEffect, useRef } from "react";

// Adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Used to make sure latest props are used when using an interval
// Largest difference is that it will run the callback immediately when it's
// changed.
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;

    // If delay is not null, run the callback immediately
    // when the callback changes
    if (delay !== null) {
      savedCallback.current();
    }
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
