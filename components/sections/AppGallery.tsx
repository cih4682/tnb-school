"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { apps, CATEGORY_LABELS, Category } from "@/data/apps";
import { AppIcon } from "../ui/AppIcon";

type Filter = "all" | Category;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "lesson-prep", label: CATEGORY_LABELS["lesson-prep"] },
  { value: "assessment", label: CATEGORY_LABELS["assessment"] },
  { value: "student-management", label: CATEGORY_LABELS["student-management"] },
  { value: "material", label: CATEGORY_LABELS["material"] },
];

const categoryDots: Record<Category, string> = {
  "lesson-prep": "bg-indigo-500",
  assessment: "bg-rose-500",
  "student-management": "bg-emerald-500",
  material: "bg-amber-500",
};

const categoryHoverBorder: Record<Category, string> = {
  "lesson-prep": "hover:border-indigo-400",
  assessment: "hover:border-rose-400",
  "student-management": "hover:border-emerald-400",
  material: "hover:border-amber-400",
};

const categories: Category[] = ["lesson-prep", "assessment", "student-management", "material"];

export function AppGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? apps : apps.filter((a) => a.category === filter);

  return (
    <section id="apps" className="bg-white py-20 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            App Gallery
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            앱 갤러리
          </h2>
        </motion.div>

        {/* 필터 */}
        <div className="mt-12">
          {/* 모바일: 가로 스크롤 / 데스크탑: 중앙 정렬 */}
          <div className="hide-scrollbar -mx-6 flex overflow-x-auto px-6 md:mx-0 md:justify-center md:overflow-visible md:px-0">
            <div className="inline-flex shrink-0 gap-1 rounded-full border border-slate-200 p-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`relative shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition md:px-5 md:py-2 md:text-sm ${
                    filter === f.value ? "text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {filter === f.value && (
                    <motion.span
                      layoutId="pill"
                      className="absolute inset-0 rounded-full bg-slate-900"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 전체: 카테고리별 롤링 */}
        {filter === "all" ? (
          <div className="mt-14 space-y-0">
            {categories.map((cat, ci) => {
              const catApps = apps.filter((a) => a.category === cat);
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: ci * 0.1 }}
                  className="border-b border-slate-100 py-8 last:border-b-0"
                >
                  {/* 카테고리 제목 */}
                  <div className="mb-6 flex items-center justify-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${categoryDots[cat]}`} />
                    <h3 className="text-sm font-bold tracking-wide">
                      {CATEGORY_LABELS[cat]}
                    </h3>
                  </div>

                  {/* 롤링 + 좌우 페이드 */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
                    <MarqueeRow apps={catApps} direction={ci % 2 === 0 ? "left" : "right"} hoverBorder={categoryHoverBorder[cat]} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 개별 카테고리: 글로우 그리드 */
          <GlowGrid>
            {visible.map((app, i) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glow-card relative rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-700">
                  <AppIcon name={app.iconName} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold">{app.name}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {CATEGORY_LABELS[app.category]}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {app.description}
                </p>
                {app.isNew && (
                  <span className="absolute right-4 top-4 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    NEW
                  </span>
                )}
              </motion.div>
            ))}
          </GlowGrid>
        )}
      </div>
    </section>
  );
}

/* 롤링 마퀴 — 호버 시 일시정지 (CSS 애니메이션 사용) */
function MarqueeRow({
  apps: rowApps,
  direction = "left",
  hoverBorder = "hover:border-slate-300",
}: {
  apps: typeof apps;
  direction?: "left" | "right";
  hoverBorder?: string;
}) {
  const items = [...rowApps, ...rowApps, ...rowApps, ...rowApps];

  return (
    <div className="group flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-5 ${direction === "left" ? "marquee-left" : "marquee-right"} group-hover:[animation-play-state:paused]`}
      >
        {items.map((app, i) => (
          <div
            key={`${app.id}-${i}`}
            className={`flex w-[230px] shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:shadow-md md:w-[300px] md:gap-4 md:p-5 ${hoverBorder}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:h-11 md:w-11">
              <AppIcon name={app.iconName} className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-bold md:text-sm">{app.name}</p>
                {app.isNew && (
                  <span className="shrink-0 rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    NEW
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-[11px] text-slate-400 md:text-xs">{app.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 글로우 그리드 */
function GlowGrid({ children }: { children: React.ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      style={
        isHovering
          ? ({
              "--glow-x": `${mousePos.x}px`,
              "--glow-y": `${mousePos.y}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute -inset-px z-10 rounded-2xl opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), rgba(99,102,241,0.12), transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
