export type Category =
  | "lesson-prep"
  | "assessment"
  | "student-management"
  | "material";

export const CATEGORY_LABELS: Record<Category, string> = {
  "lesson-prep": "수업 준비",
  assessment: "평가",
  "student-management": "학생 관리",
  material: "자료 제작",
};

export interface App {
  id: string;
  name: string;
  category: Category;
  description: string;
  icon: string; // 이모지 — 나중에 이미지로 교체 가능
  isNew?: boolean;
}

export const APP_GOAL = 100;

export const apps: App[] = [
  {
    id: "lesson-planner",
    name: "수업 플래너",
    category: "lesson-prep",
    description: "주간 수업 계획을 드래그앤드롭으로 정리해요.",
    icon: "📅",
  },
  {
    id: "slide-maker",
    name: "퀵 슬라이드",
    category: "lesson-prep",
    description: "주제만 입력하면 수업 슬라이드 초안이 완성됩니다.",
    icon: "🎞️",
    isNew: true,
  },
  {
    id: "worksheet-gen",
    name: "워크시트 생성기",
    category: "material",
    description: "학년·과목별 맞춤 워크시트를 자동 생성해요.",
    icon: "📝",
  },
  {
    id: "quiz-maker",
    name: "퀴즈 메이커",
    category: "assessment",
    description: "객관식·주관식 문제를 한 번에 만들어요.",
    icon: "❓",
  },
  {
    id: "rubric-builder",
    name: "루브릭 빌더",
    category: "assessment",
    description: "수행평가 기준표를 클릭 몇 번으로 완성합니다.",
    icon: "📊",
  },
  {
    id: "attendance",
    name: "스마트 출석부",
    category: "student-management",
    description: "QR/얼굴 인식으로 출결을 빠르게 기록해요.",
    icon: "✅",
  },
  {
    id: "seating-chart",
    name: "자리 배치도",
    category: "student-management",
    description: "랜덤·조건부로 좌석을 자동 배치합니다.",
    icon: "🪑",
  },
  {
    id: "behavior-log",
    name: "행동 관찰 기록",
    category: "student-management",
    description: "관찰 기록을 누적해 생기부 작성에 활용해요.",
    icon: "🔍",
    isNew: true,
  },
  {
    id: "poster-maker",
    name: "포스터 메이커",
    category: "material",
    description: "교실 게시용 포스터를 템플릿으로 만들어요.",
    icon: "🎨",
  },
  {
    id: "report-writer",
    name: "생기부 도우미",
    category: "material",
    description: "관찰 기록을 문장으로 다듬어 줍니다.",
    icon: "✍️",
  },
];
