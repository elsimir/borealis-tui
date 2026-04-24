import React, { useState } from "react";
import SelectInstallationDialog from "./select-installation-dialog.js";
import BuildCountDialog from "./build-count-dialog.js";
import type { Installation } from "src/data/schemas/installation.js";

interface Props {
  installations: readonly Installation[];
  onDone: (installation: Installation, count: number) => void;
  onClose: () => void;
}

export default function BuildInstallationDialog({ installations, onDone, onClose }: Props) {
  const [selected, setSelected] = useState<Installation | null>(null);

  if (selected) {
    return (
      <BuildCountDialog
        installation={selected}
        onDone={(count) => onDone(selected, count)}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <SelectInstallationDialog
      installations={installations}
      onDone={setSelected}
      onClose={onClose}
    />
  );
}
