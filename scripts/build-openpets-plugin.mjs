import { build } from "esbuild";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const entry = resolve(root, "integrations/openpets/plugin/index.src.js");
const output = resolve(root, "integrations/openpets/plugin/index.js");
const coreSource = resolve(root, "src/creature-core");
const coreTarget = resolve(root, "integrations/openpets/plugin/core");
const coreFiles = [
  "behavior.js",
  "clock.js",
  "creature-core.js",
  "index.js",
  "interaction.js",
  "intent.js",
  "models.js",
  "persistence.js",
  "relationship.js",
  "seeded-rng.js",
];

await mkdir(coreTarget, { recursive: true });
for (const file of coreFiles) await copyFile(join(coreSource, file), join(coreTarget, file));
await copyFile(resolve(root, "integrations/openpets/openpets-adapter.js"), resolve(root, "integrations/openpets/plugin/openpets-adapter.js"));
await build({ entryPoints: [entry], outfile: output, bundle: true, format: "esm", platform: "browser", target: "es2022", sourcemap: false, legalComments: "none" });
const manifest = JSON.parse(await readFile(resolve(root, "integrations/openpets/plugin/openpets.plugin.json"), "utf8"));
const built = await readFile(output);
if (built.byteLength > 1024 * 1024) throw new Error(`OpenPets plugin entry exceeds 1 MiB: ${built.byteLength}`);
console.log(JSON.stringify({ status: "PASS", output, bytes: built.byteLength, entry: manifest.entry }));
