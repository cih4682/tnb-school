"use client";

import { motion } from "framer-motion";

const values = [
  {
    title: "5분이면 충분",
    desc: "복잡한 작업도 클릭 몇 번이면 끝!\n수업 준비 시간을 돌려드려요.",
    icon: "gauge",
  },
  {
    title: "추가 비용 없이, 전부",
    desc: "입학금만 내면 모든 앱을\n추가 비용 없이 사용할 수 있어요!",
    icon: "check",
  },
  {
    title: "나만의 앱 개별화",
    desc: "나에게 꼭 필요한 앱이 있다면?\n나만을 위한 앱 개별화는 오직 교사버프!",
    icon: "sliders",
  },
];

export function Values() {
  return (
    <section className="bg-white py-20 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Why T&B School
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            왜 T&B School인가요?
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-12">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition-all duration-500 group-hover:border-slate-400 group-hover:shadow-lg">
                {v.icon === "gauge" && <GaugeIcon />}
                {v.icon === "check" && <CheckIcon />}
                {v.icon === "sliders" && <SlidersIcon />}
              </div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.3 }}
                className="mt-7 text-lg font-bold tracking-tight"
              >
                {v.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.45 }}
                className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-500"
              >
                {v.desc}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
      <circle cx="20" cy="22" r="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="66 22" />
      <motion.path
        d="M20 22l5-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ rotate: -60 }}
        whileInView={{ rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "20px 22px" }}
      />
      <circle cx="20" cy="22" r="2" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
      <motion.path
        d="M13 20l4 4 10-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
      <line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <motion.circle
        cx="15" cy="12" r="3" fill="white" stroke="currentColor" strokeWidth="1.5"
        initial={{ cx: 12 }}
        whileInView={{ cx: 15 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="25" cy="20" r="3" fill="white" stroke="currentColor" strokeWidth="1.5"
        initial={{ cx: 20 }}
        whileInView={{ cx: 25 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="18" cy="28" r="3" fill="white" stroke="currentColor" strokeWidth="1.5"
        initial={{ cx: 24 }}
        whileInView={{ cx: 18 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
