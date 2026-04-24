import { z } from "zod";

const InstallationsListSchema = z
  .array(z.record(z.string().min(1), z.number().int().positive()))
  .transform((entries) => Object.assign({}, ...entries) as Record<string, number>);

const GameSetupProfileSchema = z.object({
  installations: InstallationsListSchema,
});

const GameSetupSchema = z.object({
  profiles: z.record(z.string().min(1), GameSetupProfileSchema),
});

export const SettingsFileSchema = z.object({
  production_step: z.number().int().positive(),
  game_setup: GameSetupSchema,
});

export type Settings = z.infer<typeof SettingsFileSchema>;
export type GameSetupProfile = z.infer<typeof GameSetupProfileSchema>;
