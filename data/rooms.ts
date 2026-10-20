// 방 ↔ 카테고리 매핑 (홈 방 · 대시보드 공용)

import { isSupporter } from "./tiers";

export type RoomId = "class" | "work" | "career" | "share";

export const ROOM_CATEGORIES: Record<RoomId, string[]> = {
  class: ["수업 준비", "수업 자료", "평가", "수업 활동"],
  work: ["학생 관리", "생활지도", "행정 업무", "생기부", "업무 관리"],
  career: ["진로 탐색", "진학 지도", "적성 검사", "진로 상담", "진로"],
  share: ["자료 나눔", "수업 나눔", "나눔"],
};

export const ROOM_LABELS: Record<RoomId, string> = {
  class: "수업의 방",
  work: "업무의 방",
  career: "진로의 방",
  share: "나눔의 방",
};

export const ROOM_ORDER: RoomId[] = ["class", "work", "career", "share"];

// 관리자 카테고리 드롭다운 (방별 그룹)
export const CATEGORY_GROUPS = [
  { room: "수업의 방", cats: ["수업 준비", "수업 자료", "평가", "수업 활동"] },
  { room: "업무의 방", cats: ["학생 관리", "생활지도", "행정 업무", "생기부"] },
  { room: "진로의 방", cats: ["진로 탐색", "진학 지도", "적성 검사", "진로 상담"] },
  { room: "나눔의 방", cats: ["자료 나눔", "수업 나눔", "나눔"] },
  { room: "기타", cats: ["기타"] },
];

// 어떤 방에도 속하지 않는지
export function roomOfCategory(category: string): RoomId | null {
  for (const id of ROOM_ORDER) {
    if (ROOM_CATEGORIES[id].includes(category)) return id;
  }
  return null;
}

// 앱 공개 범위 — public: 누구나 / member: 가입한 선생님 / supporter: 후원자 이상
export type AccessLevel = "public" | "member" | "supporter";

export const ACCESS_LEVELS: { value: AccessLevel; label: string }[] = [
  { value: "public", label: "누구나 (로그인 불필요)" },
  { value: "member", label: "가입한 선생님" },
  { value: "supporter", label: "후원자 이상" },
];

// 칼럼 추가 전(값 없음)에는 가입자 전용으로 취급
export function toAccessLevel(value?: string | null): AccessLevel {
  return value === "public" || value === "supporter" ? value : "member";
}

// 열람 권한이 없으면 잠금 사유를 돌려준다 (없으면 null)
export function lockReason(
  level: AccessLevel,
  viewer: { loggedIn: boolean; plan?: string | null }
): "login" | "supporter" | null {
  if (level === "public") return null;
  if (!viewer.loggedIn) return "login";
  if (level === "supporter" && !isSupporter(viewer.plan)) return "supporter";
  return null;
}

export interface RoomApp {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  details?: string[];
  profileImg?: string;
  video?: string;
  url?: string;
  downloadUrl?: string; // 외부 다운로드 링크(구글 드라이브 등) — 누구나 받을 수 있음
  iconName?: string;
  isNew?: boolean;
  access: AccessLevel;
  locked?: "login" | "supporter"; // 열람 권한 없음 — url 은 비워서 내려준다
}

interface ManagedAppRow {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  long_description?: string | null;
  details?: string[] | null;
  profile_img?: string | null;
  video_url?: string | null;
  url?: string | null;
  download_url?: string | null;
  icon?: string | null;
  is_new?: boolean | null;
  access_level?: string | null;
}

/* 링크 정규화: 프로토콜이 없으면 https:// 를 붙인다.
   (admin에 "www.naver.com" 처럼 저장되면 상대경로로 해석돼 404가 나므로) */
export function normalizeUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // 이미 프로토콜/앵커/메일 등이면 그대로
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export interface AppResource {
  id: string;
  fileName: string;
  storagePath: string;
  fileSize?: number;
}

interface ResourceRow {
  id: string;
  file_name: string;
  storage_path: string;
  file_size?: number | null;
}

/* resources 로우 → AppResource 변환 */
export function toAppResource(r: ResourceRow): AppResource {
  return {
    id: r.id,
    fileName: r.file_name,
    storagePath: r.storage_path,
    fileSize: r.file_size || undefined,
  };
}

/* managed_apps 로우 → RoomApp 변환 */
export function toRoomApp(r: ManagedAppRow): RoomApp {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description || "",
    longDescription: r.long_description || undefined,
    details: r.details && r.details.length ? r.details : undefined,
    profileImg: r.profile_img || undefined,
    video: r.video_url || undefined,
    url: normalizeUrl(r.url),
    downloadUrl: normalizeUrl(r.download_url),
    iconName: r.icon || undefined,
    isNew: r.is_new || undefined,
    access: toAccessLevel(r.access_level),
  };
}
