// 방 ↔ 카테고리 매핑 (홈 방 · 대시보드 공용)

export type RoomId = "class" | "work" | "career";

export const ROOM_CATEGORIES: Record<RoomId, string[]> = {
  class: ["수업 준비", "수업 자료", "평가", "수업 활동"],
  work: ["학생 관리", "생활지도", "행정 업무", "생기부", "업무 관리"],
  career: ["진로 탐색", "진학 지도", "적성 검사", "진로 상담", "진로"],
};

export const ROOM_LABELS: Record<RoomId, string> = {
  class: "수업의 방",
  work: "업무의 방",
  career: "진로의 방",
};

export const ROOM_ORDER: RoomId[] = ["class", "work", "career"];

// 관리자 카테고리 드롭다운 (방별 그룹)
export const CATEGORY_GROUPS = [
  { room: "수업의 방", cats: ["수업 준비", "수업 자료", "평가", "수업 활동"] },
  { room: "업무의 방", cats: ["학생 관리", "생활지도", "행정 업무", "생기부"] },
  { room: "진로의 방", cats: ["진로 탐색", "진학 지도", "적성 검사", "진로 상담"] },
  { room: "기타", cats: ["기타"] },
];

// 어떤 방에도 속하지 않는지
export function roomOfCategory(category: string): RoomId | null {
  for (const id of ROOM_ORDER) {
    if (ROOM_CATEGORIES[id].includes(category)) return id;
  }
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
  iconName?: string;
  isNew?: boolean;
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
  icon?: string | null;
  is_new?: boolean | null;
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
    url: r.url || undefined,
    iconName: r.icon || undefined,
    isNew: r.is_new || undefined,
  };
}
