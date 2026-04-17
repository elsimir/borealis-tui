import React from "react";
import { Box, Text } from "ink";
import Screen from "src/ui/screen.js";
import type { Colony } from "src/engine/gamedata/Colony.js";

function ColonyDetails({ colony }: { colony: Colony }) {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>{colony.name}</Text>
      <Box flexDirection="column">
        <Text>Population  <Text bold>{colony.population.toLocaleString()}</Text></Text>
        <Text>Founded     <Text bold>tick {colony.foundedAt}</Text></Text>
      </Box>
    </Box>
  );
}

export default function ColonyDetailsScreen({ colony }: { colony: Colony }) {
  return (
    <Screen commands={[]} context={["Colonies", colony.name]}>
      <ColonyDetails colony={colony} />
    </Screen>
  );
}
