import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

/**
 * Teaches `node --test` the "@/" alias that tsconfig gives the app.
 *
 * Without it the test runner can only reach modules that happen to have no
 * aliased runtime imports, which ruled out catalog.ts — the file that prices
 * every booking. Testing the real pricing path is worth a resolver hook.
 */
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

export async function resolve(specifier, context, next) {
  if (!specifier.startsWith("@/")) return next(specifier, context);

  const base = path.join(SRC, specifier.slice(2));
  // The app writes extensionless imports; Node's ESM resolver needs one.
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")];
  const found = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (!found) return next(specifier, context);

  return next(pathToFileURL(found).href, context);
}
