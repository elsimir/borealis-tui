import { createContext, useContext, type ReactNode } from "react";

interface ScreenControls {
  setScreen: (screen: ReactNode) => void;
  replaceScreen: (screen: ReactNode) => void;
  popScreen: () => void;
}

export const ScreenContext = createContext<ScreenControls>({
  setScreen: () => {},
  replaceScreen: () => {},
  popScreen: () => {},
});

export function useSetScreen(): ScreenControls {
  return useContext(ScreenContext);
}
