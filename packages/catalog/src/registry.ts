export type CatalogLayer = "foundation" | "primitive" | "composite" | "pattern";
export type CatalogMaturity = "stable" | "candidate" | "planned";
export type CatalogPlatform = "web" | "native";
export type CatalogCategory = "Foundation" | "Actions" | "Forms" | "Feedback" | "Overlays" | "Navigation" | "Content" | "Patterns";

export interface CatalogEntry {
  readonly slug: string;
  readonly name: string;
  readonly category: CatalogCategory;
  readonly layer: CatalogLayer;
  readonly maturity: CatalogMaturity;
  readonly platforms: readonly CatalogPlatform[];
  readonly packageName: string;
  readonly importPaths: Readonly<Partial<Record<CatalogPlatform, string>>>;
  readonly description: string;
  readonly composition?: readonly string[];
  readonly tossAnalogue: "public" | "partial" | "none";
  readonly authority: "Toss public" | "Platform standard" | "Consumer policy";
  readonly cataloguePresence: Readonly<{ toss: boolean; seed: boolean; montage: boolean }>;
  readonly gap: string;
}

const both = ["web", "native"] as const;
const referenceCatalogueNames = {
  toss: new Set(["Tokens", "Icon", "Text", "Heading", "Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion", "EmptyState", "Button", "IconButton", "ActionArea", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider", "SearchField", "Spinner", "Progress", "Callout", "ToastViewport", "Dialog", "BottomSheet", "Tooltip", "Menu", "ConfirmationDialog", "Tabs", "SegmentedControl", "Chip", "ChipGroup", "Pagination", "AppBar"]),
  seed: new Set(["Tokens", "Icon", "Text", "Heading", "Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion", "Table", "EmptyState", "Button", "IconButton", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider", "SearchField", "DateTimeField", "Calendar", "DatePicker", "DateRangePicker", "Spinner", "Progress", "Callout", "ToastViewport", "Dialog", "BottomSheet", "Tooltip", "Menu", "ConfirmationDialog", "Tabs", "SegmentedControl", "Chip", "ChipGroup", "FilterBar", "Pagination", "AppBar", "Breadcrumb"]),
  montage: new Set(["Tokens", "Icon", "Text", "Heading", "Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion", "Table", "EmptyState", "Button", "IconButton", "ActionArea", "TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider", "SearchField", "DateTimeField", "Calendar", "DatePicker", "DateRangePicker", "Spinner", "Progress", "Callout", "ToastViewport", "Dialog", "BottomSheet", "Tooltip", "Menu", "ConfirmationDialog", "Tabs", "SegmentedControl", "Chip", "ChipGroup", "FilterBar", "Pagination", "AppBar", "Breadcrumb"]),
} as const;
const presenceFor = (name: string) => ({ toss: referenceCatalogueNames.toss.has(name), seed: referenceCatalogueNames.seed.has(name), montage: referenceCatalogueNames.montage.has(name) });
const stable = (name: string, category: CatalogCategory, layer: CatalogLayer, packageName: string, description: string, extra: Partial<CatalogEntry> = {}): CatalogEntry => { const tossAnalogue = extra.tossAnalogue ?? (referenceCatalogueNames.toss.has(name) ? "public" : "none"); const platforms = extra.platforms ?? both; const importPaths = packageName === "consumer-owned" ? {} : Object.fromEntries(platforms.map((platform) => [platform, `${packageName}/${platform}`])); return { slug: name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), name, category, layer, packageName, importPaths, description, maturity: "stable", platforms, tossAnalogue, authority: layer === "pattern" ? "Consumer policy" : tossAnalogue === "public" ? "Toss public" : "Platform standard", cataloguePresence: presenceFor(name), gap: tossAnalogue === "public" ? "공개 Toss analogue 있음" : tossAnalogue === "partial" ? "Toss는 일부 경계만 공개; 나머지는 플랫폼 표준" : "공개 Toss analogue 없음; 플랫폼 표준과 원본 계약", ...extra }; };

export const foundationDimensions = ["Color", "Typography", "Spacing", "Radius", "Elevation", "Motion"] as const;

export const catalog = [
  stable("Tokens", "Foundation", "foundation", "@kimgseok/design-tokens", "색상·타이포그래피·간격·반경·고도·모션의 의미 계약.", { importPaths: { web: "@kimgseok/design-tokens/css", native: "@kimgseok/design-tokens/native" } }),
  stable("Icon", "Foundation", "foundation", "@kimgseok/design-icons", "플랫폼이 공유하는 제한된 아이콘 이름과 접근 가능한 출력."),
  stable("Text", "Content", "primitive", "@kimgseok/design-primitives", "역할 기반 본문 텍스트."),
  stable("Heading", "Content", "primitive", "@kimgseok/design-primitives", "문서 위계를 보존하는 제목."),
  ...["Surface", "Divider", "Badge", "Avatar", "Card", "ListItem", "SkeletonRegion"].map((name) => stable(name, "Content", "primitive", "@kimgseok/design-primitives", "도메인 지식 없이 콘텐츠를 표현하는 기본 단위.")),
  stable("Table", "Content", "primitive", "@kimgseok/design-primitives", "열과 행 관계를 보존하는 Web 데이터 표.", { platforms: ["web"] }),
  stable("Button", "Actions", "primitive", "@kimgseok/design-button", "명시적 사용자 행동을 실행하는 기본 컨트롤."),
  stable("IconButton", "Actions", "primitive", "@kimgseok/design-primitives", "접근 가능한 이름이 필수인 아이콘 행동 컨트롤."),
  stable("ActionArea", "Actions", "composite", "@kimgseok/design-button", "주요·보조 행동과 비동기 상태를 묶는 영역.", { composition: ["Button"] }),
  ...["TextField", "TextArea", "Checkbox", "Switch", "RadioGroup", "Select", "Slider"].map((name) => stable(name, "Forms", "primitive", "@kimgseok/design-forms", "입력 상태와 접근성 의미를 소유하는 폼 컨트롤.")),
  stable("SearchField", "Forms", "composite", "@kimgseok/design-forms", "입력·초기화·검색 실행을 하나의 과업으로 묶습니다.", { composition: ["TextField", "Button"] }),
  stable("DateTimeField", "Forms", "composite", "@kimgseok/design-forms", "Web 표준 입력과 앱 소유 Native picker를 연결합니다.", { composition: ["TextField", "Platform picker"], tossAnalogue: "none", gap: "독립 Toss picker 없음; TextField trigger만 부분 참고" }),
  stable("Calendar", "Forms", "primitive", "@kimgseok/design-date-picker", "날짜 탐색과 선택을 담당하는 달력 그리드.", { platforms: ["web"], tossAnalogue: "none" }),
  stable("DatePicker", "Forms", "composite", "@kimgseok/design-date-picker", "필드 트리거와 단일 날짜 달력을 결합합니다.", { composition: ["Field trigger", "Calendar", "Dialog / Native picker"], tossAnalogue: "none", gap: "독립 Toss DatePicker 없음; TextField trigger만 부분 참고" }),
  stable("DateRangePicker", "Forms", "composite", "@kimgseok/design-date-picker", "시작일·종료일과 범위 달력을 결합합니다.", { composition: ["Field trigger", "Calendar", "Dialog / Native picker"], tossAnalogue: "none" }),
  ...["Spinner", "Progress", "Callout", "ToastViewport"].map((name) => stable(name, "Feedback", "primitive", "@kimgseok/design-feedback", "상태와 결과를 텍스트와 함께 전달합니다.")),
  stable("EmptyState", "Feedback", "composite", "@kimgseok/design-primitives", "빈 결과의 설명과 회복 행동을 묶습니다.", { composition: ["Icon", "Heading", "Text", "Button"] }),
  ...["Dialog", "BottomSheet", "Tooltip", "Menu"].map((name) => stable(name, "Overlays", "primitive", "@kimgseok/design-overlays", "초점·닫기·레이어 수명주기를 소유하는 오버레이.")),
  stable("ConfirmationDialog", "Overlays", "composite", "@kimgseok/design-overlays", "확인·취소·비동기 결과를 안전한 흐름으로 묶습니다.", { composition: ["Dialog", "Button"] }),
  ...["Tabs", "SegmentedControl", "Chip", "ChipGroup", "Pagination", "AppBar"].map((name) => stable(name, "Navigation", "primitive", "@kimgseok/design-navigation", "목적지 또는 보기 상태를 탐색하는 기본 단위.")),
  stable("Breadcrumb", "Navigation", "primitive", "@kimgseok/design-navigation", "현재 위치의 상위 경로를 탐색하는 Web 기본 단위.", { platforms: ["web"] }),
  stable("FilterBar", "Navigation", "composite", "@kimgseok/design-navigation", "다중 필터·초기화·적용 상태를 한 과업으로 묶습니다.", { composition: ["ChipGroup", "Button"] }),
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
