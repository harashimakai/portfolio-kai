import React, { createContext, useState, type ReactNode } from "react";

type ModeContextValue = {
  darkMode: boolean;
  toggle: () => void;
};

const ModeContext = createContext<ModeContextValue>({
  darkMode: false,
  toggle: () => {},
});

interface Props {
  children: ReactNode;
}

function ProvideMode({ children }: Props) {
  const [darkMode, setDarkMode] = useState(false);

  const toggle = () => setDarkMode((prev) => !prev);

  return (
    <ModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </ModeContext.Provider>
  );
}

export { ModeContext, ProvideMode };
