"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  { name: "김민지 선생님", role: "초등학교 4학년 담임", quote: "수업 플래너랑 워크시트 생성기 덕분에\n매주 야근이 사라졌어요." },
  { name: "박준호 선생님", role: "중학교 수학", quote: "퀴즈 메이커로 단원평가 만드는 시간이\n30분에서 5분으로 줄었어요." },
  { name: "이서연 선생님", role: "고등학교 국어", quote: "생기부 도우미가 정말 똑똑해요.\n관찰 기록만 넣으면 자연스러운 문장이 나와요." },
  { name: "정하늘 선생님", role: "초등학교 1학년 담임", quote: "자리 배치도 앱은\n학기 초의 구원자였어요." },
];

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="border-y border-slate-100 bg-white py-36">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Testimonials</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">선생님들의 이야기</h2>
        </motion.div>

        <div className="mt-16 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <p className="whitespace-pre-line text-2xl font-medium leading-relaxed text-slate-800 md:text-3xl">
                "{testimonials[i].quote}"
              </p>
              <div className="mt-8">
                <p className="font-semibold">{testimonials[i].name}</p>
                <p className="text-sm text-slate-400">{testimonials[i].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-slate-900" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
