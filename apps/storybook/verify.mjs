import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import axe from "axe-core";
import { chromium } from "playwright";

const output = resolve("storybook-static");
const mime = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(
    new URL(request.url ?? "/", "http://localhost").pathname,
  );
  let file = resolve(output, `.${pathname === "/" ? "/index.html" : pathname}`);
  if (file !== output && !file.startsWith(`${output}${sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    response.setHeader(
      "content-type",
      mime[extname(file)] ?? "application/octet-stream",
    );
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolveListen) =>
  server.listen(0, "127.0.0.1", resolveListen),
);
const address = server.address();
if (!address || typeof address === "string")
  throw new Error("Storybook verification server failed.");
const base = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const id of [
    "actions-button--primary",
    "actions-button--secondary",
    "actions-button--tertiary",
    "actions-button--danger",
    "actions-button--disabled",
    "actions-button--loading",
    "actions-button--long-korean-label",
    "actions-button--retryable-error",
    "foundations-primitives--typography",
    "foundations-primitives--icon-buttons",
    "foundations-primitives--surfaces",
    "foundations-primitives--dividers",
    "foundations-primitives--dark-states",
    "foundations-primitives--badges",
    "foundations-primitives--badges-dark",
    "foundations-primitives--badge-usage",
    "foundations-primitives--avatars",
    "foundations-primitives--avatars-dark",
    "foundations-primitives--empty-states",
    "foundations-primitives--empty-states-dark",
    "foundations-primitives--empty-states-no-icon-error",
    "foundations-primitives--skeletons",
    "foundations-primitives--skeletons-dark",
    "foundations-primitives--tables",
    "foundations-primitives--tables-dark",
    "forms-textfield--default",
    "forms-textfield--help-text",
    "forms-textfield--error",
    "forms-textfield--disabled",
    "forms-textfield--required",
    "forms-textfield--multiline",
    "forms-textfield--choices",
    "forms-textfield--validation-lifecycle",
    "forms-textfield--disabled-selections",
    "forms-textfield--dark-states",
    "forms-textfield--search",
    "forms-textfield--search-error",
    "forms-textfield--search-dark",
    "forms-textfield--search-narrow",
    "forms-textfield--calendar-and-date-picker",
    "forms-textfield--date-picker-constraints",
    "forms-textfield--date-picker-error-and-disabled",
    "forms-textfield--date-range-preset",
    "forms-textfield--date-picker-controlled",
    "feedback-progress--determinate",
    "feedback-progress--indeterminate",
    "feedback-progress--spinners",
    "feedback-progress--dark",
    "feedback-progress--toast-success",
    "feedback-progress--toast-error",
    "feedback-progress--callouts",
    "overlays-dialog--default",
    "overlays-dialog--destructive",
    "overlays-dialog--dark",
    "overlays-dialog--bottom-sheet-default",
    "overlays-dialog--nested",
    "overlays-dialog--tooltip-default",
    "overlays-dialog--dialog-tooltip",
  ]) {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, {
      waitUntil: "networkidle",
    });
    try {
      await page.waitForFunction(
        () =>
          document.documentElement.lang === "ko" && document.title.length > 0,
      );
    } catch {
      throw new Error(`${id} did not load a localized Storybook document.`);
    }
    await page.addScriptTag({ content: axe.source });
    const violations = await page.evaluate(async () =>
      (
        await window.axe.run(document, {
          rules: {
            "landmark-one-main": { enabled: false },
            "page-has-heading-one": { enabled: false },
            region: { enabled: false },
          },
        })
      ).violations.map(({ id, impact }) => `${impact}:${id}`),
    );
    if (violations.length)
      throw new Error(
        `${id} accessibility violations: ${violations.join(", ")}`,
      );
  }
  for (const id of [
    "navigation-tabs--default",
    "navigation-tabs--overflow",
    "navigation-tabs--dark",
    "navigation-tabs--segmented",
    "navigation-tabs--segmented-two",
    "navigation-tabs--segmented-long",
    "navigation-tabs--segmented-dark",
    "navigation-tabs--chips",
    "navigation-tabs--chips-long",
    "navigation-tabs--chips-dark",
    "navigation-tabs--filter-bar-default",
    "navigation-tabs--filter-bar-narrow",
    "navigation-tabs--filter-bar-dark",
    "navigation-tabs--filter-bar-loading",
    "navigation-tabs--filter-bar-disabled",
    "navigation-tabs--pagination-default",
    "navigation-tabs--pagination-first",
    "navigation-tabs--pagination-disabled",
    "navigation-tabs--pagination-dark",
    "navigation-tabs--pagination-last",
    "navigation-tabs--pagination-small",
    "navigation-tabs--pagination-narrow",
    "navigation-tabs--app-bar-default",
    "navigation-tabs--app-bar-long",
    "navigation-tabs--app-bar-dark",
    "navigation-tabs--app-bar-no-actions",
    "navigation-tabs--app-bar-two-actions",
    "navigation-tabs--app-bar-disabled-loading",
    "navigation-tabs--app-bar-error",
    "navigation-tabs--breadcrumb-default",
    "navigation-tabs--breadcrumb-two",
    "navigation-tabs--breadcrumb-five",
    "navigation-tabs--breadcrumb-dark",
  ]) {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, {
      waitUntil: "networkidle",
    });
    await page.addScriptTag({ content: axe.source });
    const violations = await page.evaluate(async () =>
      (
        await window.axe.run(document, {
          rules: {
            "landmark-one-main": { enabled: false },
            "page-has-heading-one": { enabled: false },
            region: { enabled: false },
          },
        })
      ).violations.map(({ id: rule, impact }) => `${impact}:${rule}`),
    );
    if (violations.length)
      throw new Error(
        `${id} accessibility violations: ${violations.join(", ")}`,
      );
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--badges&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("button").count()) !== 0 ||
    (await page.locator("[role]").count()) !== 0
  )
    throw new Error(
      "Badge became an interactive or unsolicited live semantic element.",
    );
  const longBadge = page.getByText(
    "오늘 주문하면 내일 도착하는 무료 배송 상품",
  );
  const longBadgeBox = await longBadge.boundingBox();
  if (
    !longBadgeBox ||
    longBadgeBox.x + longBadgeBox.width > 320 ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error("Long Badge overflowed a 320px viewport.");
  if (
    Number.parseFloat(
      await longBadge.evaluate((node) => getComputedStyle(node).fontSize),
    ) >=
    Number.parseFloat(
      await page
        .getByText("기본")
        .evaluate((node) => getComputedStyle(node).fontSize),
    )
  )
    throw new Error("Badge sm and md typography sizes are not distinct.");
  const toneColors = await Promise.all(
    ["배송 완료", "확인 필요", "결제 실패", "새 소식"].map((label) =>
      page
        .getByText(label)
        .evaluate(
          (node) =>
            `${getComputedStyle(node).backgroundColor}/${getComputedStyle(node).color}/${getComputedStyle(node).borderColor}`,
        ),
    ),
  );
  if (new Set(toneColors).size !== 4)
    throw new Error(
      "Badge semantic tones collapsed to the same visual recipe.",
    );
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--badges-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  for (const tone of ["neutral", "positive", "caution", "negative", "info"]) {
    const match = await page.getByText(tone).evaluate((node, currentTone) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      const prefix =
        currentTone === "neutral" ? null : `--kg-color-status-${currentTone}`;
      probe.style.backgroundColor = `var(${prefix ? `${prefix}-bg` : "--kg-color-bg-surface"})`;
      probe.style.color = `var(${prefix ? `${prefix}-fg` : "--kg-color-fg-secondary"})`;
      probe.style.borderColor = `var(${prefix ? `${prefix}-border` : "--kg-color-border-subtle"})`;
      theme.append(probe);
      const actual = getComputedStyle(node);
      const expected = getComputedStyle(probe);
      const matches =
        actual.backgroundColor === expected.backgroundColor &&
        actual.color === expected.color &&
        actual.borderColor === expected.borderColor;
      probe.remove();
      return matches;
    }, tone);
    if (!match)
      throw new Error(
        `Dark Badge ${tone} does not consume its semantic recipe.`,
      );
  }
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--badge-usage&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const badgeAnnouncement = page.locator('[aria-live="polite"]');
  if (
    (await badgeAnnouncement.count()) !== 1 ||
    (await badgeAnnouncement.textContent()) !== "" ||
    (await page
      .getByText("배송 시작", { exact: true })
      .getAttribute("aria-live")) !== null
  )
    throw new Error("Badge usage initial announcement ownership is incorrect.");
  await page.getByRole("button", { name: "배송 완료로 변경" }).click();
  if (
    !(await page.getByText("배송 완료", { exact: true }).isVisible()) ||
    (await badgeAnnouncement.textContent()) !==
      "주문이 배송 완료 상태로 변경됐습니다." ||
    (await page
      .getByText("배송 완료", { exact: true })
      .getAttribute("aria-live")) !== null
  )
    throw new Error(
      "Badge usage did not keep dynamic announcement product-owned.",
    );
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--avatars&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("img").count()) !== 2 ||
    (await page.getByRole("img", { name: "김경석 프로필 사진" }).count()) !==
      1 ||
    (await page.getByText("김경", { exact: true }).count()) !== 2 ||
    (await page.getByText("OP", { exact: true }).count()) !== 1
  )
    throw new Error(
      "Avatar labelled/decorative fallback semantics are incorrect.",
    );
  const avatarSizes = await page
    .locator('span[role="img"], span[aria-hidden="true"]')
    .evaluateAll((nodes) =>
      nodes
        .filter((node) => node.parentElement?.tagName !== "SPAN")
        .map((node) => node.getBoundingClientRect().width),
    );
  if (
    !avatarSizes.includes(32) ||
    !avatarSizes.includes(40) ||
    !avatarSizes.includes(56)
  )
    throw new Error("Avatar sm/md/lg geometry is incorrect.");
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--avatars-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const avatarDarkTokens = await page
    .getByRole("img", { name: "디자인 팀 프로필 사진" })
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--kg-color-bg-surface)";
      probe.style.borderColor = "var(--kg-color-border-subtle)";
      probe.style.color = "var(--kg-color-fg-secondary)";
      theme.append(probe);
      const actual = getComputedStyle(node);
      const expected = getComputedStyle(probe);
      const matches =
        actual.backgroundColor === expected.backgroundColor &&
        actual.borderColor === expected.borderColor &&
        actual.color === expected.color;
      probe.remove();
      return matches;
    });
  if (!avatarDarkTokens)
    throw new Error(
      "Dark Avatar does not consume its semantic fallback recipe.",
    );
  await page.route("https://avatar.test/**", async (route) => {
    const url = route.request().url();
    if (url.endsWith("/failure.svg")) {
      await route.abort("failed");
      return;
    }
    if (url.endsWith("/replacement.svg"))
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
    const fill = url.endsWith("/replacement.svg") ? "#ff7a00" : "#3182f6";
    await route.fulfill({
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${fill}"/></svg>`,
      contentType: "image/svg+xml",
      status: 200,
    });
  });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--avatar-image-states&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.addScriptTag({ content: axe.source });
  const avatarViolations = await page.evaluate(
    async () =>
      (
        await window.axe.run(document, {
          rules: {
            "landmark-one-main": { enabled: false },
            "page-has-heading-one": { enabled: false },
            region: { enabled: false },
          },
        })
      ).violations,
  );
  if (avatarViolations.length)
    throw new Error("Avatar image states have accessibility violations.");
  const successfulImage = page
    .getByRole("img", { name: "로드 성공 프로필 사진" })
    .locator("img");
  const failedAvatar = page.getByRole("img", { name: "로드 실패 프로필 사진" });
  const failedImage = failedAvatar.locator("img");
  if (
    (await successfulImage.evaluate(
      (node) => getComputedStyle(node).opacity,
    )) !== "1" ||
    (await failedImage.evaluate((node) => getComputedStyle(node).opacity)) !==
      "0" ||
    !(await failedAvatar.getByText("실패", { exact: true }).isVisible()) ||
    (await failedAvatar.getAttribute("aria-label")) !== "로드 실패 프로필 사진"
  )
    throw new Error("Avatar load/error fallback lifecycle is incorrect.");
  await page.getByRole("button", { name: "사진 교체" }).click();
  const replacementAvatar = page.getByRole("img", {
    name: "교체되는 프로필 사진",
  });
  const replacementImage = replacementAvatar.locator("img");
  if (
    (await replacementImage.evaluate(
      (node) => getComputedStyle(node).opacity,
    )) !== "0" ||
    !(await replacementAvatar.getByText("교체", { exact: true }).isVisible()) ||
    (await replacementAvatar.getAttribute("aria-label")) !==
      "교체되는 프로필 사진"
  )
    throw new Error("Avatar exposed a stale image while its source changed.");
  await page.waitForFunction(
    () =>
      document.querySelector(
        'img[data-avatar-source="https://avatar.test/replacement.svg"]',
      ) &&
      getComputedStyle(
        document.querySelector(
          'img[data-avatar-source="https://avatar.test/replacement.svg"]',
        ),
      ).opacity === "1",
  );
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--cards&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.addScriptTag({ content: axe.source });
  const cardViolations = await page.evaluate(
    async () =>
      (
        await window.axe.run(document, {
          rules: {
            "landmark-one-main": { enabled: false },
            "page-has-heading-one": { enabled: false },
            region: { enabled: false },
          },
        })
      ).violations,
  );
  if (
    cardViolations.length ||
    (await page.getByRole("region", { name: "주문 요약" }).count()) !== 1 ||
    (await page.getByRole("button").count()) !== 0
  )
    throw new Error("Card grouping semantics are incorrect.");
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--cards-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const darkCardTokens = await page
    .getByRole("region", { name: "다크 주문 요약" })
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--kg-color-bg-raised)";
      probe.style.borderColor = "var(--kg-color-border-subtle)";
      theme.append(probe);
      const actual = getComputedStyle(node);
      const expected = getComputedStyle(probe);
      const matches =
        actual.backgroundColor === expected.backgroundColor &&
        actual.borderColor === expected.borderColor;
      probe.remove();
      return matches;
    });
  if (!darkCardTokens)
    throw new Error("Dark Card does not consume its surface semantic recipe.");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--cards-long&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const longCard = page.locator("section");
  const longCardButton = page.getByRole("button", { name: "배송 정보 확인" });
  const [longCardBox, longButtonBox] = await Promise.all([
    longCard.boundingBox(),
    longCardButton.boundingBox(),
  ]);
  if (
    !longCardBox ||
    !longButtonBox ||
    (await longCard.getAttribute("tabindex")) !== null ||
    (await page.getByRole("region").count()) !== 0 ||
    longButtonBox.x < longCardBox.x ||
    longButtonBox.x + longButtonBox.width >
      longCardBox.x + longCardBox.width + 1 ||
    longButtonBox.y + longButtonBox.height >
      longCardBox.y + longCardBox.height + 1 ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error(
      "Long Card content clipped, became interactive, or overflowed its 320px viewport.",
    );
  await longCardButton.focus();
  if (
    !(await longCardButton.evaluate(
      (node) =>
        node === document.activeElement &&
        getComputedStyle(node).outlineStyle === "solid",
    ))
  )
    throw new Error("Card child action is not keyboard focusable.");
  await longCardButton.click();
  if (!(await page.getByText("배송 정보가 열렸습니다.").isVisible()))
    throw new Error("Card child action did not activate.");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--list-items&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.addScriptTag({ content: axe.source });
  const listItemViolations = await page.evaluate(
    async () =>
      (
        await window.axe.run(document, {
          rules: {
            "landmark-one-main": { enabled: false },
            "page-has-heading-one": { enabled: false },
            region: { enabled: false },
          },
        })
      ).violations,
  );
  const listAction = page.getByRole("button", {
    name: "배송 현황, 새벽 배송 예정, 오후 6:00",
  });
  if (
    listItemViolations.length ||
    (await listAction.count()) !== 1 ||
    (await page
      .getByText("주문 정보")
      .evaluate((node) => node.closest("button") !== null)) ||
    (await listAction.getAttribute("type")) !== "button"
  )
    throw new Error("ListItem static/action semantics are incorrect.");
  await listAction.focus();
  if (
    (await listAction.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("ListItem keyboard focus ring is missing.");
  const baseListBackground = await listAction.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await listAction.dispatchEvent("pointerdown", { pointerType: "touch" });
  if (
    (await listAction.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    )) === baseListBackground
  )
    throw new Error("ListItem touch pressed state is missing.");
  await listAction.dispatchEvent("pointercancel", { pointerType: "touch" });
  if (
    (await listAction.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    )) !== baseListBackground
  )
    throw new Error("ListItem pointer cancel left pressed state stuck.");
  await listAction.click();
  if (!(await page.getByText("배송 현황을 열었습니다.").isVisible()))
    throw new Error("ListItem action did not activate.");
  const pendingListItem = page.getByRole("button", {
    name: "주문 동기화, 중복 실행을 막고 결과를 확인합니다",
  });
  await pendingListItem.evaluate((node) => {
    node.click();
    node.click();
  });
  if (
    (await pendingListItem.getAttribute("aria-busy")) !== "true" ||
    !(await pendingListItem.isDisabled()) ||
    !(await pendingListItem.getByText("처리 중").isVisible()) ||
    (await page.locator('[data-list-item-sync-calls="true"]').textContent()) !==
      "1"
  )
    throw new Error(
      "ListItem pending action did not expose one busy inactive execution.",
    );
  await page.getByText("주문 동기화가 완료됐습니다.").waitFor();
  if (
    (await pendingListItem.getAttribute("aria-busy")) !== null ||
    (await pendingListItem.isDisabled())
  )
    throw new Error("ListItem pending state did not recover after settlement.");
  await page.getByRole("button", { name: "배송 동기화" }).click();
  if (!(await page.getByText("동기화하지 못했어요.").isVisible()))
    throw new Error("ListItem rejection did not reach its error callback.");
  const disabledListItem = page.getByRole("button", {
    name: "비활성 주문, 변경할 수 없는 주문",
  });
  const controlledLoadingListItem = page.getByRole("button", {
    name: "로딩 주문, 상태를 갱신하고 있습니다",
  });
  if (
    !(await disabledListItem.isDisabled()) ||
    !(await controlledLoadingListItem.isDisabled()) ||
    (await controlledLoadingListItem.getAttribute("aria-busy")) !== "true"
  )
    throw new Error(
      "Disabled or controlled-loading ListItem remained interactive.",
    );
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--list-items-long&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const longListItem = page.getByRole("button", {
    name: "내일 새벽 도착 예정인 주문의 배송지 및 요청 사항",
  });
  const longListBox = await longListItem.boundingBox();
  if (
    !longListBox ||
    longListBox.x < 0 ||
    longListBox.x + longListBox.width > 320 ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error("Long ListItem overflowed its 320px viewport.");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--list-items-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const darkListTokens = await page
    .getByRole("button", { name: "배송 현황" })
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--kg-color-bg-surface)";
      probe.style.color = "var(--kg-color-fg-primary)";
      theme.append(probe);
      const actual = getComputedStyle(node);
      const expected = getComputedStyle(probe);
      const matches =
        actual.backgroundColor === expected.backgroundColor &&
        actual.color === expected.color;
      probe.remove();
      return matches;
    });
  if (!darkListTokens)
    throw new Error("Dark ListItem does not consume semantic surface tokens.");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--empty-states&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const emptySection = page.getByRole("region", {
    name: "주문 내역을 불러오지 못했어요",
  });
  const emptyButton = page.getByRole("button", { name: "다시 시도" });
  const emptyBox = await emptySection.boundingBox();
  if (
    !emptyBox ||
    emptyBox.x < 0 ||
    emptyBox.x + emptyBox.width > 320 ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error("EmptyState overflowed its 320px viewport.");
  await emptyButton.focus();
  if (
    (await emptyButton.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("EmptyState recovery action lacks Button focus treatment.");
  await emptyButton.click();
  if (!(await page.getByText("주문 내역을 다시 불러옵니다.").isVisible()))
    throw new Error(
      "EmptyState recovery action did not report its product-owned result.",
    );
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--empty-states-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const emptyDark = await page
    .getByRole("region", { name: "아직 주문 내역이 없어요" })
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--kg-color-bg-surface)";
      probe.style.color = "var(--kg-color-fg-primary)";
      theme.append(probe);
      const actual = getComputedStyle(node);
      const expected = getComputedStyle(probe);
      const matches =
        actual.backgroundColor === expected.backgroundColor &&
        actual.color === expected.color;
      probe.remove();
      return matches;
    });
  if (!emptyDark)
    throw new Error(
      "Dark EmptyState does not consume semantic surface tokens.",
    );
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--empty-states-no-icon-error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const noIconEmpty = page.getByRole("region", {
    name: "조건에 맞는 주문이 없어요",
  });
  if ((await noIconEmpty.locator("svg").count()) !== 0)
    throw new Error("No-icon EmptyState rendered a decorative icon.");
  await page.getByRole("button", { name: "다시 시도" }).click();
  if (
    !(await page.getByText("주문 내역을 다시 불러오지 못했어요.").isVisible())
  )
    throw new Error(
      "EmptyState rejection did not surface a product-owned recovery result.",
    );
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--skeletons&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const skeletonRegion = page.getByRole("status", {
    name: "주문 정보를 불러오는 중",
  });
  const skeletons = skeletonRegion.locator(".kg-skeleton");
  const fullSkeleton = skeletons.nth(3);
  const fullBox = await fullSkeleton.boundingBox();
  const widths = await skeletons.evaluateAll((nodes) =>
    nodes.slice(0, 4).map((node) => node.getBoundingClientRect().width),
  );
  if (
    (await skeletons.count()) !== 11 ||
    !fullBox ||
    fullBox.x < 0 ||
    fullBox.x + fullBox.width > 320 ||
    !(
      widths[0] < widths[1] &&
      widths[1] < widths[2] &&
      widths[2] < widths[3]
    ) ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error(
      "Skeleton size states, shapes, or 320px containment are incorrect.",
    );
  if (
    (await skeletons.first().getAttribute("aria-hidden")) !== "true" ||
    (await skeletons.first().getAttribute("role")) !== null
  )
    throw new Error(
      "Skeleton became an independently announced accessibility element.",
    );
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (
    (await skeletons
      .first()
      .evaluate((node) => getComputedStyle(node).animationName)) !== "none"
  )
    throw new Error("Skeleton does not respect reduced motion.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--skeletons-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const darkRegion = page.getByRole("status", {
    name: "주문 정보를 불러오는 중",
  });
  if (
    (await darkRegion.count()) !== 1 ||
    (await darkRegion
      .locator(".kg-skeleton")
      .first()
      .getAttribute("aria-hidden")) !== "true"
  )
    throw new Error("Dark Skeleton region lost its named busy boundary.");
  const darkSkeleton = await darkRegion
    .locator(".kg-skeleton")
    .first()
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--kg-color-bg-raised)";
      theme.append(probe);
      const match =
        getComputedStyle(node).backgroundColor ===
        getComputedStyle(probe).backgroundColor;
      probe.remove();
      return match;
    });
  if (!darkSkeleton)
    throw new Error(
      "Dark Skeleton does not consume the semantic raised surface token.",
    );
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--tables-narrow&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const tableRegion = page.getByRole("region", { name: "장문 주문 비교 표" });
  const tableNode = page.getByRole("table", { name: "장문 주문 비교" });
  if (
    (await tableNode.locator('th[scope="col"]').count()) !== 6 ||
    (await tableNode.locator("tbody tr").count()) !== 1 ||
    !(await tableRegion.evaluate(
      (node) => node.scrollWidth > node.clientWidth,
    )) ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error(
      "Table lost native header semantics or narrow contained overflow.",
    );
  await tableRegion.focus();
  if (
    (await tableRegion.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("Table scroll region focus ring is missing.");
  const initialTableScroll = await tableRegion.evaluate(
    (node) => node.scrollLeft,
  );
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(100);
  if (
    (await tableRegion.evaluate((node) => node.scrollLeft)) <=
    initialTableScroll
  )
    throw new Error("Table ArrowRight did not scroll the narrow region.");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--tables-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const darkTable = await page
    .getByRole("table", { name: "주문 요약" })
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      if (!theme) return false;
      const probe = document.createElement("span");
      probe.style.color = "var(--kg-color-fg-primary)";
      theme.append(probe);
      const match =
        getComputedStyle(node).color === getComputedStyle(probe).color;
      probe.remove();
      return match;
    });
  if (!darkTable)
    throw new Error("Dark Table does not consume semantic foreground tokens.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const tabs = page.getByRole("tab");
  for (const tab of await tabs.all()) {
    const controls = await tab.getAttribute("aria-controls");
    if (!controls || (await page.locator(`#${controls}`).count()) !== 1)
      throw new Error(
        "Tab aria-controls does not resolve to one stable panel.",
      );
  }
  if (
    (await page
      .getByRole("tabpanel", { name: "개요" })
      .getAttribute("tabindex")) !== "-1"
  )
    throw new Error("Default Tabs panel added an unnecessary tab stop.");
  await tabs.first().focus();
  if (
    (await tabs
      .first()
      .evaluate((node) => getComputedStyle(node).outlineStyle)) !== "solid"
  )
    throw new Error("Tabs keyboard focus ring is missing.");
  await page.keyboard.press("ArrowRight");
  if (
    (await page
      .getByRole("tab", { name: "활동" })
      .getAttribute("aria-selected")) !== "true"
  )
    throw new Error("Tabs ArrowRight did not select the next enabled tab.");
  if (!(await page.getByRole("tabpanel", { name: "활동" }).isVisible()))
    throw new Error("Tabs did not associate and render the selected panel.");
  await page.keyboard.press("End");
  if (
    (await page
      .getByRole("tab", { name: "멤버" })
      .getAttribute("aria-selected")) !== "true"
  )
    throw new Error("Tabs End did not skip the disabled final tab.");
  await page.keyboard.press("ArrowRight");
  if (
    (await page
      .getByRole("tab", { name: "개요" })
      .getAttribute("aria-selected")) !== "true"
  )
    throw new Error("Tabs keyboard navigation did not wrap.");
  await page.keyboard.press("ArrowLeft");
  if (
    (await page
      .getByRole("tab", { name: "멤버" })
      .getAttribute("aria-selected")) !== "true"
  )
    throw new Error("Tabs ArrowLeft did not wrap and skip disabled tabs.");
  await page.keyboard.press("Home");
  if (
    (await page
      .getByRole("tab", { name: "개요" })
      .getAttribute("aria-selected")) !== "true"
  )
    throw new Error("Tabs Home did not select the first enabled tab.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--overflow&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const overflowTablist = page.getByRole("tablist", { name: "프로젝트 정보" });
  await page.getByRole("tab", { name: "개요" }).focus();
  await page.keyboard.press("End");
  const lastTab = page.getByRole("tab", {
    name: "최근 결제 내역과 환불 진행 상태",
  });
  const [listBox, lastBox] = await Promise.all([
    overflowTablist.boundingBox(),
    lastTab.boundingBox(),
  ]);
  if (
    !listBox ||
    !lastBox ||
    lastBox.x < listBox.x ||
    lastBox.x + lastBox.width > listBox.x + listBox.width + 1
  )
    throw new Error(
      "Keyboard-selected overflow tab was not scrolled into view.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--external-selection&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "마지막 탭 외부 선택" }).click();
  const externalList = page.getByRole("tablist", { name: "프로젝트 정보" });
  const externalTab = page.getByRole("tab", {
    name: "최근 결제 내역과 환불 진행 상태",
  });
  const [externalListBox, externalTabBox] = await Promise.all([
    externalList.boundingBox(),
    externalTab.boundingBox(),
  ]);
  if (
    !externalListBox ||
    !externalTabBox ||
    externalTabBox.x < externalListBox.x ||
    externalTabBox.x + externalTabBox.width >
      externalListBox.x + externalListBox.width + 1
  )
    throw new Error(
      "Externally selected overflow tab was not scrolled into view.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--segmented&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if ((await page.getByRole("radiogroup", { name: "보기 방식" }).count()) !== 1)
    throw new Error("SegmentedControl group accessible name is missing.");
  if ((await page.locator('[role="radio"][aria-checked="true"]').count()) !== 1)
    throw new Error("SegmentedControl must expose exactly one checked option.");
  const listSegment = page.getByRole("radio", { name: "목록" });
  await listSegment.focus();
  if (
    (await listSegment.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("SegmentedControl focus ring is missing.");
  await page.keyboard.press("ArrowRight");
  if (!(await page.getByRole("radio", { name: "격자" }).isChecked()))
    throw new Error("SegmentedControl ArrowRight did not update selection.");
  await page.keyboard.press("ArrowLeft");
  if (!(await listSegment.isChecked()))
    throw new Error("SegmentedControl ArrowLeft did not update selection.");
  await page.keyboard.press("End");
  if (!(await page.getByRole("radio", { name: "지도" }).isChecked()))
    throw new Error("SegmentedControl End did not skip disabled final option.");
  await page.keyboard.press("Home");
  if (!(await listSegment.isChecked()))
    throw new Error("SegmentedControl Home did not select first option.");
  const disabledSegment = page.getByRole("radio", { name: "사용 불가" });
  await disabledSegment.click({ force: true });
  if (!(await listSegment.isChecked()))
    throw new Error("Disabled SegmentedControl option changed selection.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--chips&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if ((await page.getByRole("group", { name: "배송 필터" }).count()) !== 1)
    throw new Error("ChipGroup accessible name is missing.");
  const filterChip = page.getByRole("button", { name: "무료 배송" });
  await filterChip.focus();
  if (
    (await filterChip.getAttribute("aria-pressed")) !== "false" ||
    (await filterChip.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("Chip default or focus state is incorrect.");
  await filterChip.click();
  if ((await filterChip.getAttribute("aria-pressed")) !== "true")
    throw new Error("Chip did not toggle selected state.");
  if (!(await page.getByRole("button", { name: "사용 불가" }).isDisabled()))
    throw new Error("Disabled Chip is interactive.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--chips-long&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const longGroup = page.getByRole("group", { name: "상품 필터" });
  const longChip = page.getByRole("button", {
    name: "오늘 주문하면 내일 도착하는 무료 배송 상품",
  });
  const [groupBox, chipBox] = await Promise.all([
    longGroup.boundingBox(),
    longChip.boundingBox(),
  ]);
  if (
    !groupBox ||
    !chipBox ||
    chipBox.x + chipBox.width > groupBox.x + groupBox.width + 1
  )
    throw new Error("Long Chip overflowed its 320px group.");
  const newChipBox = await page
    .getByRole("button", { name: "신상품" })
    .boundingBox();
  if (!newChipBox || newChipBox.y <= chipBox.y)
    throw new Error("ChipGroup did not wrap three Chips onto another row.");
  if (
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )
  )
    throw new Error("ChipGroup caused document horizontal overflow.");
  const baseChipColor = await longChip.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await longChip.dispatchEvent("pointerdown", { pointerType: "touch" });
  if (
    (await longChip.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    )) === baseChipColor
  )
    throw new Error("Chip pressed state did not render.");
  await longChip.dispatchEvent("pointercancel", { pointerType: "touch" });
  if (
    (await longChip.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    )) !== baseChipColor
  )
    throw new Error("Chip pointer cancel left pressed state stuck.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--filter-bar-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const filterBar = page.getByRole("region", { name: "상품 필터" });
  const tomorrow = page.getByRole("button", { name: "내일 도착" });
  if (
    (await filterBar.count()) !== 1 ||
    (await page
      .getByRole("button", { name: "무료 배송" })
      .getAttribute("aria-pressed")) !== "true" ||
    !(await page.getByRole("button", { name: "품절 상품" }).isDisabled())
  )
    throw new Error(
      "FilterBar default selection or disabled state is incorrect.",
    );
  await tomorrow.click();
  if (
    (await tomorrow.getAttribute("aria-pressed")) !== "true" ||
    !(await page.getByText("선택 필터: free, tomorrow").isVisible())
  )
    throw new Error(
      "FilterBar did not update its controlled multiple selection.",
    );
  const clearFilters = page.getByRole("button", { name: "선택 해제" });
  await clearFilters.focus();
  if (
    (await clearFilters.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("FilterBar clear action focus ring is missing.");
  await page.keyboard.press("Enter");
  const firstFilterChip = page.getByRole("button", { name: "무료 배송" });
  await page.waitForFunction(
    () => document.activeElement?.textContent === "무료 배송",
  );
  if (
    (await firstFilterChip.getAttribute("aria-pressed")) !== "false" ||
    (await page.getByRole("button", { name: "선택 해제" }).count()) !== 0 ||
    !(await firstFilterChip.evaluate((node) => document.activeElement === node))
  )
    throw new Error(
      "FilterBar clear did not reset selection and return keyboard focus to the first enabled chip.",
    );
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--filter-bar-narrow&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const longFilter = page.getByRole("button", {
    name: "오늘 주문하면 내일 도착하는 무료 배송 상품",
  });
  const [longFilterBox, filterClearBox] = await Promise.all([
    longFilter.boundingBox(),
    page.getByRole("button", { name: "선택 해제" }).boundingBox(),
  ]);
  if (
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )) ||
    !longFilterBox ||
    !filterClearBox ||
    longFilterBox.height < 44 ||
    filterClearBox.height < 44
  )
    throw new Error(
      "FilterBar overflowed a 320px viewport or lost a touch target.",
    );
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--filter-bar-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const filterDark = await page
    .getByRole("region", { name: "상품 필터" })
    .evaluate((node) => {
      const theme = node.closest("[data-theme]");
      const chip = node.querySelector('button[aria-pressed="true"]');
      if (!theme || !chip) return false;
      const probe = document.createElement("span");
      probe.style.backgroundColor = "var(--kg-color-selection-selected-bg)";
      probe.style.color = "var(--kg-color-selection-selected-fg)";
      theme.append(probe);
      const match =
        getComputedStyle(chip).backgroundColor ===
          getComputedStyle(probe).backgroundColor &&
        getComputedStyle(chip).color === getComputedStyle(probe).color;
      probe.remove();
      return match;
    });
  if (!filterDark)
    throw new Error(
      "FilterBar dark selected chip does not consume semantic tokens.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--filter-bar-loading&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const loadingFilter = page.getByRole("region", { name: "상품 필터" });
  if (
    (await loadingFilter.getAttribute("aria-busy")) !== "true" ||
    !(await page.getByRole("button", { name: "무료 배송" }).isDisabled()) ||
    !(await page.getByRole("button", { name: "선택 해제" }).isDisabled())
  )
    throw new Error(
      "FilterBar loading did not lock chips and reset with busy semantics.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--filter-bar-disabled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    !(await page.getByRole("button", { name: "내일 도착" }).isDisabled()) ||
    !(await page.getByRole("button", { name: "선택 해제" }).isDisabled())
  )
    throw new Error(
      "FilterBar disabled did not lock all interactive controls.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const pagination = page.getByRole("navigation", { name: "검색 결과 페이지" });
  if (
    (await pagination.count()) !== 1 ||
    (await pagination
      .locator('[aria-current="page"]')
      .getAttribute("aria-label")) !== "6페이지, 현재 페이지" ||
    (await pagination.locator('button[aria-current="page"]').count()) !== 0
  )
    throw new Error(
      "Pagination current-page semantics are missing or interactive.",
    );
  if ((await pagination.locator('[aria-hidden="true"]').count()) !== 2)
    throw new Error(
      "Large Pagination did not render exactly two non-interactive ellipses.",
    );
  const nextPage = pagination.getByRole("button", { name: "다음 페이지" });
  await nextPage.focus();
  if (
    (await nextPage.evaluate((node) => getComputedStyle(node).outlineStyle)) !==
    "solid"
  )
    throw new Error("Pagination focus ring is missing.");
  await nextPage.click();
  if (
    (await pagination
      .locator('[aria-current="page"]')
      .getAttribute("aria-label")) !== "7페이지, 현재 페이지"
  )
    throw new Error("Pagination next action did not update controlled state.");
  await pagination.getByRole("button", { name: "1페이지" }).click();
  if (
    (await pagination
      .locator('[aria-current="page"]')
      .getAttribute("aria-label")) !== "1페이지, 현재 페이지"
  )
    throw new Error(
      "Pagination numeric action did not update controlled state.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-first&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (!(await page.getByRole("button", { name: "이전 페이지" }).isDisabled()))
    throw new Error("Pagination previous action is enabled on the first page.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-disabled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  for (const control of await page
    .getByRole("navigation", { name: "검색 결과 페이지" })
    .getByRole("button")
    .all())
    if (!(await control.isDisabled()))
      throw new Error("Disabled Pagination exposed an enabled action.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-last&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (!(await page.getByRole("button", { name: "다음 페이지" }).isDisabled()))
    throw new Error("Pagination next action is enabled on the last page.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-small&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const smallPagination = page.getByRole("navigation", {
    name: "검색 결과 페이지",
  });
  if (
    (await smallPagination.locator('[aria-hidden="true"]').count()) !== 0 ||
    (await smallPagination
      .locator('[aria-current="page"]')
      .getAttribute("aria-label")) !== "2페이지, 현재 페이지"
  )
    throw new Error(
      "Small Pagination rendered ellipses or lost its current page.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-narrow&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )
  )
    throw new Error("Narrow Pagination caused document horizontal overflow.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--pagination-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const darkCurrent = page.locator('[aria-current="page"]');
  const darkTokenMatch = await darkCurrent.evaluate((node) => {
    const theme = node.closest("[data-theme]");
    if (!theme) return false;
    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--kg-color-action-primary-bg)";
    probe.style.color = "var(--kg-color-action-primary-fg)";
    theme.append(probe);
    const nodeStyle = getComputedStyle(node);
    const probeStyle = getComputedStyle(probe);
    const matches =
      nodeStyle.backgroundColor === probeStyle.backgroundColor &&
      nodeStyle.color === probeStyle.color;
    probe.remove();
    return matches;
  });
  if (!darkTokenMatch)
    throw new Error(
      "Dark Pagination current state does not consume action semantic tokens.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page
      .getByRole("heading", { level: 1, name: "주문 상세" })
      .count()) !== 1
  )
    throw new Error("AppBar must expose one screen h1.");
  const backAction = page.getByRole("button", { name: "뒤로 가기" });
  await backAction.focus();
  if (
    (await backAction.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("AppBar action focus ring is missing.");
  await backAction.click();
  if (!(await page.getByText("뒤로 가기 실행 1회").isVisible()))
    throw new Error("AppBar leading action did not activate once.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-long&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const appBarHeader = page.locator("header");
  const appBarTitle = page.getByRole("heading", { level: 1 });
  const [headerBox, titleBox] = await Promise.all([
    appBarHeader.boundingBox(),
    appBarTitle.boundingBox(),
  ]);
  if (
    !headerBox ||
    !titleBox ||
    titleBox.x < headerBox.x ||
    titleBox.x + titleBox.width > headerBox.x + headerBox.width + 1 ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error("Long AppBar title overflowed its 320px viewport.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-two-actions&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const twoHeader = page.locator("header");
  const twoTitle = page.getByRole("heading", { level: 1 });
  const twoSubtitle = page.getByText("상품과 배송 정보를 확인하세요");
  const twoButtons = page.getByRole("button");
  const [twoHeaderBox, twoTitleBox, twoSubtitleBox] = await Promise.all([
    twoHeader.boundingBox(),
    twoTitle.boundingBox(),
    twoSubtitle.boundingBox(),
  ]);
  if (
    !twoHeaderBox ||
    !twoTitleBox ||
    Math.abs(
      twoTitleBox.x +
        twoTitleBox.width / 2 -
        (twoHeaderBox.x + twoHeaderBox.width / 2),
    ) > 1
  )
    throw new Error("Two-action AppBar title is not screen-centered.");
  if (
    !twoSubtitleBox ||
    twoSubtitleBox.x < twoHeaderBox.x ||
    twoSubtitleBox.x + twoSubtitleBox.width >
      twoHeaderBox.x + twoHeaderBox.width + 1
  )
    throw new Error("Two-action AppBar subtitle overflowed the header.");
  for (const control of await twoButtons.all()) {
    const box = await control.boundingBox();
    if (
      !box ||
      box.x < twoHeaderBox.x ||
      box.x + box.width > twoHeaderBox.x + twoHeaderBox.width + 1
    )
      throw new Error("Two-action AppBar control overflowed the header.");
  }
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-disabled-loading&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (!(await page.getByRole("button", { name: "닫기" }).isDisabled()))
    throw new Error("Disabled AppBar action remained interactive.");
  const loadingAction = page.getByRole("button", { name: "저장 중" });
  if (
    !(await loadingAction.isDisabled()) ||
    (await loadingAction.getAttribute("aria-busy")) !== "true"
  )
    throw new Error(
      "Loading AppBar action did not expose busy disabled state.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-no-actions&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("button").count()) !== 0 ||
    (await page.getByRole("heading", { level: 1, name: "알림" }).count()) !== 1
  )
    throw new Error("No-action AppBar contract is incorrect.");
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "저장하기" }).click();
  if (
    !(await page
      .getByText("저장하지 못했어요. 다시 시도해 주세요.")
      .isVisible())
  )
    throw new Error(
      "AppBar rejected action did not reach product error feedback.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--app-bar-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const appBarDarkTokens = await page.locator("header").evaluate((header) => {
    const theme = header.closest("[data-theme]");
    if (!theme) return false;
    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--kg-color-bg-canvas)";
    probe.style.color = "var(--kg-color-fg-primary)";
    theme.append(probe);
    const headerStyle = getComputedStyle(header);
    const probeStyle = getComputedStyle(probe);
    const matches =
      headerStyle.backgroundColor === probeStyle.backgroundColor &&
      headerStyle.color === probeStyle.color;
    probe.remove();
    return matches;
  });
  if (!appBarDarkTokens)
    throw new Error(
      "Dark AppBar does not consume semantic canvas and foreground tokens.",
    );
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--breadcrumb-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const breadcrumb = page.getByRole("navigation", { name: "현재 위치" });
  if (
    (await breadcrumb.getByRole("list").count()) !== 1 ||
    (await breadcrumb.getByRole("link").count()) !== 2 ||
    (await breadcrumb
      .locator('[aria-current="page"]')
      .getAttribute("aria-label")) !== null ||
    (await breadcrumb.locator('[aria-current="page"]').textContent()) !==
      "노트북"
  )
    throw new Error("Breadcrumb ancestor/current semantics are incorrect.");
  const homeCrumb = breadcrumb.getByRole("link", { name: "홈" });
  await homeCrumb.focus();
  if (
    (await homeCrumb.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid" ||
    (await homeCrumb.getAttribute("href")) !== "/home"
  )
    throw new Error("Breadcrumb focus or canonical href is missing.");
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--breadcrumb-five&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const longBreadcrumb = page.getByRole("navigation", { name: "현재 위치" });
  const currentCrumb = longBreadcrumb.locator('[aria-current="page"]');
  const [longNavBox, currentCrumbBox] = await Promise.all([
    longBreadcrumb.boundingBox(),
    currentCrumb.boundingBox(),
  ]);
  if (
    !longNavBox ||
    !currentCrumbBox ||
    currentCrumbBox.x < longNavBox.x ||
    currentCrumbBox.x + currentCrumbBox.width >
      longNavBox.x + longNavBox.width + 1 ||
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ))
  )
    throw new Error("Five-level Breadcrumb overflowed its 320px viewport.");
  if (
    (await longBreadcrumb.getByRole("link").count()) !== 4 ||
    (await longBreadcrumb.locator("svg").count()) !== 4 ||
    (await longBreadcrumb
      .locator("svg")
      .evaluateAll((nodes) =>
        nodes.some((node) => !node.closest('[aria-hidden="true"]')),
      ))
  )
    throw new Error(
      "Five-level Breadcrumb link or separator structure is incorrect.",
    );
  const crumbRows = await longBreadcrumb
    .locator("li")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().y),
    );
  if (new Set(crumbRows.map(Math.round)).size < 2)
    throw new Error("Five-level Breadcrumb did not wrap at 320px.");
  const activated = await longBreadcrumb
    .getByRole("link", { name: "홈" })
    .evaluate((node) => {
      let clicked = false;
      node.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          clicked = true;
        },
        { once: true },
      );
      node.click();
      return clicked;
    });
  if (!activated) throw new Error("Breadcrumb ancestor link did not activate.");
  const ancestorLinks = longBreadcrumb.getByRole("link");
  await ancestorLinks.first().focus();
  for (let index = 1; index < 4; index += 1) {
    await page.keyboard.press("Tab");
    if (
      !(await ancestorLinks
        .nth(index)
        .evaluate((node) => node === document.activeElement))
    )
      throw new Error(
        "Breadcrumb keyboard order diverged from source hierarchy.",
      );
  }
  await page.keyboard.press("Tab");
  if (await currentCrumb.evaluate((node) => node === document.activeElement))
    throw new Error("Breadcrumb current page became a tab stop.");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=navigation-tabs--breadcrumb-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const breadcrumbDarkTokens = await page
    .getByRole("navigation", { name: "현재 위치" })
    .evaluate((nav) => {
      const theme = nav.closest("[data-theme]");
      const link = nav.querySelector("a");
      const current = nav.querySelector('[aria-current="page"]');
      if (!theme || !link || !current) return false;
      const probe = document.createElement("span");
      probe.style.color = "var(--kg-color-fg-secondary)";
      theme.append(probe);
      const secondary = getComputedStyle(probe).color;
      probe.style.color = "var(--kg-color-fg-primary)";
      const primary = getComputedStyle(probe).color;
      const matches =
        getComputedStyle(link).color === secondary &&
        getComputedStyle(current).color === primary;
      probe.remove();
      return matches;
    });
  if (!breadcrumbDarkTokens)
    throw new Error(
      "Dark Breadcrumb hierarchy does not consume semantic foreground tokens.",
    );
  await page.goto(
    `${base}/iframe.html?id=actions-button--primary&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.keyboard.press("Tab");
  const focused = page.getByRole("button", { name: "저장하기" });
  if (!(await focused.evaluate((node) => node.matches(":focus-visible"))))
    throw new Error("Button is not keyboard focus-visible in Storybook.");
  if (
    (await focused.evaluate((node) => getComputedStyle(node).outlineStyle)) !==
    "solid"
  )
    throw new Error("Button focus-visible token is not rendered.");
  await page.goto(
    `${base}/iframe.html?id=foundations-primitives--icon-buttons&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const iconButton = page.getByRole("button", { name: "메뉴 열기" });
  const baseColor = await iconButton.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await iconButton.dispatchEvent("pointerdown", { pointerType: "touch" });
  await page.waitForTimeout(20);
  const pressedColor = await iconButton.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  if (pressedColor === baseColor)
    throw new Error("IconButton touch pressed state did not change.");
  await iconButton.dispatchEvent("pointerup", { pointerType: "touch" });
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  if (
    (await iconButton.evaluate(
      (node) => getComputedStyle(node).outlineStyle,
    )) !== "solid"
  )
    throw new Error("IconButton keyboard focus ring is missing.");
  await page.goto(
    `${base}/iframe.html?id=actions-button--duplicate-activation-lock&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const locked = page.getByRole("button", { name: "실행 횟수 0" });
  await locked.evaluate((node) => {
    node.click();
    node.click();
  });
  await page.getByRole("button", { name: "실행 횟수 1" }).waitFor();
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.keyboard.press("Tab");
  const field = page.getByRole("textbox", { name: "이름" });
  if (
    (await field.evaluate((node) => getComputedStyle(node).outlineStyle)) !==
    "solid"
  )
    throw new Error("TextField keyboard focus ring is missing.");
  await field.fill("김경석");
  if ((await field.inputValue()) !== "김경석")
    throw new Error("TextField input did not update.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("alert").innerText()) !==
    "이름을 두 글자 이상 입력해 주세요."
  )
    throw new Error("Field error live region is missing.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--choices&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const checkbox = page.getByRole("checkbox", { name: "약관에 동의합니다" });
  await checkbox.click();
  if (!(await checkbox.isChecked()))
    throw new Error("Controlled Checkbox did not update.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--validation-lifecycle&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const lifecycleField = page.getByRole("textbox", { name: "이름 (필수)" });
  await lifecycleField.fill("김");
  if (await page.getByRole("alert").count())
    throw new Error("Untouched field displayed an error while typing.");
  await lifecycleField.press("Enter");
  await page.waitForFunction(
    () => document.activeElement?.getAttribute("name") === "name",
  );
  await lifecycleField.fill("");
  await lifecycleField.focus();
  await lifecycleField.blur();
  await page.getByRole("alert").waitFor();
  await lifecycleField.fill("김경석");
  if (await page.getByRole("alert").count())
    throw new Error("Correcting a client error did not clear it.");
  await page.getByRole("button", { name: "검증하기" }).click();
  if (!(await page.getByText("제출된 계정: personal").isVisible()))
    throw new Error("Select value was not included in FormData.");
  if (
    !(await page.getByRole("alert").innerText()).includes("이미 사용 중인 이름")
  )
    throw new Error("Server error was not retained after submit.");
  await lifecycleField.fill("김경석2");
  if (
    !(await page.getByRole("alert").innerText()).includes("이미 사용 중인 이름")
  )
    throw new Error("Editing incorrectly cleared a server error.");
  await page.getByRole("button", { name: "서버 오류 초기화" }).click();
  if (await page.getByRole("alert").count())
    throw new Error("Explicit server error reset failed.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--disabled-selections&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const disabledCheckbox = page.getByRole("checkbox", {
    name: "선택된 비활성 체크박스",
  });
  if (
    !(await disabledCheckbox.isChecked()) ||
    !(await disabledCheckbox.isDisabled())
  )
    throw new Error("Disabled selected Checkbox state is incorrect.");
  const disabledSwitch = page.getByRole("switch", {
    name: "선택된 비활성 스위치",
  });
  if (
    !(await disabledSwitch.isChecked()) ||
    !(await disabledSwitch.isDisabled())
  )
    throw new Error("Disabled selected Switch state is incorrect.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--search&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const searchField = page.getByRole("searchbox", { name: "상품 검색" });
  await searchField.focus();
  if (
    (await searchField.evaluate(
      (node) => getComputedStyle(node.parentElement).outlineStyle,
    )) !== "solid"
  )
    throw new Error("SearchField keyboard focus ring is missing.");
  await searchField.evaluate((node) =>
    node.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        isComposing: true,
        key: "Enter",
      }),
    ),
  );
  if ((await page.locator("[data-search-count]").textContent()) !== "0")
    throw new Error(
      "SearchField submitted while Korean IME composition was active.",
    );
  const searchSubmit = page.getByRole("button", { exact: true, name: "검색" });
  await searchSubmit.evaluate((node) => {
    node.click();
    node.click();
  });
  await page.getByRole("button", { name: "검색 중" }).waitFor();
  if (
    !(await searchField.isDisabled()) ||
    (await searchField.getAttribute("aria-busy")) !== "true"
  )
    throw new Error(
      "SearchField pending state is not visibly or semantically busy.",
    );
  await page.getByText("“디자인 시스템” 검색 결과를 불러왔습니다.").waitFor();
  if ((await page.locator("[data-search-count]").textContent()) !== "1")
    throw new Error(
      "SearchField duplicate activation lock did not keep exactly one search request.",
    );
  await page.getByRole("button", { name: "검색어 지우기" }).click();
  if (
    (await searchField.inputValue()) !== "" ||
    (await page.locator('output[aria-live="polite"]').textContent()) !== ""
  )
    throw new Error(
      "SearchField clear action did not reset its controlled value and product result state.",
    );
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--search&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const enterSearch = page.getByRole("searchbox", { name: "상품 검색" });
  await enterSearch.press("Enter");
  await page.getByRole("button", { name: "검색 중" }).waitFor();
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--search-narrow&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const [narrowInput, narrowClear, narrowSubmit] = await Promise.all([
    page
      .getByRole("searchbox", {
        name: "오늘 주문하면 내일 도착하는 무료 배송 상품을 검색하세요",
      })
      .boundingBox(),
    page.getByRole("button", { name: "검색어 지우기" }).boundingBox(),
    page.getByRole("button", { exact: true, name: "검색" }).boundingBox(),
  ]);
  if (
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )) ||
    !narrowInput ||
    !narrowClear ||
    !narrowSubmit ||
    narrowInput.width < 44 ||
    narrowClear.height < 44 ||
    narrowSubmit.height < 44
  )
    throw new Error(
      "Long Korean SearchField overflowed a 320px viewport or lost a usable action target.",
    );
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--search-error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { exact: true, name: "검색" }).click();
  await page
    .getByText("검색 결과를 불러오지 못했습니다. 다시 시도해 주세요.")
    .waitFor();
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--determinate&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page
      .getByRole("progressbar", { name: "업로드 진행률" })
      .getAttribute("aria-valuenow")) !== "64"
  )
    throw new Error("Determinate Progress did not expose 64 percent.");
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--clamped&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("progressbar").getAttribute("aria-valuenow")) !==
    "100"
  )
    throw new Error("Progress upper clamp failed.");
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--non-finite&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("progressbar").getAttribute("aria-valuenow")) !== null
  )
    throw new Error("Non-finite Progress leaked an ARIA value.");
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--indeterminate&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (
    (await page.getByRole("progressbar").getAttribute("aria-valuenow")) !== null
  )
    throw new Error("Indeterminate Progress exposed a determinate value.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--indeterminate&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const reducedBar = page.locator(".kg-feedback-progress-indeterminate");
  if (
    (await reducedBar.evaluate(
      (node) => getComputedStyle(node).animationName,
    )) !== "none"
  )
    throw new Error("Reduced-motion indeterminate Progress still animates.");
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--spinners&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if ((await page.getByRole("status").count()) !== 3)
    throw new Error("Spinner status semantics or size fixtures are missing.");
  if (
    (await page
      .locator(".kg-feedback-spinner")
      .first()
      .evaluate((node) => getComputedStyle(node).animationName)) !== "none"
  )
    throw new Error("Reduced-motion Spinner still animates.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--toast-error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const toast = page.getByRole("alert");
  if (!(await toast.innerText()).includes("저장하지 못했어요"))
    throw new Error("Negative Toast announcement is missing.");
  await page.getByRole("button", { name: "다시 시도" }).click();
  if (
    !(await page.getByText("재시도함").isVisible()) ||
    (await page.getByRole("alert").count())
  )
    throw new Error("Toast action did not run and dismiss.");
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--toast-reject&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "다시 시도" }).evaluate((node) => {
    node.click();
    node.click();
  });
  await page.getByText("재시도 실패").waitFor();
  if (!(await page.locator("output").innerText()).includes("실행 횟수 1"))
    throw new Error(
      `Rejected Toast action count was incorrect: ${await page.locator("output").innerText()}`,
    );
  if (!(await page.getByRole("alert").isVisible()))
    throw new Error(
      "Rejected Toast action incorrectly dismissed the recovery message.",
    );
  await page.getByRole("button", { name: "알림 닫기" }).click();
  if (await page.getByRole("alert").count())
    throw new Error("Persistent Toast close control did not dismiss.");
  await page.goto(
    `${base}/iframe.html?id=feedback-progress--toast-timed&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const timedToast = page.getByRole("status");
  await timedToast.waitFor();
  await timedToast.hover();
  await page.waitForTimeout(1100);
  if (!(await timedToast.isVisible()))
    throw new Error("Hover did not pause timed Toast dismissal.");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1100);
  if (await page.getByRole("status").count())
    throw new Error("Timed Toast did not dismiss after normalized duration.");
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const dialogTrigger = page.getByRole("button", { name: "다이얼로그 열기" });
  await dialogTrigger.click();
  const dialog = page.getByRole("dialog", { name: "변경 내용을 저장할까요?" });
  await dialog.waitFor();
  if (
    !(await page
      .getByRole("button", { name: "취소" })
      .evaluate((node) => node === document.activeElement))
  )
    throw new Error("Dialog did not move focus inside.");
  await page.getByRole("button", { name: "저장하기" }).focus();
  await page.keyboard.press("Tab");
  if (
    !(await page
      .getByRole("button", { name: "취소" })
      .evaluate((node) => node === document.activeElement))
  )
    throw new Error("Dialog focus did not wrap.");
  await page.keyboard.press("Escape");
  if (await page.getByRole("dialog").count())
    throw new Error("Escape did not close Dialog.");
  await page.waitForFunction(
    () => document.activeElement?.textContent === "다이얼로그 열기",
  );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--destructive&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "다이얼로그 열기" }).click();
  const destructiveDialog = page.getByRole("dialog", {
    name: "프로젝트를 삭제할까요?",
  });
  await destructiveDialog.waitFor();
  await page.addScriptTag({ content: axe.source });
  const openDialogViolations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        rules: {
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          region: { enabled: false },
        },
      })
    ).violations.map(({ id, impact }) => `${impact}:${id}`),
  );
  if (openDialogViolations.length)
    throw new Error(
      `Opened Dialog accessibility violations: ${openDialogViolations.join(", ")}`,
    );
  await destructiveDialog.locator("..").click({ position: { x: 2, y: 2 } });
  if (!(await destructiveDialog.isVisible()))
    throw new Error("Destructive Dialog closed from backdrop.");
  await page.keyboard.press("Escape");
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--bottom-sheet-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const sheetTrigger = page.getByRole("button", { name: "바텀시트 열기" });
  await sheetTrigger.click();
  const sheet = page.getByRole("dialog", { name: "계정 선택" });
  await sheet.waitFor();
  if (
    !(await page
      .getByRole("button", { name: "개인 계정" })
      .evaluate((node) => node === document.activeElement))
  )
    throw new Error("BottomSheet did not move focus inside.");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => document.activeElement?.textContent === "바텀시트 열기",
  );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--nested&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "상위 다이얼로그 열기" }).click();
  await page.getByRole("button", { name: "하위 다이얼로그 열기" }).click();
  const dialogs = page.locator('[role="dialog"]');
  if ((await dialogs.count()) !== 2)
    throw new Error("Nested overlay fixture did not open both layers.");
  if (
    !(await dialogs
      .first()
      .locator("..")
      .evaluate((node) => node.hasAttribute("inert")))
  )
    throw new Error("Background overlay was not made inert.");
  if ((await page.evaluate(() => document.body.style.overflow)) !== "hidden")
    throw new Error("Nested overlay did not retain scroll lock.");
  await page.getByRole("button", { name: "하위 닫기" }).click();
  if (
    (await dialogs.count()) !== 1 ||
    (await page.evaluate(() => document.body.style.overflow)) !== "hidden"
  )
    throw new Error(
      "Closing top overlay released the lower overlay scroll lock.",
    );
  await page.getByRole("button", { name: "상위 닫기" }).click();
  if ((await page.evaluate(() => document.body.style.overflow)) === "hidden")
    throw new Error("Closing final overlay did not restore body scrolling.");
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--tooltip-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const tooltipTrigger = page.getByRole("button", { name: "도움말" });
  await tooltipTrigger.dispatchEvent("pointerenter", { pointerType: "touch" });
  await page.waitForTimeout(50);
  if (await page.getByRole("tooltip").count())
    throw new Error("Touch hover emulation opened Tooltip.");
  await tooltipTrigger.focus();
  const tooltip = page.getByRole("tooltip", { name: "새 항목을 추가합니다" });
  await tooltip.waitFor();
  const tooltipId = await tooltip.getAttribute("id");
  if (
    !tooltipId ||
    !(await tooltipTrigger.getAttribute("aria-describedby"))
      ?.split(" ")
      .includes(tooltipId)
  )
    throw new Error("Tooltip is not associated with its trigger.");
  await page.keyboard.press("Escape");
  if (await tooltip.count()) throw new Error("Escape did not dismiss Tooltip.");
  await page.setViewportSize({ width: 320, height: 240 });
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--tooltip-viewport-edge&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "가장자리 도움말" }).focus();
  const edgeTooltip = page.getByRole("tooltip");
  await edgeTooltip.waitFor();
  await page.waitForFunction(() => {
    const node = document.querySelector('[role="tooltip"]');
    if (!node) return false;
    const box = node.getBoundingClientRect();
    return (
      box.left >= 7 && box.top >= 7 && box.right <= 313 && box.bottom <= 233
    );
  });
  const edgeBox = await edgeTooltip.boundingBox();
  if (
    !edgeBox ||
    edgeBox.x < 7 ||
    edgeBox.y < 7 ||
    edgeBox.x + edgeBox.width > 313 ||
    edgeBox.y + edgeBox.height > 233
  )
    throw new Error(
      `Tooltip escaped the narrow viewport margin: ${JSON.stringify(edgeBox)}`,
    );
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--dialog-tooltip&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "도움말 다이얼로그 열기" }).click();
  const dialogTooltipTrigger = page.getByRole("button", {
    name: "내부 도움말",
  });
  await dialogTooltipTrigger.focus();
  await page.getByRole("tooltip").waitFor();
  await page.keyboard.press("Escape");
  if (await page.getByRole("tooltip").count())
    throw new Error("Dialog Tooltip did not close on Escape.");
  if (!(await page.getByRole("dialog", { name: "도움말 테스트" }).isVisible()))
    throw new Error("Tooltip Escape incorrectly closed its owning Dialog.");
  await page.getByRole("button", { name: "확인" }).focus();
  await dialogTooltipTrigger.hover();
  await page.getByRole("tooltip").waitFor();
  await page.keyboard.press("Escape");
  if (await page.getByRole("tooltip").count())
    throw new Error("Pointer-opened Dialog Tooltip did not close on Escape.");
  if (!(await page.getByRole("dialog", { name: "도움말 테스트" }).isVisible()))
    throw new Error(
      "Pointer Tooltip Escape incorrectly closed its owning Dialog.",
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--menu-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const menuTrigger = page.getByRole("button", { name: "편집 메뉴 열기" });
  await menuTrigger.click();
  const menu = page.getByRole("menu", { name: "문서 편집 메뉴" });
  await menu.waitFor();
  const firstMenuItem = page.getByRole("menuitem", { name: "이름 바꾸기" });
  if (
    !(await firstMenuItem.evaluate((node) => node === document.activeElement))
  )
    throw new Error("Menu did not focus its first enabled item.");
  await page.keyboard.press("End");
  if (
    !(await page
      .getByRole("menuitem", { name: "보관하기" })
      .evaluate((node) => node === document.activeElement))
  )
    throw new Error("Menu End navigation failed.");
  await page.keyboard.press("Home");
  if (
    !(await firstMenuItem.evaluate((node) => node === document.activeElement))
  )
    throw new Error("Menu Home navigation failed.");
  await page.keyboard.press("ArrowDown");
  const checkItem = page.getByRole("menuitemcheckbox", { name: "간단히 보기" });
  if (!(await checkItem.evaluate((node) => node === document.activeElement)))
    throw new Error("Menu arrow navigation failed.");
  await page.keyboard.press("Enter");
  if ((await checkItem.getAttribute("aria-checked")) !== "false")
    throw new Error("Menu checkbox did not update controlled state.");
  await page.keyboard.press("Escape");
  if (
    (await menu.count()) ||
    !(await menuTrigger.evaluate((node) => node === document.activeElement))
  )
    throw new Error("Menu Escape did not close and restore trigger focus.");
  await menuTrigger.click();
  if (
    !(await page.getByRole("menuitem", { name: "삭제할 수 없음" }).isDisabled())
  )
    throw new Error("Menu disabled item remained actionable.");
  await firstMenuItem.click();
  if (
    (await menu.count()) ||
    !(await page.getByText("rename 작업을 선택했습니다.").isVisible())
  )
    throw new Error("Menu action did not close and expose its result.");
  await menuTrigger.click();
  await page.keyboard.press("Tab");
  if (await menu.count())
    throw new Error("Menu did not close when keyboard focus left with Tab.");
  await menuTrigger.click();
  const outsideMenuAction = page.getByRole("button", { name: "메뉴 밖 작업" });
  await outsideMenuAction.click();
  if (
    (await menu.count()) ||
    !(await outsideMenuAction.evaluate(
      (node) => node === document.activeElement,
    ))
  )
    throw new Error(
      "Menu pointer-outside dismissal lost the clicked focus destination.",
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--menu-controlled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const controlledMenuTrigger = page.getByRole("button", {
    name: "편집 메뉴 열기",
  });
  await controlledMenuTrigger.click();
  await page.getByRole("menu").waitFor();
  await page.keyboard.press("Escape");
  if ((await controlledMenuTrigger.getAttribute("aria-expanded")) !== "false")
    throw new Error("Controlled Menu did not publish its closed state.");
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--menu-default-open&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const defaultOpenTrigger = page.getByRole("button", {
    name: "처음부터 열린 메뉴",
  });
  const defaultOpenItem = page.getByRole("menuitem", { name: "첫 작업" });
  await defaultOpenItem.waitFor();
  if (
    (await defaultOpenTrigger.getAttribute("aria-expanded")) !== "true" ||
    !(await defaultOpenItem.evaluate((node) => node === document.activeElement))
  )
    throw new Error(
      "Menu defaultOpen did not expose and focus its initial item.",
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--menu-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "편집 메뉴 열기" }).click();
  await page.addScriptTag({ content: axe.source });
  const darkMenuViolations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        rules: {
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          region: { enabled: false },
        },
      })
    ).violations.map(({ id, impact }) => `${impact}:${id}`),
  );
  if (darkMenuViolations.length)
    throw new Error(
      `Dark Menu accessibility violations: ${darkMenuViolations.join(", ")}`,
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--menu-placements&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  for (const placement of [
    "top",
    "top-start",
    "top-end",
    "right",
    "right-start",
    "right-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left",
    "left-start",
    "left-end",
  ]) {
    await page
      .getByRole("button", { name: `${placement} 배치` })
      .evaluate((node) => node.click());
    await page.waitForFunction(
      (name) =>
        Array.from(document.querySelectorAll("button")).some(
          (node) =>
            node.textContent === `${name} 배치` &&
            node.getAttribute("aria-pressed") === "true",
        ),
      placement,
    );
    const triggerBox = await page
      .getByRole("button", { name: "배치 기준" })
      .boundingBox();
    const menuBox = await page
      .getByRole("menu", { name: "배치 확인 메뉴" })
      .boundingBox();
    if (!triggerBox || !menuBox)
      throw new Error(`Menu ${placement} placement has no geometry.`);
    const [side, align] = placement.split("-");
    if (
      (side === "top" && menuBox.y + menuBox.height > triggerBox.y) ||
      (side === "bottom" && menuBox.y < triggerBox.y + triggerBox.height) ||
      (side === "left" && menuBox.x + menuBox.width > triggerBox.x) ||
      (side === "right" && menuBox.x < triggerBox.x + triggerBox.width)
    )
      throw new Error(`Menu ${placement} placement is on the wrong side.`);
    const horizontal = side === "top" || side === "bottom";
    const startDelta = horizontal
      ? menuBox.x - triggerBox.x
      : menuBox.y - triggerBox.y;
    const endDelta = horizontal
      ? menuBox.x + menuBox.width - triggerBox.x - triggerBox.width
      : menuBox.y + menuBox.height - triggerBox.y - triggerBox.height;
    const centerDelta = horizontal
      ? menuBox.x + menuBox.width / 2 - triggerBox.x - triggerBox.width / 2
      : menuBox.y + menuBox.height / 2 - triggerBox.y - triggerBox.height / 2;
    if (
      (align === "start" && Math.abs(startDelta) > 2) ||
      (align === "end" && Math.abs(endDelta) > 2) ||
      (!align && Math.abs(centerDelta) > 2)
    )
      throw new Error(`Menu ${placement} alignment is incorrect.`);
    if (
      menuBox.x < 0 ||
      menuBox.y < 0 ||
      menuBox.x + menuBox.width > 1280 ||
      menuBox.y + menuBox.height > 720
    )
      throw new Error(`Menu ${placement} escaped the viewport.`);
  }
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--slider-default&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const slider = page.getByRole("slider", { name: "알림 음량" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  if (
    (await slider.inputValue()) !== "55" ||
    (await slider.getAttribute("aria-valuetext")) !== "55%"
  )
    throw new Error(
      "Slider keyboard step or accessible value feedback failed.",
    );
  if (
    !(await slider.getAttribute("aria-describedby")) ||
    !(await page.getByText(/범위 작게/).count())
  )
    throw new Error("Slider range meaning is not associated with the control.");
  const sliderViolations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        rules: {
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          region: { enabled: false },
        },
      })
    ).violations.map(({ id, impact }) => `${impact}:${id}`),
  );
  if (sliderViolations.length)
    throw new Error(
      `Slider accessibility violations: ${sliderViolations.join(", ")}`,
    );
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--slider-disabled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (!(await page.getByRole("slider", { name: "알림 음량" }).isDisabled()))
    throw new Error("Slider disabled story is interactive.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--slider-dark&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.addScriptTag({ content: axe.source });
  const darkSliderViolations = await page.evaluate(async () =>
    (
      await window.axe.run(document, {
        rules: {
          "landmark-one-main": { enabled: false },
          "page-has-heading-one": { enabled: false },
          region: { enabled: false },
        },
      })
    ).violations.map(({ id, impact }) => `${impact}:${id}`),
  );
  if (darkSliderViolations.length)
    throw new Error(
      `Dark Slider accessibility violations: ${darkSliderViolations.join(", ")}`,
    );
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-and-time&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const dateInput = page.locator('input[type="date"]');
  await dateInput.fill("2026-08-25");
  if (
    (await dateInput.inputValue()) !== "2026-08-25" ||
    (await dateInput.getAttribute("min")) !== "2026-08-24" ||
    (await page.locator('input[type="time"]').inputValue()) !== "09:30" ||
    (await page.locator('input[type="datetime-local"]').inputValue()) !==
      "2026-08-24T09:30"
  )
    throw new Error(
      "DateTimeField platform values or range are not controlled consistently.",
    );
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-and-time-error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const invalidDate = page.locator('input[type="date"]');
  if (
    (await invalidDate.getAttribute("aria-invalid")) !== "true" ||
    !(await page.getByRole("alert").isVisible())
  )
    throw new Error("DateTimeField error semantics are missing.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-and-time-disabled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if (!(await page.locator('input[type="date"]').isDisabled()))
    throw new Error("DateTimeField disabled state is interactive.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--calendar-and-date-picker&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const dateTrigger = page.getByRole("button", { name: /방문 날짜/ });
  await dateTrigger.click();
  const dateDialog = page.getByRole("dialog", { name: "방문 날짜" });
  const initialDateFocus = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  if (!initialDateFocus?.includes("2026년 8월 24일"))
    throw new Error(`DatePicker initial focus is wrong: ${initialDateFocus}`);
  for (const key of ["ArrowRight", "Home", "End", "PageDown", "PageUp"]) {
    const before = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    await page.keyboard.press(key);
    await page.waitForTimeout(40);
    const after = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    if (!after || before === after) throw new Error(`Calendar ${key} did not move focus.`);
  }
  const dialogButtons = dateDialog.getByRole("button");
  await dialogButtons.last().focus();
  await page.keyboard.press("Tab");
  if (!(await dialogButtons.first().evaluate((node) => node === document.activeElement)))
    throw new Error("DatePicker dialog did not wrap Tab focus.");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  if (!(await dateTrigger.evaluate((node) => node === document.activeElement)))
    throw new Error("DatePicker did not restore trigger focus after Escape.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-picker-constraints&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const constrainedTrigger = page.getByRole("button", { name: /업무일/ });
  await constrainedTrigger.click();
  await page.getByRole("button", { name: /2026년 8월 29일/ }).click({ force: true });
  if (!(await page.getByRole("dialog", { name: "업무일" }).isVisible()))
    throw new Error("Unavailable DatePicker date closed the dialog.");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  if (!(await page.getByRole("button", { name: /업무일/ }).getAttribute("aria-label"))?.includes("26일"))
    throw new Error("Unavailable DatePicker date changed the controlled value.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-picker-error-and-disabled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  if ((await page.getByRole("button", { name: /오류 날짜/ }).getAttribute("aria-invalid")) !== "true" || !(await page.getByRole("button", { name: /변경할 수 없는 날짜/ }).isDisabled()))
    throw new Error("DatePicker error or disabled semantics regressed.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-range-preset&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  const rangeTrigger = page.getByRole("button", { name: /여행 기간/ });
  const originalRangeLabel = await rangeTrigger.getAttribute("aria-label");
  await rangeTrigger.click();
  if ((await page.locator('[role="gridcell"][aria-selected="true"]').count()) !== 2)
    throw new Error("DateRangePicker did not expose both preset endpoints.");
  await page.getByRole("button", { name: /2026년 8월 25일/ }).click();
  await page.getByText("종료일을 선택하세요.").waitFor();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(50);
  if (!(await rangeTrigger.evaluate((node) => node === document.activeElement)) || (await rangeTrigger.getAttribute("aria-label")) !== originalRangeLabel)
    throw new Error("DateRangePicker cancel did not preserve value and restore trigger focus.");
  await rangeTrigger.click();
  if ((await page.locator('[role="gridcell"][aria-selected="true"]').count()) !== 2)
    throw new Error("DateRangePicker did not restore its controlled range after cancel.");
  await page.getByRole("button", { name: /2026년 8월 25일/ }).click();
  await page.getByText("종료일을 선택하세요.").waitFor();
  await page.getByRole("button", { name: /2026년 8월 28일/ }).click();
  if (await page.getByRole("dialog", { name: "여행 기간" }).count())
    throw new Error("DateRangePicker did not close after a complete range.");
  const rangeLabel = await rangeTrigger.getAttribute("aria-label");
  if (!rangeLabel?.includes("25") || !rangeLabel.includes("28"))
    throw new Error("DateRangePicker did not publish the completed range.");
  await page.goto(
    `${base}/iframe.html?id=forms-textfield--date-picker-controlled&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "외부에서 9월 10일로 변경" }).click();
  if (!(await page.getByRole("button", { name: /제어 날짜/ }).getAttribute("aria-label"))?.includes("9월 10일"))
    throw new Error("DatePicker did not reflect an external controlled update.");
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--confirmation-success&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "변경 확인 열기" }).click();
  const confirmAction = page.getByRole("button", { name: "변경하기" });
  await confirmAction.click();
  if (!(await page.getByRole("button", { name: "취소" }).isDisabled()))
    throw new Error("Confirmation cancel remained active while pending.");
  await confirmAction.click({ force: true });
  await page.getByText("결과: 완료").waitFor();
  if (
    (await page.getByRole("dialog").count()) ||
    (await page.locator("[data-confirm-count]").textContent()) !== "1"
  )
    throw new Error(
      "Successful Confirmation did not close or lock duplicate submission.",
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--confirmation-error&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "변경 확인 열기" }).click();
  await page.getByRole("button", { name: "변경하기" }).click();
  const confirmationError = page.getByText(
    "작업을 완료하지 못했어요. 다시 시도해 주세요.",
  );
  await confirmationError.waitFor();
  if (
    !(await page.getByRole("dialog").isVisible()) ||
    !(await page.getByText("결과: 실패").isVisible())
  )
    throw new Error(
      "Failed Confirmation did not stay open with a result message.",
    );
  if ((await confirmationError.getAttribute("aria-live")) !== "assertive")
    throw new Error(
      "Confirmation error is not exposed as an assertive live region.",
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--confirmation-race&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "경합 확인 열기" }).click();
  await page.getByRole("button", { name: "처리하기" }).click();
  await page
    .getByRole("button", { name: "외부 닫기" })
    .evaluate((node) => node.click());
  await page.getByRole("button", { name: "외부 다시 열기" }).click();
  await page.waitForTimeout(300);
  if (!(await page.getByRole("dialog", { name: "세션 경합 확인" }).isVisible()))
    throw new Error(
      "A stale Confirmation settlement closed the reopened session.",
    );
  await page.goto(
    `${base}/iframe.html?id=overlays-dialog--confirmation-destructive&viewMode=story`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "삭제 확인 열기" }).click();
  const destructiveConfirmation = page.getByRole("dialog", {
    name: "프로젝트를 삭제할까요?",
  });
  await destructiveConfirmation
    .locator("..")
    .click({ position: { x: 2, y: 2 } });
  if (!(await destructiveConfirmation.isVisible()))
    throw new Error("Destructive Confirmation closed from backdrop.");
} finally {
  await browser.close();
  server.close();
}
