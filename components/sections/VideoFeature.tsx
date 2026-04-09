"use client";

import { motion } from "framer-motion";

export function VideoFeature() {
  return (
    <section className="border-y border-slate-100 bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* 영상 */}
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-slate-200"
          >
            <video
              src="/school.mp4"
              autoPlay muted loop playsInline preload="metadata"
              className="aspect-video w-full object-cover"
            />
          </motion.div>

          {/* 텍스트 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Our Story</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.3] tracking-tight md:text-4xl">
              선생님의 시간을 돌려드리는 일
            </h2>
            <p className="mt-6 leading-relaxed text-slate-500">
              매일 반복되는 행정 업무, 자료 만들기, 평가 정리… 정작 가장 중요한
              아이들과 마주하는 시간이 줄어들고 있습니다.
            </p>
            <p className="mt-4 leading-relaxed text-slate-500">
              T&B School은 그 시간을 되돌려 드리기 위해 시작됐어요.
              앱 하나하나는 작지만, 100개가 모이면 선생님의 일주일이 달라집니다.
            </p>
            <blockquote className="mt-8 border-l-2 border-slate-900 pl-4 text-sm italic text-slate-600">
              "기술은 선생님을 대체하는 게 아니라,
              선생님이 더 선생님다워지도록 돕는 것."
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
