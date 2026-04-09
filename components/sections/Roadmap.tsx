"use client";

import { motion } from "framer-motion";
import { apps, APP_GOAL } from "@/data/apps";
import { Section } from "../ui/Section";

export function Roadmap() {
  const released = apps.length;
  const inProgress = 5;
  const planned = APP_GOAL - released - inProgress;

  const stages = [
    {
      icon: "✅",
      label: "출시 완료",
      count: released,
      color: "from-emerald-400 to-emerald-600",
      desc: "지금 바로 사용 가능",
    },
    {
      icon: "🚧",
      label: "개발 중",
      count: inProgress,
      color: "from-amber-400 to-orange-500",
      desc: "이번 분기 출시 예정",
    },
    {
      icon: "📋",
      label: "출시 예정",
      count: planned,
      color: "from-slate-400 to-slate-600",
      desc: "100개 목표를 향해",
    },
  ];

  return (
    <Section className="!py-24">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold md:text-4xl"
        >
          100개를 향한 로드맵
        </motion.h2>
        <p className="mt-3 text-slate-600">매주 새로운 도구가 추가됩니다</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {stages.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.color}`}
            />
            <div className="text-4xl">{s.icon}</div>
            <h3 className="mt-4 text-lg font-bold text-slate-700">{s.label}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className={`bg-gradient-to-br bg-clip-text text-5xl font-extrabold text-transparent tabular-nums ${s.color}`}
              >
                {s.count}
              </span>
              <span className="text-slate-400">개</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
