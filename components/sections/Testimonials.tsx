"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../ui/Section";

const testimonials = [
  {
    name: "김민지 선생님",
    role: "초등학교 4학년 담임",
    avatar: "👩‍🏫",
    quote:
      "수업 플래너랑 워크시트 생성기 덕분에 매주 야근이 사라졌어요. 진짜 신세계입니다.",
  },
  {
    name: "박준호 선생님",
    role: "중학교 수학",
    avatar: "👨‍🏫",
    quote:
      "퀴즈 메이커로 단원평가 만드는 시간이 30분에서 5분으로 줄었어요. 학생들 반응도 좋아요.",
  },
  {
    name: "이서연 선생님",
    role: "고등학교 국어",
    avatar: "🧑‍🏫",
    quote:
      "생기부 도우미가 정말 똑똑해요. 관찰 기록만 넣으면 자연스러운 문장이 나와서 놀랐습니다.",
  },
  {
    name: "정하늘 선생님",
    role: "초등학교 1학년 담임",
    avatar: "👩‍🎓",
    quote:
      "자리 배치도 앱은 학기 초의 구원자였어요. 조건 걸어서 자동 배치되니까 너무 편해요.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[i];

  return (
    <Section className="!py-24">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold md:text-4xl"
        >
          이미 많은 선생님이 함께하고 있어요
        </motion.h2>
        <p className="mt-3 text-slate-600">실제 사용 중인 선생님들의 후기</p>
      </div>

      <div className="relative mx-auto mt-12 max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-xl md:p-14">
          <div className="absolute -left-4 -top-4 text-8xl text-brand-100 select-none">
            “
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <p className="text-lg leading-relaxed text-slate-800 md:text-xl">
                {t.quote}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-8 bg-brand-600" : "w-2 bg-slate-300"
              }`}
              aria-label={`후기 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
