import type { EmpireId } from "./Empire.js";
import type { SystemId } from "./StarSystem.js";

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
