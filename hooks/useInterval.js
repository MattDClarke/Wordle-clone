import { useEffect, useRef } from 'react';

// from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  // setInterval will reference old props and state -> solution is to use a ref
  // -> change callback on each render
  // each render -> new callback closes over fresh props and state - state updates as expected
  // mutable savedCallback variable pointing to the latest interval callback
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
