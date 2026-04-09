"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const values = [
  {
    icon: "⚡",
    title: "5분이면 충분",
    desc: "복잡한 작업도 클릭 몇 번이면 끝. 수업 준비 시간을 돌려드려요.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: "🎟️",
    title: "한 번 입학, 평생 사용",
    desc: "입학금만 내면 모든 앱을 추가 비용 없이 사용할 수 있어요.",
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    icon: "🛠️",
    title: "원하는 앱은 직접 의뢰",
    desc: "필요한 앱이 없다면? 선생님 맞춤으로 새로 만들어 드립니다.",
    gradient: "from-cyan-400 to-blue-600",
  },
];

export function Values() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">
      {/* 별빛 파티클 */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-pink-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
            Why T&B School
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
            왜 T&B School인가요?
          </h2>
        </motion.div>

        <div className="mt-20 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-6">
          {values.map((v, i) => {
            const isHovered = hovered === i;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                animate={{
                  scale: isHovered ? 1.08 : hovered !== null ? 0.95 : 1,
                  y: isHovered ? -12 : 0,
                }}
                className="group relative w-full max-w-sm cursor-default"
              >
                {/* 글로우 */}
                <div
                  className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${v.gradient} opacity-0 blur-xl transition-opacity duration-500 ${isHovered ? "opacity-40" : ""}`}
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-sm">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${v.gradient} text-3xl shadow-lg`}
                  >
                    {v.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/60">{v.desc}</p>
                  {/* 하단 그라데이션 라인 */}
                  <div
                    className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${v.gradient} opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : ""}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
