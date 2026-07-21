"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { apps, CATEGORY_LABELS, Category } from "@/data/apps";
import { AppIcon } from "../ui/AppIcon";

/* ── 방 정의 ─────────────────────────────────────────────
   현재 4개 카테고리를 3개의 방으로 묶는다.
   수업의 방 = 수업 준비 + 평가
   업무의 방 = 학생 관리 + 업무 관리
   진로의 방 = 아직 앱 없음 → "곧 열립니다" 잠긴 방 (성장 서사) */
interface Room {
  id: string;
  label: string;
  tagline: string;
  intro: string;
  categories: Category[];
  glow: string; // "r, g, b"
  door: string; // 문짝 베이스 색
  light: string; // 문틈/포인트 빛
  locked?: boolean;
  image?: string; // 있으면 CSS 문 대신 이미지 문 사용
}

const ROOMS: Room[] = [
  {
    id: "class",
    label: "수업의 방",
    tagline: "가르치는 모든 순간",
    intro: "수업을 준비하고 평가하는 도구들이 이 방에 놓여 있어요.",
    categories: ["lesson-prep", "assessment"],
    glow: "52, 211, 153",
    door: "#1f6b52",
    light: "#6ee7b7",
    image: "/image/suup.png",
  },
  {
    id: "work",
    label: "업무의 방",
    tagline: "행정과 기록의 자리",
    intro: "학생 관리와 반복되는 업무를 덜어주는 도구들이 모여 있어요.",
    categories: ["student-management", "material"],
    glow: "251, 191, 36",
    door: "#7c5a2e",
    light: "#fcd34d",
    image: "/image/upmu.png",
  },
  {
    id: "career",
    label: "진로의 방",
    tagline: "아이들의 내일을 그리다",
    intro: "성적을 넘어, 아이의 진로를 함께 그리는 도구들이 놓이기 시작한 방이에요.",
    categories: ["career"],
    glow: "167, 139, 250",
    door: "#3b2f6b",
    light: "#c4b5fd",
    image: "/image/jinro.png",
  },
];

function roomApps(room: Room) {
  return apps.filter((a) => room.categories.includes(a.category));
}

export function RoomGallery() {
  const [active, setActive] = useState<Room | null>(null);

  // 방이 열리면 배경 스크롤 잠금 + ESC 로 닫기
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section
      id="apps"
      className="relative overflow-hidden bg-slate-950 pb-24 pt-12 md:pb-36 md:pt-16"
    >
      {/* 은은한 배경 광원 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* 흐름을 이어주는 얇은 세로선 */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-12 h-28 w-px origin-top bg-gradient-to-b from-transparent via-slate-600/40 to-slate-300/70 md:mb-16 md:h-36"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            App Gallery
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            세 개의 방
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            문을 열면 그 방에 놓인 도구들을 만날 수 있어요.
            <br className="hidden sm:block" />
            어느 방부터 들어가 볼까요?
          </p>
        </motion.div>

        {/* 세 개의 문 */}
        <div className="mt-16 grid gap-10 sm:grid-cols-3 md:mt-24 md:gap-6">
          {ROOMS.map((room, i) => (
            <DoorCard
              key={room.id}
              room={room}
              index={i}
              onEnter={() => setActive(room)}
            />
          ))}
        </div>
      </div>

      {/* 방 내부 오버레이 */}
      <AnimatePresence>
        {active && <RoomInterior room={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* ── 문 카드 (아이소메트릭 부유) ───────────────────────── */
function DoorCard({
  room,
  index,
  onEnter,
}: {
  room: Room;
  index: number;
  onEnter: () => void;
}) {
  const { glow, door, light, locked } = room;

  return (
    <motion.button
      type="button"
      onClick={onEnter}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ scale: 1.09 }}
      className="group relative flex cursor-pointer flex-col items-center focus:outline-none"
      style={{ perspective: 1000 }}
      aria-label={locked ? `${room.label} — 곧 열립니다 (미리보기)` : `${room.label} 들어가기`}
    >
      {/* 부유하는 문 */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 4 + index * 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* 바닥 광원 */}
        <div
          className="absolute -bottom-4 left-1/2 h-8 w-36 -translate-x-1/2 rounded-[50%] blur-xl transition-opacity duration-500"
          style={{
            background: `rgba(${glow}, ${locked ? 0.4 : 0.55})`,
          }}
        />
        {/* 문짝 — 이미지가 있으면 이미지 문, 없으면 CSS 문 */}
        {room.image ? (
          <Image
            src={room.image}
            alt={`${room.label} 문`}
            width={216}
            height={288}
            className="relative h-72 w-auto select-none transition-all duration-500"
            style={{ filter: `drop-shadow(0 0 28px rgba(${glow}, 0.45))` }}
          />
        ) : (
          <div
            className="relative h-72 w-44 rounded-t-[5.5rem] rounded-b-xl border-4 p-2 transition-all duration-500"
            style={{
              borderColor: `rgba(${glow}, 0.45)`,
              background: `linear-gradient(165deg, ${door} 0%, #0b1120 90%)`,
              boxShadow: `0 0 ${locked ? 32 : 45}px rgba(${glow}, ${
                locked ? 0.28 : 0.35
              }), inset 0 0 40px rgba(0,0,0,0.5)`,
            }}
          >
            {/* 문틈 빛 (hover 시 확장) */}
            {!locked && (
              <div
                className="absolute inset-y-8 left-1/2 w-[3px] -translate-x-1/2 rounded-full transition-all duration-500 group-hover:inset-y-3"
                style={{
                  background: light,
                  boxShadow: `0 0 12px ${light}, 0 0 28px ${light}`,
                }}
              />
            )}
            {/* 손잡이 */}
            <div
              className="absolute left-1/2 top-1/2 flex -translate-y-1/2 gap-6"
              style={{ transform: "translateX(-50%)" }}
            >
              <span
                className="block h-3 w-3 rounded-full"
                style={{ background: `rgba(${glow}, 0.9)` }}
              />
              <span
                className="block h-3 w-3 rounded-full"
                style={{ background: `rgba(${glow}, 0.9)` }}
              />
            </div>

            {/* 잠금 표시 */}
            {locked && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{ color: light, filter: `drop-shadow(0 0 8px rgba(${glow},0.7))` }}
              >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
                </svg>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 라벨 */}
      <div className="mt-10 text-center">
        <h3 className="text-xl font-bold text-white">{room.label}</h3>
        <p className="mt-1 text-sm text-slate-400">{room.tagline}</p>
        <span
          className="mt-3 inline-block text-[13px] font-semibold"
          style={{ color: `rgb(${glow})` }}
        >
          {locked ? "곧 열립니다" : "들어가 보기 →"}
        </span>
      </div>
    </motion.button>
  );
}

/* ── 방 내부 (문 열림 → 공개) ─────────────────────────── */
function RoomInterior({ room, onClose }: { room: Room; onClose: () => void }) {
  const list = roomApps(room);
  const isEmpty = list.length === 0;
  const { glow, door, light } = room;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ perspective: 1400 }}
    >
      {/* 방 배경 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, rgba(${glow},0.22) 0%, transparent 55%), #05070d`,
        }}
        onClick={onClose}
      />

      {/* 방 안 콘텐츠 (문 열린 뒤 등장) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-h-[86vh] w-full max-w-4xl overflow-y-auto px-6 py-16"
      >
        <div className="text-center">
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ background: `rgba(${glow},0.16)`, color: `rgb(${glow})` }}
          >
            {isEmpty ? "곧 열립니다" : `${list.length}개의 도구`}
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-white">{room.label}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {room.intro}
          </p>
        </div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="mx-auto mt-14 max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: `rgba(${glow},0.18)`,
                color: light,
                boxShadow: `0 0 30px rgba(${glow},0.4)`,
              }}
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.4L12 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
              </svg>
            </motion.div>
            <h4 className="mt-6 text-xl font-bold text-white">이 방은 준비 중입니다</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              곧 진로를 함께 그리는 도구들이
              <br />이 방을 하나씩 채울 예정이에요.
            </p>
            <p className="mt-5 text-xs" style={{ color: `rgb(${glow})` }}>
              10개에서 100개로 — 방이 자라는 중 🌱
            </p>
          </motion.div>
        ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {list.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.06, duration: 0.4 }}
              className="group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10"
              style={{ boxShadow: `inset 0 0 0 1px rgba(${glow},0)` }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: `rgba(${glow},0.18)`, color: light }}
              >
                <AppIcon name={app.iconName} className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-base font-bold text-white">{app.name}</h4>
                  {app.isNew && (
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold"
                      style={{ background: light, color: "#0b1120" }}
                    >
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {CATEGORY_LABELS[app.category]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {app.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </motion.div>

      {/* 문짝 두 짝 — 열리며 방을 공개 */}
      <DoorHalf side="left" door={door} glow={glow} />
      <DoorHalf side="right" door={door} glow={glow} />

      {/* 닫기 버튼 */}
      <motion.button
        type="button"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        밖으로
      </motion.button>
    </motion.div>
  );
}

function DoorHalf({
  side,
  door,
  glow,
}: {
  side: "left" | "right";
  door: string;
  glow: string;
}) {
  const isLeft = side === "left";
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isLeft ? -108 : 108 }}
      exit={{ rotateY: 0 }}
      transition={{ delay: 0.15, duration: 0.9, ease: [0.6, 0, 0.2, 1] }}
      className="pointer-events-none absolute inset-y-0 z-10 w-1/2"
      style={{
        [isLeft ? "left" : "right"]: 0,
        transformOrigin: isLeft ? "left center" : "right center",
        transformStyle: "preserve-3d",
        background: `linear-gradient(${
          isLeft ? "100deg" : "260deg"
        }, ${door} 0%, #05070d 100%)`,
        boxShadow: `inset ${isLeft ? "-" : ""}30px 0 60px rgba(0,0,0,0.6)`,
        borderRight: isLeft ? `2px solid rgba(${glow},0.5)` : undefined,
        borderLeft: !isLeft ? `2px solid rgba(${glow},0.5)` : undefined,
      }}
    >
      {/* 문틈 쪽 빛줄기 */}
      <div
        className="absolute inset-y-0 w-16"
        style={{
          [isLeft ? "right" : "left"]: 0,
          background: `linear-gradient(${
            isLeft ? "270deg" : "90deg"
          }, rgba(${glow},0.35), transparent)`,
        }}
      />
    </motion.div>
  );
}
