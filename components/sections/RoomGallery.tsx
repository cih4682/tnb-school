"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { RoomApp, toRoomApp, ROOM_CATEGORIES } from "@/data/rooms";
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
  categories: string[];
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
    categories: ROOM_CATEGORIES.class,
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
    categories: ROOM_CATEGORIES.work,
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
    categories: ROOM_CATEGORIES.career,
    glow: "167, 139, 250",
    door: "#3b2f6b",
    light: "#c4b5fd",
    image: "/image/jinro.png",
  },
];

export function RoomGallery() {
  const [active, setActive] = useState<Room | null>(null);
  const [apps, setApps] = useState<RoomApp[]>([]);

  // 관리자(managed_apps)에서 활성 앱 불러오기
  useEffect(() => {
    supabase
      .from("managed_apps")
      .select("*")
      .eq("status", "active")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setApps((data || []).map(toRoomApp)));
  }, []);

  const listForActive = active
    ? apps.filter((a) => active.categories.includes(a.category))
    : [];

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
        {active && <RoomInterior room={active} list={listForActive} onClose={() => setActive(null)} />}
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

/* ── 수업의 방: 앱 카드 섹션 ─────────────────────────── */
function ClassChalkboard({ room, list }: { room: Room; list: RoomApp[] }) {
  const [detail, setDetail] = useState<RoomApp | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const cats = Array.from(new Set(list.map((a) => a.category)));
  const q = query.trim();
  const filtered = list.filter(
    (a) =>
      (filter === "all" || a.category === filter) &&
      (q === "" || a.name.includes(q) || a.description.includes(q))
  );
  // 피처드(KICK!) = 기본 화면에서 영상 있는 첫 앱
  const showFeatured = filter === "all" && q === "";
  const featured = showFeatured ? list.find((a) => a.video) : null;
  const gridList = filtered.filter((a) => a.id !== featured?.id);
  async function handleCopy(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard 미지원 무시 */
    }
  }
  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
      className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto px-4 py-10 md:py-14"
    >
      {/* 헤더 — 볼드 텍스트아트 */}
      <div className="text-center">
        <h3
          className="bg-gradient-to-b from-white via-emerald-50 to-emerald-300 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-6xl"
          style={{ filter: "drop-shadow(0 6px 26px rgba(52,211,153,0.35))" }}
        >
          {room.label}
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50">{room.intro}</p>
      </div>

      {/* KICK! 피처드 배너 (영상 있는 앱) */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/10 to-white/[0.02]"
        >
          <div className="flex flex-col md:flex-row">
            {/* 왼쪽: 정보 */}
            <div className="flex flex-col justify-center p-6 md:w-1/2 md:p-8">
              <span className="inline-flex w-fit items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-black italic tracking-wider text-white shadow-lg shadow-emerald-500/30">
                🔥 KICK!
              </span>
              <h4 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">{featured.name}</h4>
              <p className="mt-1 text-xs font-medium text-emerald-300/80">{featured.category}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {featured.longDescription ?? featured.description}
              </p>
              {featured.details && featured.details.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {featured.details.slice(0, 3).map((d) => (
                    <li key={d} className="flex gap-2 text-[13px] leading-snug text-white/55">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
              {featured.url && (
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-fit rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  앱 열기 →
                </a>
              )}
            </div>
            {/* 오른쪽: 영상 */}
            <div className="md:w-1/2">
              <video
                src={featured.video}
                autoPlay
                muted
                loop
                playsInline
                className="aspect-video h-full w-full bg-black object-cover md:aspect-auto"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* 카테고리 칩 + 검색 */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
            filter === "all" ? "bg-emerald-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          전체
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === c ? "bg-emerald-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="도구 검색"
          className="ml-auto w-28 rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 sm:w-44"
        />
      </div>

      {/* 리치 앱 카드 */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {gridList.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
            className="relative"
          >
            <button
              onClick={() => setDetail(app)}
              className="group flex h-full w-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-emerald-400/50 hover:bg-white/[0.06]"
            >
              {/* 상단: 프로필 + 이름/카테고리 */}
              <div className="flex items-center gap-4 pr-9">
                {app.profileImg ? (
                  <Image
                    src={app.profileImg}
                    alt={app.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20">
                    <AppIcon name={app.iconName || "calendar"} className="h-8 w-8" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-lg font-bold text-white">{app.name}</h4>
                    {app.isNew && (
                      <span className="shrink-0 rounded bg-emerald-400 px-1.5 py-0.5 text-[9px] font-bold text-[#0b1120]">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-emerald-300/80">
                    {app.category}
                  </p>
                </div>
              </div>

              {/* 하단: 상세 설명 (프로필 아래, 왼쪽 정렬) */}
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {app.longDescription ?? app.description}
              </p>
              {app.details && app.details.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {app.details.map((d) => (
                    <li key={d} className="flex gap-2 text-[13px] leading-snug text-white/55">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400/70" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 opacity-0 transition group-hover:opacity-100">
                자세히 보기 →
              </span>
            </button>

            {/* 링크 복사 버튼 (카드 우상단) */}
            {app.url && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(app.id, app.url!);
                }}
                className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="링크 복사"
                title="링크 복사"
              >
                {copiedId === app.id ? (
                  <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                )}
              </button>
            )}
          </motion.div>
        ))}
        {gridList.length === 0 && !featured && (
          <p className="col-span-full py-8 text-center text-sm text-white/50">검색 결과가 없어요</p>
        )}
      </div>
    </motion.div>

    <AnimatePresence>
      {detail && <AppDetailModal app={detail} onClose={() => setDetail(null)} />}
    </AnimatePresence>
    </>
  );
}

/* ── 앱 상세 (설명 영상 + 프로필 + 열기) ───────────────── */
function AppDetailModal({ app, onClose }: { app: RoomApp; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0e1f1a] shadow-2xl"
      >
        {app.video ? (
          <video
            src={app.video}
            autoPlay
            muted
            loop
            playsInline
            className="aspect-video w-full bg-black object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-white/5 text-sm text-white/40">
            설명 영상 준비 중
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-3">
            {app.profileImg && (
              <Image
                src={app.profileImg}
                alt={app.name}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-white/15 object-cover"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-white">{app.name}</h4>
                {app.isNew && (
                  <span className="rounded bg-emerald-400 px-1.5 py-0.5 text-[10px] font-bold text-[#0b1120]">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40">{app.category}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/70">{app.description}</p>

          {app.url ? (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block w-full rounded-full bg-emerald-500 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              앱 열기 →
            </a>
          ) : (
            <div className="mt-6 block w-full rounded-full border border-white/15 py-3.5 text-center text-sm text-white/40">
              준비 중
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          aria-label="닫기"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── 방 내부 (문 열림 → 공개) ─────────────────────────── */
function RoomInterior({ room, list, onClose }: { room: Room; list: RoomApp[]; onClose: () => void }) {
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
      {room.id === "class" && !isEmpty ? (
        <ClassChalkboard room={room} list={list} />
      ) : (
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
                <AppIcon name={app.iconName || "calendar"} className="h-6 w-6" />
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
                  {app.category}
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
      )}

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
