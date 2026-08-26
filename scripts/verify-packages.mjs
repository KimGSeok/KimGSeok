import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const packages = [
  ["tokens", "foundation/tokens"],
  ["icons", "foundation/icons"],
  ["button", "components/button"],
  ["primitives", "primitives"],
  ["forms", "components/forms"],
  ["feedback", "components/feedback"],
  ["overlays", "components/overlays"],
  ["navigation", "components/navigation"],
  ["date-picker", "components/date-picker"],
  ["catalog", "catalog"],
];
const destination = mkdtempSync(join(tmpdir(), "kimgseok-design-pack-"));

try {
  const archives = {};
  for (const [name, directory] of packages) {
    const cwd = new URL(
      `../packages/design-systems/${directory}/`,
      import.meta.url,
    );
    const packed = spawnSync(
      "pnpm",
      ["pack", "--pack-destination", destination],
      { cwd, encoding: "utf8" },
    );
    if (packed.status !== 0)
      throw new Error(`${name} pack failed: ${packed.stderr}`);
    const archive = packed.stdout.trim().split("\n").at(-1);
    archives[jsonName(name)] = archive;
    const manifest = spawnSync(
      "tar",
      ["-xOf", archive, "package/package.json"],
      { encoding: "utf8" },
    );
    if (manifest.status !== 0)
      throw new Error(`${name} manifest extraction failed: ${manifest.stderr}`);
    const json = JSON.parse(manifest.stdout);
    if (json.private) throw new Error(`${name} is still private.`);
    if (JSON.stringify(json).includes("workspace:"))
      throw new Error(`${name} pack contains workspace protocol.`);
    const listing = spawnSync("tar", ["-tf", archive], {
      encoding: "utf8",
    }).stdout.split("\n");
    for (const target of Object.values(json.exports ?? {})) {
      const paths =
        typeof target === "string" ? [target] : Object.values(target);
      for (const path of paths)
        if (
          typeof path === "string" &&
          path.startsWith("./dist/") &&
          !listing.includes(`package/${path.slice(2)}`)
        )
          throw new Error(`${name} pack is missing ${path}.`);
    }
  }
  const consumer = join(destination, "consumer");
  mkdirSync(join(consumer, "app"), { recursive: true });
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify(
      {
        private: true,
        scripts: { build: "next build --webpack" },
        dependencies: {
          ...Object.fromEntries(
            Object.entries(archives).map(([name, path]) => [
              name,
              `file:${path}`,
            ]),
          ),
          next: "16.3.2",
          react: "19.1.0",
          "react-dom": "19.1.0",
          "react-native": "0.81.0",
          "react-native-safe-area-context": "5.6.1",
          "react-native-svg": "15.12.1",
        },
        pnpm: {
          overrides: Object.fromEntries(
            Object.entries(archives).map(([name, path]) => [name, `file:${path}`]),
          ),
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(consumer, "app", "layout.js"),
    'import "@kimgseok/design-tokens/css"; export default function Layout({children}) { return <html><body>{children}</body></html> }',
  );
  writeFileSync(
    join(consumer, "app", "client.js"),
    '"use client"; import { Button } from "@kimgseok/design-button/web"; import { ToastViewport } from "@kimgseok/design-feedback/web"; import { Tabs } from "@kimgseok/design-navigation/web"; import { Calendar, DatePicker, DateRangePicker } from "@kimgseok/design-date-picker/web"; const noop=()=>{}; export default function Client(){ return <><Button onAction={noop}>확인</Button><ToastViewport toast={null} /><Tabs accessibilityLabel="검증" items={[{value:"a",label:"A",content:"A"}]} onValueChange={noop} value="a" /><Calendar accessibilityLabel="Calendar" locale="en-US" onValueChange={noop} value="2026-08-24" /><DatePicker label="Date" locale="en-US" onValueChange={noop} value="2026-08-24" /><DateRangePicker label="Range" locale="en-US" onValueChange={noop} value={{start:"2026-08-24",end:"2026-08-25"}} /></> }',
  );
  writeFileSync(
    join(consumer, "app", "page.js"),
    'import Client from "./client"; export default function Page(){ return <main><Client /></main> }',
  );
  const install = spawnSync(
    "pnpm",
    ["install", "--ignore-scripts", "--no-frozen-lockfile"],
    { cwd: consumer, encoding: "utf8" },
  );
  if (install.status !== 0)
    throw new Error(
      `clean consumer install failed: ${install.stderr || install.stdout}`,
    );
  const build = spawnSync("pnpm", ["run", "build"], {
    cwd: consumer,
    encoding: "utf8",
  });
  if (build.status !== 0)
    throw new Error(
      `clean consumer build failed: ${build.stderr || build.stdout}`,
    );
  console.log(
    `publishable package checks passed (${packages.length} packages)`,
  );
} finally {
  rmSync(destination, { recursive: true, force: true });
}

function jsonName(folder) {
  return folder === "catalog"
    ? "@kimgseok/design-catalog"
    : `@kimgseok/design-${folder}`;
}
