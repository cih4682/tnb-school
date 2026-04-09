"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { apps, APP_GOAL } from "@/data/apps";

const RADIUS = 120;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Counter() {
  const current = apps.length;
  const percent = current / APP_GOAL;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * current));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, current]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-950 py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 md:flex-row md:justify-between">
          {/* 좌: SVG 프로그레스 링 */}
          <div className="relative flex items-center justify-center">
            {/* 궤도 아이콘들 */}
            {apps.slice(0, 6).map((app, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const r = 175;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                  className="absolute flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur-sm"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * r}px - 20px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 20px)`,
                  }}
                >
                  {app.icon}
                </motion.div>
              );
            })}

            <svg width="280" height="280" className="drop-shadow-2xl">
              {/* 배경 링 */}
              <circle
                cx="140"
                cy="140"
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={STROKE}
              />
              {/* 프로그레스 링 */}
              <motion.circle
                cx="140"
                cy="140"
                r={RADIUS}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={
                  inView
                    ? { strokeDashoffset: CIRCUMFERENCE * (1 - percent) }
                    : {}
                }
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>

            {/* 중앙 숫자 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-6xl font-extrabold tabular-nums text-transparent">
                {n}
              </span>
              <span className="text-sm text-white/50">/ {APP_GOAL}</span>
            </div>
          </div>

          {/* 우: 텍스트 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-md text-center md:text-left"
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
              Progress
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
              100개를 향해
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">
                함께 성장 중
              </span>
            </h2>
            <p className="mt-6 leading-relaxed text-white/60">
              T&B School은 매주 새로운 앱이 추가됩니다.
              <br />
              100개의 도구가 완성되면, 선생님의 하루가 완전히 달라질 거예요.
            </p>
            <div className="mt-8 flex justify-center gap-8 md:justify-start">
              <Stat value={`${current}`} label="출시 완료" />
              <Stat value="5" label="개발 중" />
              <Stat value={`${APP_GOAL - current - 5}`} label="예정" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/40">{label}</div>
    </div>
  );
}
