import fs from "fs";
import os from "os";
import path from "path";

const MAX_LOG_FILES = 20;

function getLogDir(): string {
  const home = os.homedir();
  switch (process.platform) {
    case "win32":
      return path.join(
        process.env.APPDATA ?? path.join(home, "AppData", "Roaming"),
        "borealis",
        "logs"
      );
    case "darwin":
      return path.join(home, "Library", "Logs", "borealis");
    default:
      return path.join(home, ".local", "share", "borealis", "logs");
  }
}

function pruneOldLogs(logDir: string): void {
  const files = fs
    .readdirSync(logDir)
    .filter((f) => f.startsWith("borealis_") && f.endsWith(".log"))
    .map((f) => {
      const p = path.join(logDir, f);
      return { p, mtime: fs.statSync(p).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  for (const { p } of files.slice(MAX_LOG_FILES - 1)) {
    fs.unlinkSync(p);
  }
}

export class Logger {
  private readonly stream: fs.WriteStream;

  constructor() {
    const logDir = getLogDir();
    fs.mkdirSync(logDir, { recursive: true });
    pruneOldLogs(logDir);

    const ts = new Date()
      .toISOString()
      .replace("T", "_")
      .replace(/:/g, "-")
      .slice(0, 19);
    const logFile = path.join(logDir, `borealis_${ts}.log`);
    this.stream = fs.createWriteStream(logFile, { flags: "a" });
    this.info(`Session started — ${logFile}`);
  }

  private write(level: string, message: string): void {
    this.stream.write(`[${new Date().toISOString()}] [${level}] ${message}\n`);
  }

  info(message: string): void { this.write("INFO", message); }
  warn(message: string): void { this.write("WARN", message); }
  error(message: string): void { this.write("ERROR", message); }

  close(): void {
    this.info("Session ended");
    this.stream.end();
  }
}
