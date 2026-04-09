"use client";

import { motion } from "framer-motion";
import { apps, APP_GOAL } from "@/data/apps";

const released = apps.length;
const inProgress = 5;
const planned = APP_GOAL - released - inProgress;

const stages = [
  {
    icon: "✅",
    label: "출시 완료",
    count: released,
    color: "bg-emerald-500",
    glow: "shadow-emerald-500/40",
    desc: "지금 바로 사용 가능한 도구들",
    items: apps.slice(0, 4).map((a) => `${a.icon} ${a.name}`),
  },
  {
    icon: "🚧",
    label: "개발 중",
    count: inProgress,
    color: "bg-amber-500",
    glow: "shadow-amber-500/40",
    desc: "이번 분기 출시 예정",
    items: ["📐 도형 만들기", "🗓️ 시간표 생성기", "📎 파일 정리함", "🎯 학습 목표 트래커", "🔔 알림 매니저"],
  },
  {
    icon: "📋",
    label: "출시 예정",
    count: planned,
    color: "bg-slate-500",
    glow: "shadow-slate-500/20",
    desc: "100개 목표를 향해 기획 중",
    items: ["그리고 더 많은 도구들이 준비되고 있어요..."],
  },
];

export function Roadmap() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">
            Roadmap
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
            100개를 향한 로드맵
          </h2>
        </motion.div>

        {/* 타임라인 */}
        <div className="relative mt-20">
          {/* 세로 라인 */}
          <div className="absolute bottom-0 left-6 top-0 w-px bg-slate-200 md:left-1/2" />

          {stages.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`relative mb-16 last:mb-0 md:flex ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* 도트 */}
              <div className="absolute left-6 top-0 z-10 -translate-x-1/2 md:left-1/2">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${stage.color} text-xl text-white shadow-lg ${stage.glow}`}
                >
                  {stage.icon}
                </div>
                {i === 0 && (
                  <div
                    className={`absolute inset-0 animate-ping rounded-full ${stage.color} opacity-30`}
                  />
                )}
              </div>

              {/* 카드 */}
              <div
                className={`ml-16 md:ml-0 md:w-[calc(50%-40px)] ${
                  i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                }`}
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-white ${stage.color}`}
                  >
                    {stage.label}
                    <span className="rounded-full bg-white/30 px-2 text-xs">
                      {stage.count}개
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{stage.desc}</p>
                  <ul className="mt-4 space-y-1">
                    {stage.items.map((item, j) => (
                      <li
                        key={j}
                        className={`text-sm text-slate-500 ${
                          i % 2 === 0 ? "md:text-right" : ""
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
