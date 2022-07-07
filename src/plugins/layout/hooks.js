import { useEffect, useState } from 'react';

/* eslint-disable */

// eslint-disable-next-line import/prefer-default-export
export const makeUseSplashScreen = (getSystem) => () => {
  const [canDisplaySplashScreen, setCanDisplaySplashScreen] = useState(true);
  const [canDisplayLayout, setDisplayLayout] = useState(false);
  const { fn } = getSystem();

  useEffect(() => {
    const callback = () => {
      setDisplayLayout(true);
    };
    const requestId = fn.requestIdleCallback(callback);

    return () => {
      fn.cancelIdleCallback(requestId);
    };
  }, []);

  useEffect(() => {
    if (canDisplayLayout) {
      let requestID;

      const callback = () => {
        requestID = fn.requestIdleCallback(() => {
          setCanDisplaySplashScreen(false);
        });
      };
      const timeoutID = globalThis.setTimeout(callback, 1000);

      return () => {
        globalThis.clearTimeout(timeoutID);
        fn.cancelIdleCallback(requestID);
      };
    }
    return undefined;
  }, [canDisplayLayout]);

  return [canDisplaySplashScreen, canDisplayLayout];
};
