import type { EmpireId } from "src/engine/Empire";
import type { SystemId } from "src/engine/StarSystem";

export type SurveyLevel =
  | "detected"   // position known
  | "scanned"    // star type + planet count known
  | "surveyed";  // full planet details known

export interface KnownSystem {
  empireId: EmpireId;
  systemId: SystemId;
  surveyLevel: SurveyLevel;
  firstContactAt: number;
  lastUpdatedAt: number;
}
