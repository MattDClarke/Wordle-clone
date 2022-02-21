import { useMemo, createContext, useEffect, useState } from 'react';

import {
  HIGH_CONTRAST_MODE_KEY,
  INITIAL_HIGH_CONTRAST_MODE_CSS_PROP,
} from '../lib/constants';

export const HighContrastModeContext = createContext();

export const HighContrastModeProvider = function ({ children }) {
  // initialize state to undefined because at first render at compile time - no access to window object
  const [highContrastMode, rawSetHighContrastMode] = useState(undefined);

  // will run after React app rehydrates
  useEffect(() => {
    const root = window.document.documentElement;

    // Because colors matter so much for the initial page view, we're
    // doing a lot of the work in gatsby-ssr. That way it can happen before
    // the React component tree mounts.
    const initialHighContrastValue = root.style.getPropertyValue(
      INITIAL_HIGH_CONTRAST_MODE_CSS_PROP
    );

    rawSetHighContrastMode(initialHighContrastValue);
  }, []);

  const contextValue = useMemo(() => {
    function setHighContrastMode(newValue) {
      localStorage.setItem(HIGH_CONTRAST_MODE_KEY, newValue);
      rawSetHighContrastMode(newValue);
    }

    return {
      highContrastMode,
      setHighContrastMode,
    };
  }, [highContrastMode, rawSetHighContrastMode]);

  return (
    <HighContrastModeContext.Provider value={contextValue}>
      {children}
    </HighContrastModeContext.Provider>
  );
};
