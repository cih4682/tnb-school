"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <>
      {/* CTA 배너 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 py-20">
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse rounded-full bg-white"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold text-white md:text-5xl"
          >
            지금 입학하고,
            <br />
            선생님의 하루를 바꾸세요.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-brand-700 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              입학하기 →
            </a>
          </motion.div>
        </div>
      </section>

      {/* 미니멀 푸터 */}
      <footer className="bg-slate-950 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/40 md:flex-row">
          <p className="font-bold text-white/60">T&B School</p>
          <p>문의: hello@tnb.school</p>
          <p>© {new Date().getFullYear()} T&B School. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
