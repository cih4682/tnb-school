"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <>
      {/* CTA */}
      <section className="border-t border-slate-100 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-2xl font-extrabold leading-relaxed tracking-tight sm:text-3xl md:text-5xl"
          >
            아이들과의 시간,
            <br />
            되찾을 준비 되셨나요?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10"
          >
            <a
              href="#pro-plan"
              className="relative inline-block rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-slate-700 opacity-30" style={{ animationDuration: "2.5s" }} />
              <span className="relative">입학하기 →</span>
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-slate-400 md:flex-row">
          <p className="font-semibold text-slate-600">T&B School</p>
          <p>문의: hello@tnb.school</p>
          <p>© {new Date().getFullYear()} T&B School. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
