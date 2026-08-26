export type CatalogLayer = "foundation" | "primitive" | "composite" | "pattern";
export type CatalogMaturity = "stable" | "candidate" | "planned";
export type CatalogPlatform = "web" | "native";

export const componentCategoryDefinitions = [
  {
    category: "Actions",
    description: "명령을 실행하거나 작업을 확정·취소하는 컨트롤.",
    examples: ["Button", "IconButton", "ActionArea"],
  },
  {
    category: "Forms & Inputs",
    description: "값을 입력·선택·검색·필터하는 컨트롤과 입력 묶음.",
    examples: ["TextField", "Checkbox", "DatePicker", "FilterBar"],
  },
  {
    category: "Navigation",
    description: "위치·페이지·화면·현재 보기를 이동하거나 전환하는 컴포넌트.",
    examples: ["Sidebar", "Tabs", "Breadcrumb", "Pagination"],
  },
  {
    category: "Content & Data",
    description: "정보를 읽고 식별·비교하도록 표현하는 컴포넌트.",
    examples: ["Text", "Badge", "Card", "Table"],
  },
  {
    category: "Feedback",
    description: "진행·결과·상태·빈 상태를 사용자에게 알리는 컴포넌트.",
    examples: ["Spinner", "Progress", "ToastViewport", "EmptyState"],
  },
  {
    category: "Overlays",
    description: "다른 콘텐츠 위의 레이어와 초점·열기·닫기 수명주기를 소유하는 컴포넌트.",
    examples: ["Dialog", "BottomSheet", "Tooltip", "Menu"],
  },
  {
    category: "Layout",
    description: "콘텐츠 의미를 갖지 않고 배치·표면·구분 구조를 제공하는 컴포넌트.",
    examples: ["Surface", "Divider", "Stack", "Grid"],
  },
] as const;

export type ComponentCategory = (typeof componentCategoryDefinitions)[number]["category"];
export type CatalogCategory = "Foundation" | ComponentCategory | "Patterns";

export const componentCategoryPolicy = {
  principle: "컴포넌트의 공개 API가 해결하는 주된 사용자 역할을 기준으로 분류합니다.",
  rules: [
    "내부 합성 여부, primitive/composite layer, 패키지 경로는 분류 기준으로 사용하지 않습니다.",
    "각 컴포넌트는 하나의 주 그룹만 가지며 보조 역할은 검색 별칭과 관련 컴포넌트로 연결합니다.",
    "두 그룹이 가능하면 사용자가 그 컴포넌트로 완료하는 주된 결과를 기준으로 선택합니다.",
  ],
} as const;

export interface CatalogEntry {
  readonly slug: string;
  readonly name: string;
  readonly category: CatalogCategory;
  readonly layer: CatalogLayer;
  readonly maturity: CatalogMaturity;
  readonly platforms: readonly CatalogPlatform[];
  readonly packageName: string;
  readonly importPaths: Readonly<Partial<Record<CatalogPlatform, string>>>;
  readonly exportNames: Readonly<Partial<Record<CatalogPlatform, string>>>;
  readonly sourcePaths: Readonly<Partial<Record<CatalogPlatform, string>>>;
  readonly aliases: readonly string[];
  readonly storyId?: string;
  readonly description: string;
  readonly usage: Readonly<{ when: string; avoid: string }>;
  readonly composition?: readonly string[];
  readonly tossAnalogue: "public" | "partial" | "none";
  readonly authority: "Toss public" | "Platform standard" | "Consumer policy";
  readonly cataloguePresence: Readonly<{ toss: boolean; seed: boolean; montage: boolean }>;
  readonly gap: string;
}

const both = ["web", "native"] as const;
const packageSources: Readonly<Record<string, Readonly<Partial<Record<CatalogPlatform, string>>>>> = {
  "@kimgseok/design-tokens": { web: "packages/design-systems/foundation/tokens/src/tokens.json", native: "packages/design-systems/foundation/tokens/src/tokens.json" },
  "@kimgseok/design-icons": { web: "packages/design-systems/foundation/icons/src/web.tsx", native: "packages/design-systems/foundation/icons/src/native.tsx" },
  "@kimgseok/design-primitives": { web: "packages/design-systems/primitives/src/web.tsx", native: "packages/design-systems/primitives/src/native.tsx" },
  "@kimgseok/design-button": { web: "packages/design-systems/components/button/src/web-button.tsx", native: "packages/design-systems/components/button/src/native-button.tsx" },
  "@kimgseok/design-forms": { web: "packages/design-systems/components/forms/src/web.tsx", native: "packages/design-systems/components/forms/src/native.tsx" },
  "@kimgseok/design-date-picker": { web: "packages/design-systems/components/date-picker/src/web.tsx", native: "packages/design-systems/components/date-picker/src/native.tsx" },
  "@kimgseok/design-feedback": { web: "packages/design-systems/components/feedback/src/web.tsx", native: "packages/design-systems/components/feedback/src/native.tsx" },
  "@kimgseok/design-overlays": { web: "packages/design-systems/components/overlays/src/web.tsx", native: "packages/design-systems/components/overlays/src/native.tsx" },
  "@kimgseok/design-navigation": { web: "packages/design-systems/components/navigation/src/web.tsx", native: "packages/design-systems/components/navigation/src/native.tsx" },
};
const storyIds: Readonly<Record<string, string>> = {
  Icon: "foundations-primitives--icon-buttons",
  Text: "foundations-primitives--typography",
  Heading: "foundations-primitives--typography",
  Surface: "foundations-primitives--surfaces",
  Divider: "foundations-primitives--dividers",
  Badge: "foundations-primitives--badges",
  Avatar: "foundations-primitives--avatars",
  Card: "foundations-primitives--cards",
  ListItem: "foundations-primitives--list-items",
  SkeletonRegion: "foundations-primitives--skeletons",
  Table: "foundations-primitives--tables",
  EmptyState: "foundations-primitives--empty-states",
  Button: "actions-button--primary",
  IconButton: "foundations-primitives--icon-buttons",
  ActionArea: "actions-button--bottom-action-area",
  TextField: "forms-textfield--default",
  TextArea: "forms-textfield--multiline",
  Checkbox: "forms-textfield--choices",
  Switch: "forms-textfield--choices",
  RadioGroup: "forms-textfield--choices",
  Select: "forms-textfield--choices",
  Slider: "forms-textfield--slider-default",
  SearchField: "forms-textfield--search",
  DateTimeField: "forms-textfield--date-and-time",
  Calendar: "forms-textfield--calendar-and-date-picker",
  DatePicker: "forms-textfield--calendar-and-date-picker",
  DateRangePicker: "forms-textfield--date-range-preset",
  Spinner: "feedback-progress--spinners",
  Progress: "feedback-progress--determinate",
  Callout: "feedback-progress--callouts",
  ToastViewport: "feedback-progress--toast-success",
  Dialog: "overlays-dialog--default",
  BottomSheet: "overlays-dialog--bottom-sheet-default",
  Tooltip: "overlays-dialog--tooltip-default",
  Menu: "overlays-dialog--menu-default",
  ConfirmationDialog: "overlays-dialog--confirmation-success",
  Tabs: "navigation-tabs--default",
  SegmentedControl: "navigation-tabs--segmented",
  Chip: "navigation-tabs--chips",
  ChipGroup: "navigation-tabs--chips",
  FilterBar: "navigation-tabs--filter-bar-default",
  Pagination: "navigation-tabs--pagination-default",
  AppBar: "navigation-tabs--app-bar-default",
  Breadcrumb: "navigation-tabs--breadcrumb-default",
};
const aliases: Readonly<Record<string, readonly string[]>> = {
  Button: ["버튼", "행동", "cta"],
  IconButton: ["아이콘 버튼", "버튼"],
  TextField: ["입력", "인풋", "텍스트 입력"],
  TextArea: ["여러 줄 입력", "장문 입력"],
  Checkbox: ["체크박스", "선택"],
  Switch: ["스위치", "토글"],
  RadioGroup: ["라디오", "단일 선택"],
  Select: ["셀렉트", "드롭다운"],
  SearchField: ["검색", "찾기"],
  DatePicker: ["날짜", "달력", "데이트 피커"],
  DateRangePicker: ["기간", "날짜 범위"],
  Spinner: ["로딩", "진행"],
  ToastViewport: ["토스트", "알림"],
  Dialog: ["다이얼로그", "모달"],
  BottomSheet: ["바텀시트", "시트"],
  Menu: ["메뉴", "팝오버"],
  Tabs: ["탭", "탐색"],
  Pagination: ["페이지네이션", "페이지 이동"],
  EmptyState: ["빈 화면", "빈 결과"],
};
const referenceCatalogueNames = {
  toss: new Set(["Tokens", "Icon", "Text", "Heading", "Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion", "EmptyState", "Button", "IconButton", "ActionArea", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider", "SearchField", "Spinner", "Progress", "Callout", "ToastViewport", "Dialog", "BottomSheet", "Tooltip", "Menu", "ConfirmationDialog", "Tabs", "SegmentedControl", "Chip", "ChipGroup", "Pagination", "AppBar"]),
  seed: new Set(["Tokens", "Icon", "Text", "Heading", "Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion", "Table", "EmptyState", "Button", "IconButton", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider", "SearchField", "DateTimeField", "Calendar", "DatePicker", "DateRangePicker", "Spinner", "Progress", "Callout", "ToastViewport", "Dialog", "BottomSheet", "Tooltip", "Menu", "ConfirmationDialog", "Tabs", "SegmentedControl", "Chip", "ChipGroup", "FilterBar", "Pagination", "AppBar", "Breadcrumb"]),
  montage: new Set(["Tokens", "Icon", "Text", "Heading", "Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion", "Table", "EmptyState", "Button", "IconButton", "ActionArea", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider", "SearchField", "DateTimeField", "Calendar", "DatePicker", "DateRangePicker", "Spinner", "Progress", "Callout", "ToastViewport", "Dialog", "BottomSheet", "Tooltip", "Menu", "ConfirmationDialog", "Tabs", "SegmentedControl", "Chip", "ChipGroup", "FilterBar", "Pagination", "AppBar", "Breadcrumb"]),
} as const;
const presenceFor = (name: string) => ({ toss: referenceCatalogueNames.toss.has(name), seed: referenceCatalogueNames.seed.has(name), montage: referenceCatalogueNames.montage.has(name) });
const stable = (name: string, category: CatalogCategory, layer: CatalogLayer, packageName: string, description: string, extra: Partial<CatalogEntry> = {}): CatalogEntry => {
  const tossAnalogue = extra.tossAnalogue ?? (referenceCatalogueNames.toss.has(name) ? "public" : "none");
  const platforms = extra.platforms ?? both;
  const importPaths = packageName === "consumer-owned" ? {} : Object.fromEntries(platforms.map((platform) => [platform, `${packageName}/${platform}`]));
  const exportNames = packageName === "@kimgseok/design-tokens" || packageName === "consumer-owned"
    ? {}
    : Object.fromEntries(platforms.map((platform) => [platform, platform === "native" ? (name === "ToastViewport" ? "NativeToastHost" : `Native${name}`) : name]));
  const sourcePaths = Object.fromEntries(platforms.flatMap((platform) => {
    const sourcePath = packageSources[packageName]?.[platform];
    return sourcePath ? [[platform, sourcePath]] : [];
  }));
  const defaultUsage = layer === "composite"
    ? { when: "반복되는 접근성 또는 상태 수명주기를 하나의 과업으로 묶을 때 사용합니다.", avoid: "제품 고유 정책·데이터 요청·라우팅까지 컴포넌트에 넣지 않습니다." }
    : layer === "pattern"
      ? { when: "여러 컴포넌트를 제품의 조회·전환 정책에 맞춰 조립할 때 참고합니다.", avoid: "패턴을 독립 UI 패키지처럼 import하지 않습니다." }
      : { when: "도메인 의미 없이 하나의 명확한 UI 역할이 필요할 때 사용합니다.", avoid: "비슷해 보인다는 이유로 다른 의미의 상태나 행동에 재사용하지 않습니다." };
  return {
    slug: name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
    name,
    category,
    layer,
    packageName,
    importPaths,
    exportNames,
    sourcePaths,
    aliases: aliases[name] ?? [],
    storyId: storyIds[name],
    description,
    usage: defaultUsage,
    maturity: "stable",
    platforms,
    tossAnalogue,
    authority: layer === "pattern" ? "Consumer policy" : tossAnalogue === "public" ? "Toss public" : "Platform standard",
    cataloguePresence: presenceFor(name),
    gap: tossAnalogue === "public" ? "공개 Toss analogue 있음" : tossAnalogue === "partial" ? "Toss는 일부 경계만 공개; 나머지는 플랫폼 표준" : "공개 Toss analogue 없음; 플랫폼 표준과 원본 계약",
    ...extra,
  };
};

export const foundationDimensions = ["Color", "Typography", "Spacing", "Radius", "Elevation", "Motion"] as const;

export const catalog = [
  stable("Tokens", "Foundation", "foundation", "@kimgseok/design-tokens", "색상·타이포그래피·간격·반경·고도·모션의 의미 계약.", { importPaths: { web: "@kimgseok/design-tokens/css", native: "@kimgseok/design-tokens/native" } }),
  stable("Icon", "Content & Data", "foundation", "@kimgseok/design-icons", "플랫폼이 공유하는 제한된 아이콘 이름과 접근 가능한 출력."),
  stable("Text", "Content & Data", "primitive", "@kimgseok/design-primitives", "kind·size·weight 조합 token과 typed color를 사용하는 본문 텍스트.", { usage: { when: "textStyle과 color token으로 도메인 의미 없는 텍스트 위계를 표현할 때 사용합니다.", avoid: "raw font size·weight·HEX를 넘기거나 데이터 요청·문구 정책을 포함하지 않습니다." } }),
  stable("Heading", "Content & Data", "primitive", "@kimgseok/design-primitives", "title textStyle과 문서 위계를 함께 보존하는 제목.", { usage: { when: "시각 token과 별개로 올바른 heading level이 필요한 제목에 사용합니다.", avoid: "시각 크기를 맞추기 위해 heading 순서를 건너뛰거나 text-* token을 사용하지 않습니다." } }),
  ...["Badge", "Avatar", "Card", "ListItem"].map((name) => stable(name, "Content & Data", "primitive", "@kimgseok/design-primitives", "도메인 지식 없이 콘텐츠를 표현하는 기본 단위.")),
  stable("Table", "Content & Data", "primitive", "@kimgseok/design-primitives", "열과 행 관계를 보존하는 Web 데이터 표.", { platforms: ["web"] }),
  ...["Surface", "Divider"].map((name) => stable(name, "Layout", "primitive", "@kimgseok/design-primitives", "콘텐츠 의미 없이 영역을 구성하고 구분하는 기본 단위.")),
  stable("Button", "Actions", "primitive", "@kimgseok/design-button", "명시적 사용자 행동을 실행하는 기본 컨트롤."),
  stable("IconButton", "Actions", "primitive", "@kimgseok/design-primitives", "접근 가능한 이름이 필수인 아이콘 행동 컨트롤."),
  stable("ActionArea", "Actions", "composite", "@kimgseok/design-button", "주요·보조 행동과 비동기 상태를 묶는 영역.", { composition: ["Button"] }),
  ...["TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider"].map((name) => stable(name, "Forms & Inputs", "primitive", "@kimgseok/design-forms", "입력 상태와 접근성 의미를 소유하는 폼 컨트롤.")),
  stable("SearchField", "Forms & Inputs", "composite", "@kimgseok/design-forms", "입력·초기화·검색 실행을 하나의 과업으로 묶습니다.", { composition: ["TextField", "Button"] }),
  stable("DateTimeField", "Forms & Inputs", "composite", "@kimgseok/design-forms", "Web 표준 입력과 앱 소유 Native picker를 연결합니다.", { composition: ["TextField", "Platform picker"], tossAnalogue: "none", gap: "독립 Toss picker 없음; TextField trigger만 부분 참고" }),
  stable("Calendar", "Forms & Inputs", "primitive", "@kimgseok/design-date-picker", "날짜 탐색과 선택을 담당하는 달력 그리드.", { platforms: ["web"], tossAnalogue: "none" }),
  stable("DatePicker", "Forms & Inputs", "composite", "@kimgseok/design-date-picker", "필드 트리거와 단일 날짜 달력을 결합합니다.", { composition: ["Field trigger", "Calendar", "Dialog / Native picker"], tossAnalogue: "none", gap: "독립 Toss DatePicker 없음; TextField trigger만 부분 참고" }),
  stable("DateRangePicker", "Forms & Inputs", "composite", "@kimgseok/design-date-picker", "시작일·종료일과 범위 달력을 결합합니다.", { composition: ["Field trigger", "Calendar", "Dialog / Native picker"], tossAnalogue: "none" }),
  ...["Chip", "ChipGroup"].map((name) => stable(name, "Forms & Inputs", "primitive", "@kimgseok/design-navigation", "값을 빠르게 선택하거나 선택 상태를 묶는 컨트롤.")),
  stable("FilterBar", "Forms & Inputs", "composite", "@kimgseok/design-navigation", "다중 필터·초기화·적용 상태를 한 과업으로 묶습니다.", { composition: ["ChipGroup", "Button"] }),
  ...["Spinner", "Progress", "Callout", "ToastViewport"].map((name) => stable(name, "Feedback", "primitive", "@kimgseok/design-feedback", "상태와 결과를 텍스트와 함께 전달합니다.")),
  stable("SkeletonRegion", "Feedback", "primitive", "@kimgseok/design-primitives", "콘텐츠가 준비 중인 영역과 구조를 예고합니다."),
  stable("EmptyState", "Feedback", "composite", "@kimgseok/design-primitives", "빈 결과의 설명과 회복 행동을 묶습니다.", { composition: ["Icon", "Heading", "Text", "Button"] }),
  ...["Dialog", "BottomSheet", "Tooltip", "Menu"].map((name) => stable(name, "Overlays", "primitive", "@kimgseok/design-overlays", "초점·닫기·레이어 수명주기를 소유하는 오버레이.")),
  stable("ConfirmationDialog", "Overlays", "composite", "@kimgseok/design-overlays", "확인·취소·비동기 결과를 안전한 흐름으로 묶습니다.", { composition: ["Dialog", "Button"] }),
  ...["Tabs", "SegmentedControl", "Pagination", "AppBar"].map((name) => stable(name, "Navigation", "primitive", "@kimgseok/design-navigation", "목적지 또는 보기 상태를 탐색하는 기본 단위.")),
  stable("Breadcrumb", "Navigation", "primitive", "@kimgseok/design-navigation", "현재 위치의 상위 경로를 탐색하는 Web 기본 단위.", { platforms: ["web"] }),
  { ...stable("SearchFilter", "Patterns", "pattern", "consumer-owned", "검색과 필터를 제품의 조회 정책에 맞춰 조립하는 패턴.", { composition: ["SearchField", "FilterBar"] }), maturity: "candidate" as const },
] as const satisfies readonly CatalogEntry[];

export const catalogSummary = catalog.reduce<Record<string, number>>((summary, entry) => {
  summary[entry.layer] = (summary[entry.layer] ?? 0) + 1;
  return summary;
}, {});

export const catalogCategories = Array.from(new Set(catalog.map((entry) => entry.category))).map((category) => ({
  category,
  entries: catalog.filter((entry) => entry.category === category),
}));
