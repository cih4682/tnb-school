"use client";

import { useRef, useState, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const values = [
  {
    title: "준비는 가볍게",
    desc: "수업 준비와 잡무를 줄여,\n하루가 여유로워져요.",
    icon: "gauge",
  },
  {
    title: "진짜 필요한 것만",
    desc: "교실 현장의 고민에서\n하나씩 만든 도구예요.",
    icon: "check",
  },
  {
    title: "함께 만들어요",
    desc: "필요한 앱을 만들 땐,\n'티프'가 도와드려요.",
    icon: "sliders",
  },
];

export function Values() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [lit, setLit] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function pointTo(clientX: number, clientY: number) {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    setPos({ x, y: clientY - r.top });
    setActiveIdx(Math.min(values.length - 1, Math.max(0, Math.floor(x / (r.width / values.length)))));
  }

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    pointTo(e.clientX, e.clientY);
  }

  // 램프 꺾임: 왼쪽 카드 → 왼쪽, 오른쪽 카드 → 오른쪽 (모바일 30°, 데스크탑 40°)
  const lampRot =
    lit && activeIdx !== null ? ((values.length - 1) / 2 - activeIdx) * (isMobile ? 20 : 40) : 0;

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
            For Teachers
          </p>
          <h2 className="mt-4 text-[1.7rem] font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            선생님들이 직접 만들어갑니다.
          </h2>
        </motion.div>

        {/* 어두운 골목 무대 — 램프 + 카드가 한 박스, 빛 닿는 곳만 드러남 */}
        <motion.div
          ref={stageRef}
          onMouseMove={isMobile ? undefined : handleMove}
          onMouseEnter={isMobile ? undefined : () => setLit(true)}
          onMouseLeave={
            isMobile
              ? undefined
              : () => {
                  setLit(false);
                  setActiveIdx(null);
                }
          }
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a0d16] to-black px-4 pb-16 pt-6 sm:px-6 md:mt-16 md:pb-20"
          style={{ ["--x" as string]: `${pos.x}px`, ["--y" as string]: `${pos.y}px`, touchAction: "pan-y" }}
        >
          {/* 램프 (박스 안 상단, 커서 쪽으로 꺾임) */}
          <div className="relative z-10 mx-auto w-40 md:w-48">
            <motion.div
              animate={{ rotate: lampRot }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              style={{ transformOrigin: "top center" }}
              className="relative"
            >
              {/* 아래로 퍼지는 빛 (부채꼴 — 멀어질수록 훨씬 더 넓게, 경계선 없음) */}
              <div
                className="pointer-events-none absolute left-1/2 top-[54%] h-[46rem] w-[48rem] -translate-x-1/2 transition-opacity duration-300"
                style={{
                  background: isMobile
                    ? "conic-gradient(from 0deg at 50% 0%, transparent 0deg, transparent 132.5deg, rgba(253,224,120,0.20) 164deg, rgba(255,235,160,0.38) 180deg, rgba(253,224,120,0.20) 196deg, transparent 227.5deg, transparent 360deg)"
                    : "conic-gradient(from 0deg at 50% 0%, transparent 0deg, transparent 137.5deg, rgba(253,224,120,0.20) 166deg, rgba(255,235,160,0.38) 180deg, rgba(253,224,120,0.20) 194deg, transparent 222.5deg, transparent 360deg)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 96% 96% at 50% 0%, #000 3%, rgba(0,0,0,0.42) 48%, transparent 94%)",
                  maskImage:
                    "radial-gradient(ellipse 96% 96% at 50% 0%, #000 3%, rgba(0,0,0,0.42) 48%, transparent 94%)",
                  filter: "blur(18px)",
                  opacity: lit ? 0.9 : 0.08,
                }}
              />
              {/* 전구 광원 글로우 */}
              <div
                className="pointer-events-none absolute left-1/2 top-[56%] h-24 w-24 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle, rgba(253,224,120,0.95), rgba(251,191,36,0.3) 45%, transparent 70%)",
                  opacity: lit ? 1 : 0.6,
                }}
              />
              <Image
                src="/image/right.png"
                alt="무대를 비추는 조명"
                width={540}
                height={720}
                className="relative h-auto w-full drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* 카드 — 기본은 어둠, 빛이 닿는(활성) 카드만 드러남 */}
          <div className="relative z-10 mt-6 grid grid-cols-3 gap-2 sm:gap-6 md:mt-8 md:gap-8">
            {values.map((v, i) => {
              const on = lit && activeIdx === i;
              return (
                <div
                  key={v.title}
                  onClick={() => {
                    if (isMobile) {
                      setActiveIdx(i);
                      setLit(true);
                    }
                  }}
                  className={`text-center transition-all duration-500 ${
                    on ? "scale-[1.04] opacity-100" : "opacity-100 md:opacity-[0.12]"
                  }`}
                >
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 sm:h-16 sm:w-16 md:h-20 md:w-20 ${
                      on
                        ? "border-amber-300/60 text-white shadow-[0_0_24px_rgba(253,224,120,0.35)]"
                        : "border-amber-200/40 text-white md:border-white/20 md:text-white/80"
                    }`}
                  >
                    {v.icon === "gauge" && <GaugeIcon />}
                    {v.icon === "check" && <CheckIcon />}
                    {v.icon === "sliders" && <SlidersIcon />}
                  </div>
                  <h3 className="mt-3 text-xs font-bold tracking-tight text-white sm:mt-5 sm:text-base md:mt-7 md:text-lg">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 whitespace-pre-line text-[10px] leading-relaxed text-white/75 sm:mt-2 sm:text-sm md:mt-3 md:text-[15px]">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10">
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
    <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10">
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
    <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10">
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
