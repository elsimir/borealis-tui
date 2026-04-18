import React, { useMemo, useState } from "react";
import Screen from "./screen.js";
import ColoniesScreen from "../../features/colonies/ui/components/colonies-screen.js";

export default function MainScreen({ onBack }: { onBack: () => void }) {
  const [showColonies, setShowColonies] = useState(false);

  const commands = useMemo(() => [
    {
      trigger: "c",
      name: "Colonies",
      description: "Manage your colonies",
      onDispatch: () => setShowColonies(true),
    },
  ], []);

  if (showColonies) {
    return <ColoniesScreen onBack={() => setShowColonies(false)} />;
  }

  return <Screen commands={commands} onBack={onBack} />;
}
