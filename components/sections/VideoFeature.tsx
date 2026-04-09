"use client";

import { motion } from "framer-motion";

export function VideoFeature() {
  return (
    <section className="relative overflow-hidden border-y border-slate-100 bg-white py-36">
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
            <div className="overflow-hidden rounded-2xl border border-slate-200">
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
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-px w-10 origin-left bg-slate-900"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
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
              <br />
              앱 하나하나 선생님의 입장을 생각하며 만들었습니다.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 flex gap-5"
            >
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="w-0.5 origin-top bg-slate-900"
              />
              <blockquote className="text-sm italic text-slate-500">
                "기술은 선생님을 대체하는 게 아니라,
                <br />
                선생님이 더 선생님다워지도록 돕는 것."
              </blockquote>
            </motion.div>
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
