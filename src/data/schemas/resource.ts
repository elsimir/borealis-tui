import { z } from "zod";

export const ResourceRarity = z.enum(["common", "uncommon", "rare"]);
export type ResourceRarity = z.infer<typeof ResourceRarity>;

export const ResourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  base_value: z.number().nonnegative().default(0),
  mineable: z.boolean().default(false),
  rarity: ResourceRarity.default("common"),
});

export const ResourcesFileSchema = z.array(ResourceSchema);

export type Resource = z.infer<typeof ResourceSchema>;
