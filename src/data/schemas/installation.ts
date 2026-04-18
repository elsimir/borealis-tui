import { z } from "zod";

const InstallationCostSchema = z.object({
  build_points: z.number().positive(),
  resources: z.record(z.string().min(1), z.number().positive()).default({}),
});

const InstallationOutputSchema = z.record(z.string().min(1), z.number().positive());

export const InstallationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  cost: InstallationCostSchema,
  output: InstallationOutputSchema,
});

export const InstallationsFileSchema = z.array(InstallationSchema);

export type Installation = z.infer<typeof InstallationSchema>;
export type InstallationCost = z.infer<typeof InstallationCostSchema>;
export type InstallationOutput = Record<string, number>;
