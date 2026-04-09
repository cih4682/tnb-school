"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

const phrases = [
  "출석체크 중",
  "워크시트 제작 중",
  "퀴즈 만드는 중",
  "자리 배치 중",
  "생기부 작성 중",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
    >
      {/* 배경 글로우 */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand-600/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-pink-600/15 blur-[140px]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-12 px-6 py-32 md:grid-cols-2">
        {/* 좌: 카피 */}
        <div className="text-white">
          <TypingBadge />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl"
          >
            <span className="block leading-[1.3]">선생님의 하루에서</span>
            <span className="block bg-gradient-to-r from-indigo-300 via-pink-300 to-amber-200 bg-clip-text leading-[1.3] text-transparent">
              사라진 30분을 되찾으세요.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 max-w-md text-sm leading-[1.9] text-white/80 sm:text-base md:mt-8 md:text-lg"
          >
            반복되는 행정업무와 자료만들기는
            <br />
            T&B School이 맡겠습니다.
            <br />
            선생님은 가장 중요한 일에 집중하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="#apps">앱 둘러보기 →</Button>
            <Button href="#pricing" variant="secondary">
              입학 안내 보기
            </Button>
          </motion.div>
        </div>

        {/* 우: 거꾸로 도는 시계 */}
        <ReverseClock />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
}

function ReverseClock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto aspect-square w-full max-w-[240px] md:max-w-xs lg:max-w-md"
    >
      {/* 외곽 글로우 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/30 to-pink-500/20 blur-3xl" />

      {/* 시계 본체 */}
      <div className="relative h-full w-full rounded-full border border-white/20 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-2xl backdrop-blur-sm">
        {/* 12개 마커 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const isMain = i % 3 === 0;
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div
                className={`absolute left-1/2 top-3 -translate-x-1/2 rounded-full ${
                  isMain ? "h-3 w-1 bg-white/70" : "h-1.5 w-0.5 bg-white/30"
                }`}
              />
            </div>
          );
        })}

        {/* 시침 — 거꾸로 도는 (전체 12s, reverse) */}
        <motion.div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: "4px",
            height: "30%",
            marginLeft: "-2px",
            marginTop: "-30%",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-full rounded-full bg-gradient-to-t from-white to-brand-200 shadow-lg shadow-brand-500/50" />
        </motion.div>

        {/* 분침 */}
        <motion.div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: "3px",
            height: "40%",
            marginLeft: "-1.5px",
            marginTop: "-40%",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-full rounded-full bg-gradient-to-t from-white/80 to-pink-200 shadow-lg shadow-pink-500/40" />
        </motion.div>

        {/* 초침 */}
        <motion.div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: "2px",
            height: "44%",
            marginLeft: "-1px",
            marginTop: "-44%",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-full rounded-full bg-amber-300 shadow-lg shadow-amber-400/60" />
        </motion.div>

        {/* 중심점 */}
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg shadow-white/50" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600" />
      </div>

    </motion.div>
  );
}

function TypingBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-md"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-white/70">이 순간에도 선생님은</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="font-semibold text-white"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
