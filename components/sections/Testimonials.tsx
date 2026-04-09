"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "김민지 선생님",
    role: "초등학교 4학년 담임",
    avatar: "👩‍🏫",
    quote:
      "수업 플래너랑 워크시트 생성기 덕분에 매주 야근이 사라졌어요. 진짜 신세계입니다.",
    stars: 5,
  },
  {
    name: "박준호 선생님",
    role: "중학교 수학",
    avatar: "👨‍🏫",
    quote:
      "퀴즈 메이커로 단원평가 만드는 시간이 30분에서 5분으로 줄었어요. 학생들 반응도 좋아요.",
    stars: 5,
  },
  {
    name: "이서연 선생님",
    role: "고등학교 국어",
    avatar: "🧑‍🏫",
    quote:
      "생기부 도우미가 정말 똑똑해요. 관찰 기록만 넣으면 자연스러운 문장이 나와서 놀랐습니다.",
    stars: 5,
  },
  {
    name: "정하늘 선생님",
    role: "초등학교 1학년 담임",
    avatar: "👩‍🎓",
    quote:
      "자리 배치도 앱은 학기 초의 구원자였어요. 조건 걸어서 자동 배치되니까 너무 편해요.",
    stars: 5,
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setI((p) => (p + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-brand-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
            Testimonials
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
            선생님들의 이야기
          </h2>
        </motion.div>

        {/* 3D 캐러셀 */}
        <div className="relative mt-16 flex items-center justify-center" style={{ perspective: "1000px" }}>
          <div className="relative h-[320px] w-full max-w-3xl">
            {testimonials.map((t, idx) => {
              const offset = idx - i;
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;

              return (
                <motion.div
                  key={idx}
                  animate={{
                    x: `${offset * 60}%`,
                    scale: isCenter ? 1 : 0.85,
                    z: isCenter ? 0 : -100,
                    opacity: absOffset > 1 ? 0 : isCenter ? 1 : 0.5,
                    rotateY: offset * -8,
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setI(idx)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={`h-full rounded-3xl border p-8 transition md:p-10 ${
                      isCenter
                        ? "border-white/20 bg-white/[0.08] shadow-2xl shadow-brand-600/10 backdrop-blur-md"
                        : "border-white/5 bg-white/[0.03]"
                    }`}
                  >
                    {/* 별점 */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isCenter ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 0.3 + s * 0.1 }}
                          className="text-lg text-amber-400"
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>
                    <p className="mt-5 text-lg leading-relaxed text-white/90 md:text-xl">
                      "{t.quote}"
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white">{t.name}</p>
                        <p className="text-sm text-white/50">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 인디케이터 */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-8 bg-brand-500" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
