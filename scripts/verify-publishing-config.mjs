import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedRepository = "https://github.com/KimGSeok/design-system.git";
const expectedRegistry = "https://npm.pkg.github.com";
const packageDirectories = [
  "foundation/tokens",
  "foundation/motion",
  "foundation/icons",
  "components/button",
  "primitives",
  "components/forms",
  "components/feedback",
  "components/overlays",
  "components/navigation",
  "components/date-picker",
  "catalog",
];
const errors = [];

for (const directory of packageDirectories) {
  const path = join(
    root,
    "packages",
    "design-systems",
    directory,
    "package.json",
  );
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  const label = `packages/design-systems/${directory}/package.json`;

  expect(
    manifest.name === manifest.name?.toLowerCase() &&
      manifest.name?.startsWith("@kimgseok/"),
    `${label}: package name must use the lowercase @kimgseok scope`,
  );
  expect(manifest.private !== true, `${label}: publishable package cannot be private`);
  expect(Boolean(manifest.description), `${label}: description is required`);
  expect(manifest.license === "UNLICENSED", `${label}: license must be UNLICENSED`);
  expect(
    manifest.repository?.type === "git" &&
      manifest.repository?.url === expectedRepository &&
      manifest.repository?.directory === `packages/design-systems/${directory}`,
    `${label}: repository metadata must target the dedicated design-system repository`,
  );
  expect(
    manifest.publishConfig?.registry === expectedRegistry &&
      manifest.publishConfig?.access === "restricted",
    `${label}: publishConfig must target restricted GitHub Packages`,
  );
}

const npmrc = readFileSync(join(root, ".npmrc"), "utf8");
expect(
  npmrc.trim() === `@kimgseok:registry=${expectedRegistry}`,
  ".npmrc must contain only the tokenless @kimgseok registry mapping",
);
expect(!/_authToken\s*=/.test(npmrc), ".npmrc must not contain an authentication token");

const changesetConfig = JSON.parse(
  readFileSync(join(root, ".changeset", "config.json"), "utf8"),
);
expect(
  changesetConfig.access === "restricted",
  ".changeset/config.json must keep package access restricted",
);
expect(
  changesetConfig.baseBranch === "main",
  ".changeset/config.json must target main",
);
expect(
  changesetConfig.updateInternalDependencies === "patch",
  ".changeset/config.json must bump internal dependency ranges from patch releases",
);

const workspaceManifest = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
expect(
  workspaceManifest.devDependencies?.["@changesets/cli"],
  "workspace must install @changesets/cli",
);
expect(
  workspaceManifest.scripts?.release === "node scripts/release-packages.mjs",
  "workspace release script must use the repository guard",
);
expect(
  workspaceManifest.scripts?.["version-packages"] === "changeset version",
  "workspace must expose the Changesets version command",
);

const releaseScript = readFileSync(
  join(root, "scripts", "release-packages.mjs"),
  "utf8",
);
expect(
  releaseScript.includes('const expectedRepository = "KimGSeok/design-system"'),
  "release script must refuse publishing from other repositories",
);

const workflow = readFileSync(
  join(root, ".github", "workflows", "release-packages.yml"),
  "utf8",
);
expect(
  workflow.includes("workflow_dispatch:"),
  "release workflow must be manually dispatched",
);
expect(
  !/^\s+push:/m.test(workflow),
  "release workflow must not publish automatically on push",
);
expect(
  workflow.includes(
    "github.repository == 'KimGSeok/design-system' && github.ref == 'refs/heads/main'",
  ),
  "release workflow must run only from main in the dedicated repository",
);
expect(
  workflow.includes("packages: write"),
  "release workflow must grant package write permission",
);
expect(
  workflow.includes("uses: changesets/action@v1"),
  "release workflow must use the pnpm 9 compatible Changesets v1 action",
);
expect(
  workflow.includes("GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}"),
  "release workflow must authenticate the Changesets action with GITHUB_TOKEN",
);
expect(
  workflow.includes("NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}"),
  "release workflow must authenticate publishing with its repository GITHUB_TOKEN",
);

if (errors.length > 0) {
  throw new Error(
    `GitHub Packages configuration is invalid:\n- ${errors.join("\n- ")}`,
  );
}

console.log(
  `private GitHub Packages configuration passed (${packageDirectories.length} packages)`,
);

function expect(condition, message) {
  if (!condition) errors.push(message);
}
