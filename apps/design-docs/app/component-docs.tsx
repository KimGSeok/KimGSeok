import type { ComponentType } from "react";
import ButtonDefaultExample from "@kimgseok/design-examples/button-default";
import ButtonVariantsExample from "@kimgseok/design-examples/button-variants";
import DialogDefaultExample from "@kimgseok/design-examples/dialog-default";
import ProgressDeterminateExample from "@kimgseok/design-examples/progress-determinate";
import ProgressIndeterminateExample from "@kimgseok/design-examples/progress-indeterminate";
import SkeletonRecipesExample from "@kimgseok/design-examples/skeleton-recipes";
import TabsDefaultExample from "@kimgseok/design-examples/tabs-default";
import TextStylesExample from "@kimgseok/design-examples/text-styles";
import TextFieldDefaultExample from "@kimgseok/design-examples/text-field-default";
import TextFieldStatesExample from "@kimgseok/design-examples/text-field-states";

export interface ComponentExampleDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly sourcePath: string;
  readonly Preview: ComponentType;
}

export interface ApiPropDefinition {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly required: boolean;
  readonly description: string;
}

export interface ComponentDocDefinition {
  readonly examples: readonly ComponentExampleDefinition[];
  readonly api: readonly ApiPropDefinition[];
  readonly accessibility: readonly string[];
  readonly platformNote: string;
  readonly motion?: Readonly<{ trigger: string; token: string; behavior: string; reducedMotion: string }>;
}

const example = (id: string, title: string, description: string, sourcePath: string, Preview: ComponentType): ComponentExampleDefinition => ({ id, title, description, sourcePath, Preview });
const prop = (name: string, type: string, defaultValue: string, required: boolean, description: string): ApiPropDefinition => ({ name, type, defaultValue, required, description });

export const componentDocs: Readonly<Record<string, ComponentDocDefinition>> = {
  text: {
    examples: [example("styles", "스타일과 색상", "제목·본문 스타일과 semantic/palette 색상 토큰을 함께 비교합니다.", "apps/design-examples/src/text-styles.tsx", TextStylesExample)],
    api: [
      prop("children", "ReactNode", "—", true, "표시할 텍스트 또는 인라인 콘텐츠입니다."),
      prop("textStyle", "text-<size>-<weight>", "text-m-regular", false, "7단계 크기와 4단계 굵기를 조합한 본문 스타일입니다."),
      prop("color", "TextColorToken", "fg-primary", false, "semantic foreground 또는 typed palette 토큰입니다."),
      prop("as", '"span" | "p" | "strong"', '"span"', false, "시각 스타일과 독립적으로 HTML 의미를 선택합니다."),
      prop("numberOfLines", "number", "—", false, "명시한 줄 수에서 텍스트를 자릅니다."),
    ],
    accessibility: ["문맥에 맞는 span, p, strong을 선택합니다.", "색상만으로 의미나 상태를 전달하지 않습니다.", "xxs와 xs는 필수 본문이 아닌 보조 정보에만 사용합니다."],
    platformNote: "Web은 semantic element를 선택하고, React Native는 RNText와 numberOfLines를 사용합니다.",
  },
  button: {
    examples: [
      example("default", "기본", "가장 중요한 한 번의 행동에 사용하는 기본 버튼입니다.", "apps/design-examples/src/button-default.tsx", ButtonDefaultExample),
      example("variants", "유형과 상태", "의미별 variant와 disabled·loading 상태를 비교합니다.", "apps/design-examples/src/button-variants.tsx", ButtonVariantsExample),
    ],
    api: [
      prop("children", "ReactNode", "—", true, "버튼의 행동을 설명하는 레이블입니다."),
      prop("variant", '"primary" | "secondary" | "tertiary" | "danger"', '"primary"', false, "행동의 위계와 위험도를 나타냅니다."),
      prop("size", '"sm" | "md" | "lg"', '"md"', false, "버튼 높이와 좌우 여백을 선택합니다."),
      prop("disabled", "boolean", "false", false, "행동을 실행할 수 없는 상태입니다."),
      prop("loading", "boolean", "false", false, "외부 비동기 작업이 진행 중인 상태입니다."),
      prop("onAction", "() => void | Promise<void>", "—", false, "중복 실행이 잠긴 사용자 행동입니다."),
      prop("onActionError", "(error: unknown) => void", "—", false, "실패 결과를 소비자 화면에서 복구하도록 전달합니다."),
    ],
    accessibility: ["기본 button semantics와 keyboard\u00A0activation을 유지합니다.", "loading과 pending 동안 aria-busy와 disabled를 함께 노출합니다.", "레이블은 결과가 아니라 실행할 행동을 설명합니다."],
    motion: { trigger: "hover · press", token: "motion.fast", behavior: "배경색만 전환하며 위치나 크기를 움직이지 않습니다.", reducedMotion: "공간 이동이 없는 색상 상태 전환만 유지합니다." },
    platformNote: "Web과 Native가 variant·size·비동기 잠금 계약을 공유하며 플랫폼별 press/focus 입력만 다릅니다.",
  },
  "text-field": {
    examples: [
      example("default", "기본", "label과 help text를 포함한 기본 입력입니다.", "apps/design-examples/src/text-field-default.tsx", TextFieldDefaultExample),
      example("states", "검증 상태", "오류·비활성·필수 상태를 한 번에 비교합니다.", "apps/design-examples/src/text-field-states.tsx", TextFieldStatesExample),
    ],
    api: [
      prop("label", "string", "—", true, "입력 목적을 항상 보이는 텍스트로 설명합니다."),
      prop("helpText", "string", "—", false, "입력 전에도 필요한 제약이나 도움말입니다."),
      prop("errorMessage", "string", "—", false, "수정 가능한 오류와 해결 방법을 전달합니다."),
      prop("disabled", "boolean", "false", false, "값을 입력하거나 수정할 수 없는 상태입니다."),
      prop("required", "boolean", "false", false, "필수 입력 상태와 native required semantics를 연결합니다."),
      prop("value / defaultValue", "string", "—", false, "제어 또는 비제어 값을 선택합니다."),
    ],
    accessibility: ["label과 input은 생성된 id로 연결됩니다.", "오류와 도움말은 aria-describedby로 입력에 연결됩니다.", "오류 상태는 색상뿐 아니라 문장으로 전달합니다."],
    platformNote: "Web은 input 속성을 확장하고, Native는 TextInput 계약과 onValueChange를 사용합니다.",
  },
  dialog: {
    examples: [example("default", "기본", "열기·닫기·포커스 복귀를 실제로 확인합니다.", "apps/design-examples/src/dialog-default.tsx", DialogDefaultExample)],
    api: [
      prop("open", "boolean", "—", true, "제어되는 열림 상태입니다."),
      prop("title", "string", "—", true, "대화상자의 결정을 설명하는 제목입니다."),
      prop("description", "string", "—", false, "결정 전에 필요한 보조 설명입니다."),
      prop("onOpenChange", "(open: boolean) => void", "—", true, "닫기 요청을 포함한 상태 변경을 소비자에게 전달합니다."),
      prop("intent", '"default" | "destructive"', '"default"', false, "파괴적 결정의 시각·행동 계약을 선택합니다."),
      prop("closeOnBackdrop", "boolean", "false", false, "배경 클릭으로 닫을지 명시합니다."),
      prop("returnFocusRef", "RefObject<HTMLElement>", "—", false, "Web에서 닫힌 뒤 포커스를 돌려보낼 요소입니다."),
    ],
    accessibility: ["role=dialog와 aria-modal을 노출합니다.", "열릴 때 내부로 포커스를 옮기고 Tab 이동을 가둡니다.", "Escape로 닫고 트리거로 포커스를 복귀시킵니다."],
    platformNote: "Web은 portal·focus trap·Escape를, Native는 Modal과 플랫폼 back 동작을 소유합니다.",
  },
  tabs: {
    examples: [example("default", "제어형 탭", "선택 값과 패널이 함께 바뀌는 기본 구성을 확인합니다.", "apps/design-examples/src/tabs-default.tsx", TabsDefaultExample)],
    api: [
      prop("accessibilityLabel", "string", "—", true, "탭 목록 전체의 목적을 설명합니다."),
      prop("items", "readonly TabItem[]", "—", true, "고유 value·label·content와 선택적 disabled 상태입니다."),
      prop("value", "string", "—", true, "현재 선택된 활성 탭 value입니다."),
      prop("onValueChange", "(value: string) => void", "—", true, "사용자 선택을 소비자 상태로 전달합니다."),
    ],
    accessibility: ["tablist·tab·tabpanel 관계를 id로 연결합니다.", "ArrowLeft/Right와 Home/End로 활성 탭을 이동합니다.", "비활성 탭은 선택과 포커스 이동에서 제외됩니다."],
    platformNote: "Web은 ARIA tabs pattern을, Native는 accessibilityRole과 플랫폼 focus 관례를 따릅니다.",
  },
  progress: {
    examples: [
      example("determinate", "진행률을 아는 경우", "0부터 1 사이의 값을 실제 진행률로 전달합니다.", "apps/design-examples/src/progress-determinate.tsx", ProgressDeterminateExample),
      example("indeterminate", "진행률을 모르는 경우", "value를 생략해 불확정 진행 상태를 표현합니다.", "apps/design-examples/src/progress-indeterminate.tsx", ProgressIndeterminateExample),
    ],
    api: [
      prop("accessibilityLabel", "string", "—", true, "진행 중인 작업을 설명합니다."),
      prop("value", "number", "—", false, "0–1 진행률이며 생략하면 indeterminate 상태입니다."),
      prop("size", '"sm" | "md"', '"md"', false, "진행 막대의 두께를 선택합니다."),
    ],
    accessibility: ["determinate 상태는 progressbar value를 노출합니다.", "indeterminate 상태는 존재하지 않는 진행률을 0으로 표시하지 않습니다.", "레이블은 진행 중인 작업의 대상을 설명합니다."],
    motion: { trigger: "value change · indeterminate", token: "motion.normal · motion.slow", behavior: "진행률은 transform으로 전환하고 불확정 상태는 반복 이동합니다.", reducedMotion: "반복 이동을 정적인 패턴으로 바꾸고 진행 상태 의미는 유지합니다." },
    platformNote: "두 플랫폼 모두 determinate/indeterminate 의미를 공유하고 각 렌더러의 애니메이션 API를 사용합니다.",
  },
  "skeleton-region": {
    examples: [example("recipes", "콘텐츠 구조 recipe", "목록과 카드의 최종 레이아웃을 유지하는 구조화된 로딩 표본입니다.", "apps/design-examples/src/skeleton-recipes.tsx", SkeletonRecipesExample)],
    api: [
      prop("accessibilityLabel", "string", "—", true, "불러오는 콘텐츠 대상을 설명하는 busy region 이름입니다."),
      prop("recipe", '"text-block" | "list-item" | "avatar-row" | "card" | "table-row" | "form"', "—", false, "최종 콘텐츠 구조와 대응하는 검토된 placeholder 조합입니다."),
      prop("count", "1–8", "recipe 기본값", false, "반복되는 목록 또는 행의 개수입니다."),
      prop("items", "readonly SkeletonItem[]", "—", false, "마이그레이션과 예외 레이아웃을 위한 저수준 조합입니다. recipe와 함께 사용할 수 없습니다."),
    ],
    accessibility: ["개별 placeholder는 장식 요소로 숨깁니다.", "영역 하나에 aria-busy와 작업 대상을 설명하는 레이블을 제공합니다.", "성공 콘텐츠 또는 오류가 준비되면 전체 SkeletonRegion을 교체합니다."],
    motion: { trigger: "loading region mounted", token: "motion.skeletonPulse", behavior: "1.6초 주기의 낮은 대비 opacity pulse만 반복합니다.", reducedMotion: "pulse를 제거하고 정적인 placeholder 구조를 유지합니다." },
    platformNote: "Web과 Native가 동일한 recipe·count 계약을 공유하며 각 플랫폼의 reduced-motion 설정을 따릅니다.",
  },
};

export function getComponentDoc(slug: string) {
  return componentDocs[slug];
}
