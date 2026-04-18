import { readFile } from "node:fs/promises";
import { parseDocument, LineCounter } from "yaml";
import type { ZodType } from "zod";

export class DataLoadError extends Error {
  constructor(
    message: string,
    public readonly file: string,
  ) {
    super(`${file}: ${message}`);
    this.name = "DataLoadError";
  }
}

export async function loadYaml<T>(
  path: string,
  schema: ZodType<T>,
): Promise<T> {
  const source = await readFile(path, "utf8");
  const lineCounter = new LineCounter();
  const doc = parseDocument(source, { lineCounter, prettyErrors: true });

  if (doc.errors.length > 0) {
    const first = doc.errors[0];
    throw new DataLoadError(first.message, path);
  }

  const parsed = schema.safeParse(doc.toJS());
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where = issue.path.length ? ` at ${issue.path.join(".")}` : "";
    throw new DataLoadError(`${issue.message}${where}`, path);
  }
  return parsed.data;
}
