import { createContext, useContext, useState, type ReactNode } from "react";
import type { Colony } from "src/engine/gamedata/Colony.js";

interface SelectedColonyControls {
  colony: Colony | null;
  setColony: (colony: Colony) => void;
}

const SelectedColonyContext = createContext<SelectedColonyControls>({
  colony: null,
  setColony: () => {},
});

export function SelectedColonyProvider({ children }: { children: ReactNode }) {
  const [colony, setColony] = useState<Colony | null>(null);
  return (
    <SelectedColonyContext.Provider value={{ colony, setColony }}>
      {children}
    </SelectedColonyContext.Provider>
  );
}

export function useSelectedColony(): SelectedColonyControls {
  return useContext(SelectedColonyContext);
}
