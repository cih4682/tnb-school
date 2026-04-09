"use client";

import { useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { apps, CATEGORY_LABELS, Category, App } from "@/data/apps";
import { Section } from "../ui/Section";

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
  const visible = filter === "all" ? apps : apps.filter((a) => a.category === filter);

  return (
    <Section id="apps">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold md:text-4xl"
        >
          앱 갤러리
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-slate-600"
        >
          선생님께 필요한 도구를 카테고리로 골라보세요
        </motion.p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              filter === f.value
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((app, i) => (
          <TiltCard key={app.id} app={app} index={i} />
        ))}
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-slate-500">
          이 카테고리에는 아직 앱이 없어요.
        </p>
      )}
    </Section>
  );
}

function TiltCard({ app, index }: { app: App; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-8deg", "8deg"]);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-600/10"
    >
      {/* 호버 그라데이션 글로우 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-pink-50 opacity-0 transition-opacity group-hover:opacity-100" />

      {app.isNew && (
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-pink-500 to-brand-600 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
          NEW
        </span>
      )}
      <div className="relative" style={{ transform: "translateZ(40px)" }}>
        <div className="text-5xl">{app.icon}</div>
        <h3 className="mt-4 text-lg font-bold">{app.name}</h3>
        <p className="mt-1 text-xs font-medium text-brand-600">
          {CATEGORY_LABELS[app.category]}
        </p>
        <p className="mt-3 text-sm text-slate-600">{app.description}</p>
      </div>
    </motion.div>
  );
}
