import { dirname, resolve } from "node:path";
import type { ZodType } from "zod";
import { loadYaml, DataLoadError } from "./loader.js";
import { ResourcesFileSchema } from "./schemas/resource.js";
import { InstallationsFileSchema } from "./schemas/installation.js";
import { GameData } from "../engine/GameData.js";
import { ResourceCollection } from "./ResourceCollection.js";
import { InstallationCollection } from "./InstallationCollection.js";
import type { Logger } from "../engine/Logger.js";

// In dev (bun run src/index.tsx), argv[1] is a real .tsx path — go up one level from src/.
// In compiled (dist/borealis), argv[1] is a virtual /$bunfs/root/... path; use argv[0] (the
// actual binary on disk) to locate data/ next to the binary.
const entrypoint = process.argv[1];
const isCompiled = !entrypoint.endsWith(".tsx") && !entrypoint.endsWith(".ts");
const dataDir = isCompiled
  ? resolve(dirname(process.argv[0]), "data")
  : resolve(dirname(entrypoint), "..", "data");

export class GameDataLoader {
  constructor(private readonly logger: Logger) {}

  async load(): Promise<GameData> {
    const [resources, installations] = await Promise.all([
      this.loadFile("resources", resolve(dataDir, "resources.yaml"), ResourcesFileSchema),
      this.loadFile("installations", resolve(dataDir, "installations.yaml"), InstallationsFileSchema),
    ]);
    this.logger.info(`Loaded ${resources.length} resource(s), ${installations.length} installation(s)`);

    return new GameData(new ResourceCollection(resources), new InstallationCollection(installations));
  }

  private async loadFile<T>(type: string, path: string, schema: ZodType<T>): Promise<T> {
    this.logger.info(`Loading ${type} from ${path}`);
    try {
      return await loadYaml(path, schema);
    } catch (err) {
      const message =
        err instanceof DataLoadError || err instanceof Error
          ? err.message
          : String(err);
      this.logger.error(`Failed to load ${type}: ${message}`);
      throw err;
    }
  }
}
