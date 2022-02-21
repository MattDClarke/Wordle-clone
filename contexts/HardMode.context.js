import { useMemo, createContext, useEffect, useState } from 'react';

import { HARD_MODE_KEY, INITIAL_HARD_MODE_CSS_PROP } from '../lib/constants';

export const HardModeContext = createContext();

export const HardModeProvider = function ({ children }) {
  // initialize state to undefined because at first render at compile time - no access to window object
  const [hardMode, rawSetHardMode] = useState(undefined);

  // will run after React app rehydrates
  useEffect(() => {
    const root = window.document.documentElement;

    const initialHardModeValue = root.style.getPropertyValue(
      INITIAL_HARD_MODE_CSS_PROP
    );

    rawSetHardMode(initialHardModeValue);
  }, []);

  const contextValue = useMemo(() => {
    function setHardMode(newValue) {
      localStorage.setItem(HARD_MODE_KEY, newValue);
      rawSetHardMode(newValue);
    }

    return {
      hardMode,
      setHardMode,
    };
  }, [hardMode, rawSetHardMode]);

  return (
    <HardModeContext.Provider value={contextValue}>
      {children}
    </HardModeContext.Provider>
  );
};
