import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { build } from "esbuild";
import { act, create } from "react-test-renderer";

const require = createRequire(import.meta.url);
const React = createRequire(require.resolve("react-test-renderer"))("react");
const { renderToStaticMarkup } = createRequire(
  resolve("apps/design-docs/package.json")
)("react-dom/server");
const h = React.createElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Host boundaries only: no browser, layout, native device, or screen-reader claims.
class HostElement {
  attrs = new Map();
  inert = false;
  focus() {}
  querySelector() {
    return null;
  }
  querySelectorAll() {
    return [];
  }
  getAttribute(name) {
    return this.attrs.get(name) ?? null;
  }
  setAttribute(name, value) {
    this.attrs.set(name, value);
  }
  removeAttribute(name) {
    this.attrs.delete(name);
  }
  contains(node) {
    return node === this;
  }
}
globalThis.HTMLElement = HostElement;
globalThis.Node = HostElement;
globalThis.document = {
  activeElement: null,
  body: { style: {}, children: [] },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
};
globalThis.window = {
  setTimeout,
  clearTimeout,
  matchMedia: () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }),
  addEventListener() {},
  removeEventListener() {},
};
globalThis.requestAnimationFrame = (callback) => {
  callback();
  return 0;
};
globalThis.cancelAnimationFrame = () => {};
const nativeHost = {
  View: "View",
  Text: "Text",
  Pressable: "Pressable",
  Modal: "Modal",
  TextInput: "TextInput",
  Switch: "Switch",
  ActivityIndicator: "ActivityIndicator",
  Platform: { OS: "ios" },
  useColorScheme: () => "light",
  AccessibilityInfo: { announceForAccessibility() {} },
};

async function loadSource(path, overrides = {}) {
  const filename = resolve(path);
  const result = await build({
    entryPoints: [filename],
    bundle: true,
    packages: "external",
    write: false,
    platform: "node",
    format: "cjs",
    jsx: "automatic",
    logLevel: "silent",
  });
  const localRequire = createRequire(filename);
  const mocks = {
    react: React,
    "react-dom": { createPortal: (children) => children },
    "react-native": nativeHost,
    "react-native-safe-area-context": {
      useSafeAreaInsets: () => ({ bottom: 0 }),
    },
    "@kimgseok/design-motion/native": { useReducedMotion: () => true },
    "@kimgseok/design-icons/native": { NativeIcon: "NativeIcon" },
    ...overrides,
  };
  const module = { exports: {} };
  new Function("require", "module", "exports", result.outputFiles[0].text)(
    (name) => mocks[name] ?? localRequire(name),
    module,
    module.exports
  );
  return module.exports;
}
async function mount(component) {
  let renderer;
  const nodes = new WeakMap();
  await act(() => {
    renderer = create(component, {
      createNodeMock: ({ props }) => {
        if (!nodes.has(props)) nodes.set(props, new HostElement());
        return nodes.get(props);
      },
    });
  });
  return renderer;
}
async function unmount(renderer) {
  await act(() => renderer.unmount());
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

const primitives = await loadSource(
  "packages/design-systems/primitives/src/web.tsx"
);
const navigation = await loadSource(
  "packages/design-systems/components/navigation/src/web.tsx"
);
const forms = await loadSource(
  "packages/design-systems/components/forms/src/web.tsx"
);

test("auxiliary form controls default to button; explicit IconButton submit is preserved", () => {
  const markup = renderToStaticMarkup(
    h(
      "form",
      null,
      h(primitives.IconButton, { icon: "close", accessibilityLabel: "닫기" }),
      h(navigation.Tabs, {
        accessibilityLabel: "탭",
        value: "a",
        onValueChange() {},
        items: [{ value: "a", label: "A", content: "A" }],
      }),
      h(navigation.SegmentedControl, {
        accessibilityLabel: "보기",
        value: "a",
        onValueChange() {},
        items: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ],
      })
    )
  );
  const buttons = markup.match(/<button\b[^>]*>/g);
  assert.equal(buttons.length, 4);
  assert.ok(buttons.every((button) => button.includes('type="button"')));
  assert.match(
    renderToStaticMarkup(
      h(primitives.IconButton, {
        icon: "check",
        accessibilityLabel: "저장",
        type: "submit",
      })
    ),
    /type="submit"/
  );
});

test("Select preserves supplied id and DateTimeField renders a user range error", () => {
  const select = renderToStaticMarkup(
    h(forms.Select, {
      id: "consumer-select",
      label: "상태",
      value: "a",
      onValueChange() {},
      options: [{ value: "a", label: "A" }],
    })
  );
  assert.match(select, /for="consumer-select"/);
  assert.match(select, /id="consumer-select"/);
  const field = renderToStaticMarkup(
    h(forms.DateTimeField, {
      label: "날짜",
      kind: "date",
      value: "2026-10-01",
      min: "2026-09-01",
      max: "2026-09-30",
      errorMessage: "9월 날짜를 입력하세요.",
      onValueChange() {},
    })
  );
  assert.match(field, /aria-invalid="true"/);
  assert.match(field, /9월 날짜를 입력하세요/);
});

for (const platform of ["web", "native"]) {
  const feedback = await loadSource(
    `packages/design-systems/components/feedback/src/${platform}.tsx`
  );
  const Host =
    platform === "web" ? feedback.ToastViewport : feedback.NativeToastHost;
  const actionNode = (renderer) =>
    renderer.root.findAllByType(platform === "web" ? "button" : "Pressable")[0];
  const invoke = (node) =>
    node.props[platform === "web" ? "onClick" : "onPress"]();
  test(`${platform} Toast ignores stale success/error and locks duplicate actions`, async () => {
    const old = deferred();
    let calls = 0;
    const closed = [],
      errors = [];
    const first = {
      id: "first",
      open: true,
      message: "알림",
      onOpenChange: (value) => closed.push(["first", value]),
      action: {
        label: "실행",
        onAction: () => {
          calls++;
          return old.promise;
        },
        onError: (error) => errors.push(error),
      },
    };
    const renderer = await mount(h(Host, { toast: first }));
    await act(() => {
      const button = actionNode(renderer);
      invoke(button);
      invoke(button);
    });
    assert.equal(calls, 1);
    assert.equal(actionNode(renderer).props.disabled, true);
    const current = deferred();
    const second = {
      ...first,
      id: "second",
      onOpenChange: (value) => closed.push(["second", value]),
      action: { ...first.action, onAction: () => current.promise },
    };
    await act(() => renderer.update(h(Host, { toast: second })));
    assert.equal(actionNode(renderer).props.disabled, false);
    await act(() => old.resolve());
    assert.deepEqual(closed, []);
    await act(async () => {
      invoke(actionNode(renderer));
      await Promise.resolve();
    });
    await act(() =>
      renderer.update(h(Host, { toast: { ...second, open: false } }))
    );
    await act(() => renderer.update(h(Host, { toast: second })));
    await act(() => current.reject(new Error("old failure")));
    assert.deepEqual(errors, []);
    assert.equal(actionNode(renderer).props.disabled, false);
    await unmount(renderer);
  });
  test(`${platform} current Toast failure is retryable and unmount invalidates completion`, async () => {
    let calls = 0,
      errors = 0,
      closes = 0;
    const pending = deferred();
    const toast = {
      open: true,
      message: "재시도",
      onOpenChange: () => closes++,
      action: {
        label: "실행",
        onAction: () => {
          calls++;
          return calls === 1
            ? Promise.reject(new Error("offline"))
            : pending.promise;
        },
        onError: () => errors++,
      },
    };
    const renderer = await mount(h(Host, { toast }));
    await act(async () => {
      invoke(actionNode(renderer));
      await Promise.resolve();
    });
    assert.equal(errors, 1);
    assert.equal(actionNode(renderer).props.disabled, false);
    await act(async () => {
      invoke(actionNode(renderer));
      await Promise.resolve();
    });
    await unmount(renderer);
    await act(() => pending.resolve());
    assert.equal(closes, 0);
  });
}

const nativeDates = await loadSource(
  "packages/design-systems/components/date-picker/src/native.tsx"
);
for (const name of ["NativeDatePicker", "NativeDateRangePicker"]) {
  test(`${name} old commit/cancel cannot close a reopened picker`, async () => {
    let api;
    const changes = [];
    const isRange = name.includes("Range");
    const renderer = await mount(
      h(nativeDates[name], {
        label: "날짜",
        value: isRange ? { start: "", end: "" } : "",
        onValueChange: (value) => changes.push(value),
        renderPicker: (value) => {
          api = value;
          return h("Picker");
        },
      })
    );
    const press = () =>
      renderer.root.findAllByType("Pressable")[0].props.onPress();
    await act(press);
    const old = api;
    await act(() => old.cancel());
    await act(press);
    const value = isRange
      ? { start: "2026-09-01", end: "2026-09-02" }
      : "2026-09-01";
    await act(() => {
      old.commit(value);
      old.cancel();
    });
    assert.equal(renderer.root.findByType("Modal").props.visible, true);
    assert.deepEqual(changes, []);
    await act(() => api.commit(value));
    assert.deepEqual(changes, [value]);
    await unmount(renderer);
  });
}

const nativeForms = await loadSource(
  "packages/design-systems/components/forms/src/native.tsx"
);
for (const name of ["NativeSelect", "NativeDateTimeField"])
  test(`${name} invalidates retained callbacks on disable and reopen`, async () => {
    let api;
    const values = [],
      openings = [];
    const isDate = name === "NativeDateTimeField";
    const next = isDate ? "2026-09-02" : "b";
    const renderPicker = (value) => {
      api = value;
      return h("Sheet");
    };
    const props = {
      label: "상태",
      kind: "date",
      value: isDate ? "2026-09-01" : "a",
      open: true,
      options: [
        { value: "a", label: "A" },
        { value: "b", label: "B" },
      ],
      onValueChange: (value) => values.push(value),
      onOpenChange: (value) => openings.push(value),
      renderSheet: renderPicker,
      renderPicker,
    };
    const renderer = await mount(h(nativeForms[name], props));
    const old = api;
    await act(() =>
      renderer.update(h(nativeForms[name], { ...props, disabled: true }))
    );
    assert.equal(renderer.root.findAllByType("Sheet").length, 0);
    await act(() => old.onSelect(next));
    assert.deepEqual(values, []);
    await act(() => renderer.update(h(nativeForms[name], props)));
    const beforeCancel = openings.length;
    await act(() => {
      old.onSelect(next);
      old.onCancel();
    });
    assert.equal(openings.length, beforeCancel);
    assert.deepEqual(values, []);
    await act(() => api.onSelect(next));
    assert.deepEqual(values, [next]);
    assert.ok(openings.includes(false));
    await unmount(renderer);
  });

const overlays = await loadSource(
  "packages/design-systems/components/overlays/src/web.tsx",
  {
    "@kimgseok/design-motion/web": {
      useReducedMotion: () => true,
      useMotionPresence: (open) => ({ rendered: open, phase: "entered" }),
      resolveMotionRecipe: () => ({
        durationMs: 0,
        easing: "linear",
        distance: 0,
      }),
    },
  }
);
for (const name of ["Dialog", "BottomSheet"])
  test(`only the top ${name} handles Escape and consumes its event`, async () => {
    const closed = [];
    const render = (inner) =>
      h(
        overlays[name],
        { open: true, title: "부모", onOpenChange: () => closed.push("outer") },
        inner
          ? h(overlays[name], {
              open: true,
              title: "자식",
              onOpenChange: () => closed.push("inner"),
            })
          : null
      );
    const renderer = await mount(render(false));
    await act(() => renderer.update(render(true)));
    const dialogs = renderer.root.findAll(
      (node) => node.type === "div" && node.props.role === "dialog"
    );
    const event = (dialog) => ({
      key: "Escape",
      currentTarget: dialog.instance,
      defaultPrevented: false,
      stopped: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        this.stopped = true;
      },
    });
    await act(() => dialogs[0].props.onKeyDown(event(dialogs[0])));
    assert.deepEqual(closed, []);
    const escape = event(dialogs[1]);
    await act(() => dialogs[1].props.onKeyDown(escape));
    assert.deepEqual(closed, ["inner"]);
    assert.equal(escape.stopped, true);
    await unmount(renderer);
  });

test("Menu consumes Escape so its containing Dialog stays open", async () => {
  let closed = false;
  const renderer = await mount(
    h(
      overlays.Dialog,
      {
        open: true,
        title: "상세",
        onOpenChange: () => {
          closed = true;
        },
      },
      h(overlays.Menu, {
        accessibilityLabel: "작업",
        triggerLabel: "더 보기",
        defaultOpen: true,
        items: [{ value: "reset", label: "초기화" }],
        onAction() {},
      })
    )
  );
  const item = renderer.root.find(
    (node) => node.type === "button" && node.props.role === "menuitem"
  );
  const escape = {
    key: "Escape",
    defaultPrevented: false,
    stopped: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    stopPropagation() {
      this.stopped = true;
    },
  };
  await act(() => item.props.onKeyDown(escape));
  assert.equal(escape.stopped, true);
  assert.equal(
    renderer.root.findAll((node) => node.props.role === "menu").length,
    0
  );
  assert.equal(closed, false);
  await unmount(renderer);
});

const dates = await loadSource(
  "packages/design-systems/components/date-picker/src/web.tsx",
  {
    "@kimgseok/design-overlays/web": {
      Dialog: ({ open, children, footer }) =>
        open ? h("Dialog", null, children, footer) : null,
    },
  }
);
for (const name of ["DatePicker", "DateRangePicker"]) {
  test(`${name} provides pointer cancellation without changing value`, async () => {
    const values = [];
    const renderer = await mount(
      h(dates[name], {
        label: "날짜",
        value: name.includes("Range") ? { start: "", end: "" } : "",
        onValueChange: (value) => values.push(value),
      })
    );
    await act(() => renderer.root.findByType("button").props.onClick());
    assert.equal(renderer.root.findAllByType("Dialog").length, 1);
    const cancel = renderer.root
      .findAllByType("button")
      .find(
        (node) =>
          node.findAll((child) => child.children.includes("취소")).length > 0
      );
    assert.ok(cancel);
    await act(() => cancel.props.onClick());
    assert.equal(renderer.root.findAllByType("Dialog").length, 0);
    assert.deepEqual(values, []);
    await unmount(renderer);
  });
}

const list = await loadSource("apps/design-examples/src/composition-list.tsx");
test("list composition resets pagination and recovers from an empty search", async () => {
  const renderer = await mount(h(list.default));
  const nav = createRequire(resolve("apps/design-examples/package.json"))(
    "@kimgseok/design-navigation/web"
  );
  const fields = createRequire(resolve("apps/design-examples/package.json"))(
    "@kimgseok/design-forms/web"
  );
  const primitive = createRequire(resolve("apps/design-examples/package.json"))(
    "@kimgseok/design-primitives/web"
  );
  await act(() =>
    renderer.root.findByType(nav.Pagination).props.onPageChange(3)
  );
  await act(() =>
    renderer.root
      .findByType(nav.FilterBar)
      .props.onSelectedValuesChange(["draft"])
  );
  assert.equal(renderer.root.findByType(primitive.Table).props.rows.length, 2);
  assert.equal(renderer.root.findAllByType(nav.Pagination).length, 0);
  await act(() =>
    renderer.root.findByType(fields.SearchField).props.onSearch("없는 제목")
  );
  assert.equal(renderer.root.findAllByType(primitive.Table).length, 0);
  await act(() =>
    renderer.root.findByType(primitive.EmptyState).props.action.onAction()
  );
  assert.equal(renderer.root.findByType(nav.Pagination).props.page, 1);
  await unmount(renderer);
});

const form = await loadSource("apps/design-examples/src/composition-form.tsx");
test("form composition preserves input on failure, locks submit, then succeeds on retry", async () => {
  const renderer = await mount(h(form.default));
  const fields = createRequire(resolve("apps/design-examples/package.json"))(
    "@kimgseok/design-forms/web"
  );
  const feedback = createRequire(resolve("apps/design-examples/package.json"))(
    "@kimgseok/design-feedback/web"
  );
  await act(() =>
    renderer.root
      .findByType(fields.TextField)
      .props.onChange({ target: { value: "새 제목" } })
  );
  const submit = () =>
    renderer.root.findByType("form").props.onSubmit({ preventDefault() {} });
  await act(() => {
    submit();
    submit();
  });
  assert.equal(renderer.root.findByType(fields.TextField).props.disabled, true);
  await act(() => new Promise((resolve) => setTimeout(resolve, 650)));
  assert.equal(
    renderer.root.findByType(fields.TextField).props.value,
    "새 제목"
  );
  assert.equal(
    renderer.root.findByType(feedback.Callout).props.tone,
    "negative"
  );
  await act(submit);
  await act(() => new Promise((resolve) => setTimeout(resolve, 650)));
  assert.equal(renderer.root.findAllByType(feedback.Callout).length, 0);
  assert.equal(
    renderer.root.findByType(feedback.ToastViewport).props.toast.open,
    true
  );
  await unmount(renderer);
});

test("Docs membership matches its catalogue and motion descriptions use real recipe names", async () => {
  const examplePackage = JSON.parse(
    readFileSync("apps/design-examples/package.json", "utf8")
  );
  const exampleBoundaries = Object.fromEntries(
    Object.keys(examplePackage.exports).map((name) => [
      `@kimgseok/design-examples/${name.slice(2)}`,
      () => null,
    ])
  );
  const docs = await loadSource(
    "apps/design-docs/app/component-docs.tsx",
    exampleBoundaries
  );
  const { catalog } = await loadSource(
    "packages/design-systems/catalog/src/registry.ts"
  );
  const { motionRecipe } = await loadSource(
    "packages/design-systems/foundation/motion/src/contracts.ts"
  );
  assert.deepEqual(
    Object.keys(docs.componentDocs).sort(),
    [...docs.richDocumentationSlugs].sort()
  );
  for (const slug of docs.richDocumentationSlugs) {
    assert.ok(
      catalog.some((entry) => entry.slug === slug),
      `${slug} must be a real catalogue entry`
    );
    assert.ok(
      docs.getComponentDoc(slug)?.examples.length,
      `${slug} cannot fall back to generic documentation`
    );
    const motion = docs.getComponentDoc(slug).motion;
    for (const [, name] of (motion?.token ?? "").matchAll(
      /motion\.([a-zA-Z]+)/g
    ))
      assert.ok(
        name in motionRecipe,
        `${slug}: ${name} must be a real motion recipe`
      );
  }
  assert.equal(docs.getComponentDoc("not-a-component"), undefined);
});

test("Skeleton and calendar consume defined semantic fills; reduced progress has no transition", async () => {
  const css = readFileSync(
    "packages/design-systems/foundation/tokens/dist/css/variables.css",
    "utf8"
  );
  for (const name of [
    "--kg-color-feedback-skeleton-fill",
    "--kg-color-selection-range-bg",
  ])
    assert.ok(css.includes(`${name}:`));
  const skeleton = renderToStaticMarkup(
    h(primitives.SkeletonRegion, {
      accessibilityLabel: "목록 로딩",
      recipe: "list-item",
    })
  );
  assert.match(skeleton, /var\(--kg-color-feedback-skeleton-fill\)/);
  const feedback = await loadSource(
    "packages/design-systems/components/feedback/src/web.tsx"
  );
  const progress = renderToStaticMarkup(
    h(feedback.Progress, { accessibilityLabel: "진행", value: 0.5 })
  );
  assert.match(
    progress,
    /@media\(prefers-reduced-motion:reduce\)\{\.kg-feedback-progress\{transition:none!important\}/
  );
});
