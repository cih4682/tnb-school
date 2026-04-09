"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { apps, APP_GOAL } from "@/data/apps";
import { Section } from "../ui/Section";

export function Counter() {
  const current = apps.length;
  const percent = Math.min(100, Math.round((current / APP_GOAL) * 100));

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
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
    <Section className="!py-16">
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-700 to-purple-900 p-10 text-white shadow-2xl shadow-brand-600/20 md:p-14"
      >
        {/* 배경 블롭 */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-brand-100">지금까지 만든 앱</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="bg-gradient-to-r from-white to-brand-100 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent tabular-nums md:text-7xl">
                {n}
              </span>
              <span className="text-2xl text-brand-100">/ {APP_GOAL}</span>
            </div>
          </div>
          <p className="max-w-sm text-brand-100">
            T&B School은 매주 새로운 앱이 추가됩니다.
            <br />
            100개를 향해 함께 성장 중이에요.
          </p>
        </div>

        <div className="relative mt-8 h-3 w-full overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${percent}%` } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-pink-400 via-amber-300 to-white"
          />
        </div>
        <div className="mt-2 text-right text-sm text-brand-100">{percent}% 진행</div>
      </div>
    </Section>
  );
}
