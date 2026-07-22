// 후원 등급 (구 plan) — 앱 접근 권한이 아니라 "감사·인정" 표시용
// 앱은 가입자 전원 모두 사용 가능. 등급은 뱃지/명단 등 소통 목적에만 쓴다.

export type TierValue = "member" | "supporter" | "corporate" | "partner";

export interface Tier {
  value: TierValue;
  label: string; // 등급명
  badge: boolean; // 후원 뱃지 표시 여부 (후원자만 true)
  emoji?: string; // 뱃지 이모지
  chip: string; // 관리자 목록 칩 색상 (tailwind)
}

export const TIERS: Tier[] = [
  { value: "member", label: "선생님", badge: false, chip: "bg-slate-100 text-slate-500" },
  { value: "supporter", label: "개인 후원자", badge: true, chip: "bg-emerald-50 text-emerald-600" },
  { value: "corporate", label: "기업 후원자", badge: true, chip: "bg-amber-50 text-amber-600" },
  { value: "partner", label: "파트너·단체", badge: false, chip: "bg-purple-50 text-purple-600" },
];

export const DEFAULT_TIER: TierValue = "member";

// 마이그레이션 전 남아있는 옛 값도 안전하게 매핑
const LEGACY: Record<string, TierValue> = {
  free: "member",
  basic: "supporter",
  pro: "corporate",
  team: "partner",
};

export function getTier(value?: string | null): Tier {
  const v = value && LEGACY[value] ? LEGACY[value] : value;
  return TIERS.find((t) => t.value === v) ?? TIERS[0];
}
