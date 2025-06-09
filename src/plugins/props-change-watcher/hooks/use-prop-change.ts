import { useEffect, useRef } from 'react';

type UsePropChangeCallback = (newValue: unknown, oldValue: unknown) => void;

const usePropChange = (prop: string | object | undefined, callback: UsePropChangeCallback) => {
  const isInitialMount = useRef(true);
  const previousProp = useRef(prop);

  useEffect(() => {
    if (isInitialMount.current) {
      // skip the first render
      isInitialMount.current = false;
    } else if (previousProp.current !== prop) {
      // call the callback only if the prop has changed
      callback(prop, previousProp.current);
    }

    // update the previous prop value
    previousProp.current = prop;
  }, [prop, callback]);
};

export default usePropChange;
