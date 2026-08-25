import { spawnSync } from "node:child_process";

const expectedRepository = "KimGSeok/design-system";
const currentRepository = process.env.GITHUB_REPOSITORY;

if (currentRepository !== expectedRepository) {
  console.error(
    [
      "Package publishing refused.",
      `Expected GITHUB_REPOSITORY=${expectedRepository}, received ${currentRepository ?? "unset"}.`,
      "Publish through the protected GitHub Actions workflow in the dedicated design-system repository.",
    ].join("\n"),
  );
  process.exit(1);
}

const result = spawnSync("pnpm", ["exec", "changeset", "publish"], {
  env: process.env,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
