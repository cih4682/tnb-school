"use client";

import { motion } from "framer-motion";
import { apps, APP_GOAL } from "@/data/apps";

const released = apps.length;
const inProgress = 5;
const planned = APP_GOAL - released - inProgress;

const stages = [
  { label: "출시 완료", count: released, desc: "지금 바로 사용 가능" },
  { label: "개발 중", count: inProgress, desc: "이번 분기 출시 예정" },
  { label: "출시 예정", count: planned, desc: "100개 목표를 향해" },
];

export function Roadmap() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Roadmap</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">100개를 향한 로드맵</h2>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {stages.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl border border-slate-200 p-8 text-center"
            >
              <span className="text-5xl font-extrabold tabular-nums">{s.count}</span>
              <p className="mt-3 text-sm font-semibold">{s.label}</p>
              <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
