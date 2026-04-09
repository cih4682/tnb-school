"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps, CATEGORY_LABELS, Category, App } from "@/data/apps";

type Filter = "all" | Category;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "lesson-prep", label: CATEGORY_LABELS["lesson-prep"] },
  { value: "assessment", label: CATEGORY_LABELS["assessment"] },
  { value: "student-management", label: CATEGORY_LABELS["student-management"] },
  { value: "material", label: CATEGORY_LABELS["material"] },
];

export function AppGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<App>(apps[0]);

  const visible = filter === "all" ? apps : apps.filter((a) => a.category === filter);

  return (
    <section id="apps" className="relative bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">
            App Gallery
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">앱 갤러리</h2>
        </motion.div>

        {/* 필터 탭 */}
        <div className="relative mt-12 flex justify-center">
          <div className="inline-flex gap-1 rounded-full bg-slate-100 p-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value);
                  const first =
                    f.value === "all"
                      ? apps[0]
                      : apps.find((a) => a.category === f.value);
                  if (first) setActive(first);
                }}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
                  filter === f.value
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter === f.value && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-brand-600 shadow-lg shadow-brand-600/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 호버리스트 + 프리뷰 */}
        <div className="mt-16 grid gap-8 md:grid-cols-[1fr_1.2fr]">
          {/* 좌: 앱 리스트 */}
          <div className="space-y-1">
            {visible.map((app, i) => {
              const isActive = active.id === app.id;
              return (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onMouseEnter={() => setActive(app)}
                  onClick={() => setActive(app)}
                  className={`group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition ${
                    isActive
                      ? "bg-brand-50 shadow-sm"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span className="text-3xl">{app.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${isActive ? "text-brand-600" : "text-slate-900"}`}
                      >
                        {app.name}
                      </span>
                      {app.isNew && (
                        <span className="rounded-full bg-gradient-to-r from-pink-500 to-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {CATEGORY_LABELS[app.category]}
                    </span>
                  </div>
                  <motion.div
                    animate={{ x: isActive ? 0 : -8, opacity: isActive ? 1 : 0 }}
                    className="text-brand-600"
                  >
                    →
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* 우: 프리뷰 카드 */}
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-10 shadow-2xl shadow-slate-200/50 md:p-14"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/50 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-100/50 blur-3xl" />
                <div className="relative">
                  <div className="text-7xl">{active.icon}</div>
                  <h3 className="mt-6 text-2xl font-extrabold md:text-3xl">
                    {active.name}
                  </h3>
                  <span className="mt-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                    {CATEGORY_LABELS[active.category]}
                  </span>
                  <p className="mt-6 text-lg leading-relaxed text-slate-600">
                    {active.description}
                  </p>
                  {active.isNew && (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-brand-600 px-4 py-1.5 text-sm font-medium text-white">
                      ✨ 새로 출시된 앱
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
