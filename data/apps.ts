export type Category =
  | "lesson-prep"
  | "assessment"
  | "student-management"
  | "material"
  | "career";

export const CATEGORY_LABELS: Record<Category, string> = {
  "lesson-prep": "수업 준비",
  assessment: "평가",
  "student-management": "학생 관리",
  material: "업무 관리",
  career: "진로 지도",
};

export interface App {
  id: string;
  name: string;
  category: Category;
  description: string;
  iconName: string;
  isNew?: boolean;
  profileImg?: string; // 앱 프로필/아이콘 이미지
  video?: string; // 설명 영상 (10초)
  url?: string; // 실제 앱 주소
  longDescription?: string; // 카드용 상세 설명
  details?: string[]; // 개조식 설명
}

export const APP_GOAL = 100;

export const apps: App[] = [
  {
    id: "lesson-planner",
    name: "수업 플래너",
    category: "lesson-prep",
    description: "주간 수업 계획을 드래그앤드롭으로 정리해요.",
    iconName: "calendar",
    profileImg: "/app/edumemo_2.png",
    video: "/app/edumemo_1.mp4",
    url: "https://www.naver.com",
    longDescription:
      "한 주의 수업을 요일·교시별로 한눈에 정리하는 도구예요. 계획을 드래그로 옮기고, 반복되는 수업은 복사해 빠르게 채워요.",
    details: [
      "요일·교시 시간표를 한눈에 관리",
      "드래그앤드롭으로 자유롭게 이동",
      "반복 수업은 복사해서 빠르게 입력",
      "저장하면 언제 어디서나 다시 확인",
    ],
  },
  {
    id: "slide-maker",
    name: "퀵 슬라이드",
    category: "lesson-prep",
    description: "주제만 입력하면 수업 슬라이드 초안이 완성됩니다.",
    iconName: "slides",
    isNew: true,
    longDescription:
      "주제만 입력하면 수업용 슬라이드 초안을 만들어줘요. 필요한 장만 골라 다듬으면 끝이에요.",
    details: [
      "주제·학년 입력으로 초안 자동 생성",
      "필요한 슬라이드만 선택·편집",
      "이미지와 도표 자동 배치",
    ],
  },
  {
    id: "worksheet-gen",
    name: "워크시트 생성기",
    category: "material",
    description: "학년·과목별 맞춤 워크시트를 자동 생성해요.",
    iconName: "fileText",
  },
  {
    id: "quiz-maker",
    name: "퀴즈 메이커",
    category: "assessment",
    description: "객관식·주관식 문제를 한 번에 만들어요.",
    iconName: "circleHelp",
    longDescription:
      "단원만 고르면 객관식·주관식 문제를 한 번에 만들어줘요. 난이도와 유형도 조절할 수 있어요.",
    details: [
      "단원 선택으로 문제 자동 생성",
      "난이도·문항 유형 조절",
      "정답과 해설까지 함께 제공",
    ],
  },
  {
    id: "rubric-builder",
    name: "루브릭 빌더",
    category: "assessment",
    description: "수행평가 기준표를 클릭 몇 번으로 완성합니다.",
    iconName: "barChart",
    longDescription:
      "수행평가 기준표(루브릭)를 빠르게 만들어요. 평가 항목과 배점만 정하면 바로 완성돼요.",
    details: [
      "평가 항목 입력으로 기준표 완성",
      "척도·배점 자유롭게 설정",
      "학생 공유용으로 바로 내보내기",
    ],
  },
  {
    id: "attendance",
    name: "스마트 출석부",
    category: "student-management",
    description: "QR/얼굴 인식으로 출결을 빠르게 기록해요.",
    iconName: "checkCircle",
  },
  {
    id: "seating-chart",
    name: "자리 배치도",
    category: "student-management",
    description: "랜덤·조건부로 좌석을 자동 배치합니다.",
    iconName: "chair",
  },
  {
    id: "behavior-log",
    name: "행동 관찰 기록",
    category: "student-management",
    description: "관찰 기록을 누적해 생기부 작성에 활용해요.",
    iconName: "search",
    isNew: true,
  },
  {
    id: "poster-maker",
    name: "포스터 메이커",
    category: "material",
    description: "교실 게시용 포스터를 템플릿으로 만들어요.",
    iconName: "palette",
  },
  {
    id: "report-writer",
    name: "생기부 도우미",
    category: "material",
    description: "관찰 기록을 문장으로 다듬어 줍니다.",
    iconName: "pen",
  },
  {
    id: "college-counsel",
    name: "대입상담",
    category: "career",
    description: "학생 성적·활동을 바탕으로 맞춤 대입 전략을 함께 정리해요.",
    iconName: "compass",
    isNew: true,
  },
];
