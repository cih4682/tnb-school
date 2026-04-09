"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { apps, APP_GOAL } from "@/data/apps";

const RADIUS = 90;
const STROKE = 6;
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
    <section ref={ref} className="border-y border-slate-100 bg-white py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 md:flex-row md:justify-center md:gap-24">
        {/* SVG 링 */}
        <div className="relative">
          <svg width="200" height="200">
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
            <motion.circle
              cx="100" cy="100" r={RADIUS} fill="none"
              stroke="#0f172a"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={inView ? { strokeDashoffset: CIRCUMFERENCE * (1 - percent) } : {}}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold tabular-nums">{n}</span>
            <span className="text-sm text-slate-400">/ {APP_GOAL}</span>
          </div>
        </div>

        {/* 텍스트 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-sm text-center md:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Progress</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">100개를 향해 성장 중</h2>
          <p className="mt-4 leading-relaxed text-slate-500">
            매주 새로운 도구가 추가됩니다. 100개가 완성되면, 선생님의 하루가 달라져요.
          </p>
          <div className="mt-8 flex justify-center gap-10 md:justify-start">
            <div><span className="text-2xl font-bold">{current}</span><p className="text-xs text-slate-400">출시</p></div>
            <div><span className="text-2xl font-bold">5</span><p className="text-xs text-slate-400">개발 중</p></div>
            <div><span className="text-2xl font-bold">{APP_GOAL - current - 5}</span><p className="text-xs text-slate-400">예정</p></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
