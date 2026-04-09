"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apps, CATEGORY_LABELS, Category, App } from "@/data/apps";
import { AppIcon } from "../ui/AppIcon";

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
    <section id="apps" className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">App Gallery</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">앱 갤러리</h2>
        </motion.div>

        {/* 필터 */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex gap-1 rounded-full border border-slate-200 p-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value);
                  const first = f.value === "all" ? apps[0] : apps.find((a) => a.category === f.value);
                  if (first) setActive(first);
                }}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
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

        {/* 리스트 + 프리뷰 */}
        <div className="mt-16 grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="space-y-0.5">
            {visible.map((app, i) => {
              const isActive = active.id === app.id;
              return (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onMouseEnter={() => setActive(app)}
                  onClick={() => setActive(app)}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition ${
                    isActive ? "bg-slate-50" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    isActive ? "border-slate-900 text-slate-900" : "border-slate-200 text-slate-400"
                  } transition`}>
                    <AppIcon name={app.iconName} className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-semibold ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {app.name}
                    </span>
                    {app.isNew && (
                      <span className="ml-2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className={`text-xs transition ${isActive ? "text-slate-900" : "text-transparent"}`}>→</span>
                </motion.button>
              );
            })}
          </div>

          {/* 프리뷰 */}
          <div className="flex items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-10 md:p-12"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900">
                  <AppIcon name={active.iconName} className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">{active.name}</h3>
                <span className="mt-2 inline-block text-xs font-medium text-slate-400">
                  {CATEGORY_LABELS[active.category]}
                </span>
                <p className="mt-5 text-base leading-relaxed text-slate-500">
                  {active.description}
                </p>
                {active.isNew && (
                  <div className="mt-6 inline-block rounded-full border border-slate-900 px-3 py-1 text-xs font-semibold">
                    새로 출시
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
