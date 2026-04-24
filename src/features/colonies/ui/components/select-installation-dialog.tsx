import React, { useState } from "react";
import SearchDialog from "src/ui/components/search-dialog.js";
import type { Installation } from "src/data/schemas/installation.js";

interface Props {
  installations: readonly Installation[];
  onDone: (installation: Installation) => void;
  onClose: () => void;
}

export default function SelectInstallationDialog({ installations, onDone, onClose }: Props) {
  const [filtered, setFiltered] = useState(installations.map((i) => i.name));

  function handleSearch(query: string) {
    const q = query.toLowerCase();
    setFiltered(installations.map((i) => i.name).filter((name) => name.toLowerCase().includes(q)));
  }

  function handleDone(name: string) {
    const installation = installations.find((i) => i.name === name);
    if (installation) onDone(installation);
  }

  return (
    <SearchDialog
      title="Select Installation"
      entries={filtered}
      onSearch={handleSearch}
      onDone={handleDone}
      onClose={onClose}
    />
  );
}
