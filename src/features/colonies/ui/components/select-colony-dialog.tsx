import React, { useState } from "react";
import SearchDialog from "src/ui/components/search-dialog.js";
import type { Colony } from "src/engine/gamedata/Colony.js";

interface SelectColonyDialogProps {
  colonies: Colony[];
  onDone: (colony: Colony) => void;
  onClose?: () => void;
}

export default function SelectColonyDialog({ colonies, onDone, onClose }: SelectColonyDialogProps) {
  const [filtered, setFiltered] = useState(colonies.map((c) => c.name));

  function handleSearch(query: string) {
    const q = query.toLowerCase();
    setFiltered(colonies.map((c) => c.name).filter((name) => name.toLowerCase().includes(q)));
  }

  function handleDone(name: string) {
    const colony = colonies.find((c) => c.name === name);
    if (colony) { onDone(colony); onClose?.(); }
  }

  return (
    <SearchDialog
      title="Select Colony"
      entries={filtered}
      onSearch={handleSearch}
      onDone={handleDone}
      onClose={() => onClose?.()}
    />
  );
}
