"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  { name: "최OO 선생님", role: "고등학교 체육", quote: "많은 걸 약속드리진 못합니다.\n그저 선생님의 하루에 작은 여유가 생기길 바랍니다." },
];

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="border-y border-slate-100 bg-white py-20 md:py-36">
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
              <p className="whitespace-pre-line text-lg font-medium leading-relaxed text-slate-800 sm:text-2xl md:text-3xl">
                "{testimonials[i].quote}"
              </p>
              <div className="mt-8">
                <p className="font-semibold">{testimonials[i].name}</p>
                <p className="text-sm text-slate-400">{testimonials[i].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
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
        )}
      </div>
    </section>
  );
}
