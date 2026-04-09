"use client";

import { motion } from "framer-motion";

export function VideoFeature() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* 좌: 영상 (커튼 효과) */}
          <motion.div
            initial={{ clipPath: "inset(0 50% 0 50%)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-500 to-pink-500 opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <video
                src="/school.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-video w-full object-cover"
              />
            </div>
          </motion.div>

          {/* 우: 텍스트 + 형광펜 효과 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-10 bg-brand-600" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
                Our Story
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 text-3xl font-extrabold leading-[1.3] tracking-tight md:text-4xl"
            >
              선생님의 시간을{" "}
              <span className="relative inline-block">
                <Highlight delay={0.8} />
                <span className="relative z-10">돌려드리는 일</span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg leading-relaxed text-slate-600"
            >
              매일 반복되는 행정 업무, 자료 만들기, 평가 정리…
              정작 가장 중요한{" "}
              <span className="relative inline-block">
                <Highlight delay={1.2} color="bg-amber-200/70" />
                <span className="relative z-10 font-semibold text-slate-900">
                  아이들과 마주하는 시간
                </span>
              </span>
              이 줄어들고 있습니다.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 leading-relaxed text-slate-600"
            >
              T&B School은 그 시간을 되돌려 드리기 위해 시작됐어요.
              앱 하나하나는 작지만, 100개가 모이면 선생님의 일주일이 달라집니다.
            </motion.p>

            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 border-l-4 border-brand-600 pl-5 italic text-slate-700"
            >
              "기술은 선생님을 대체하는 게 아니라,
              <br />
              선생님이 더 선생님다워지도록 돕는 것."
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlight({
  delay = 0,
  color = "bg-brand-200/60",
}: {
  delay?: number;
  color?: string;
}) {
  return (
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute inset-0 origin-left ${color} rounded-sm`}
    />
  );
}
