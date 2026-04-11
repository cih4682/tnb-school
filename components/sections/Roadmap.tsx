"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(target: number, inView: boolean, duration = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return n;
}

const TEACHER_GOAL = 100;
const helped = 7;
const ongoing = 3;
const waiting = TEACHER_GOAL - helped - ongoing;

const stages = [
  { label: "함께한 선생님", target: helped, desc: "이미 도와드린 선생님", duration: 1200, suffix: "명" },
  { label: "진행 중", target: ongoing, desc: "현재 상담·제작 중", duration: 1000, suffix: "명" },
  { label: "다음 주인공", target: waiting, desc: "함께할 자리를 기다려요", duration: 1800, suffix: "명" },
];

export function Roadmap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const counts = [
    useCountUp(stages[0].target, inView, stages[0].duration),
    useCountUp(stages[1].target, inView, stages[1].duration),
    useCountUp(stages[2].target, inView, stages[2].duration),
  ];

  return (
    <section ref={ref} className="bg-slate-50 py-20 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Roadmap</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            100명을 위한 로드맵!
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            AI는 도구일뿐... 경험만랩 선생님을 돕습니다.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stages.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center transition-shadow hover:shadow-lg"
            >
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-extrabold tabular-nums tracking-tight md:text-7xl">
                  {counts[i]}
                </span>
                <span className="text-2xl font-bold text-slate-400">{s.suffix}</span>
              </div>
              <p className="mt-4 text-sm font-semibold">{s.label}</p>
              <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${(helped / TEACHER_GOAL) * 100}%` } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-slate-900"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>0명</span>
            <span>100명 목표</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
