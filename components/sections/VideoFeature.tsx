"use client";

import { motion } from "framer-motion";
import { Section } from "../ui/Section";

export function VideoFeature() {
  return (
    <Section className="!py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-brand-600" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
              Our Story
            </p>
          </div>

          <h2 className="mt-5 whitespace-nowrap text-2xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">
            선생님의 시간을{" "}
            <span className="bg-gradient-to-r from-brand-600 to-pink-500 bg-clip-text text-transparent">
              돌려드리는 일
            </span>
          </h2>

          <p className="mt-6 text-lg font-semibold leading-relaxed text-slate-800">
            매일 반복되는 행정 업무, 자료 만들기, 평가 정리…
            정작 가장 중요한 ‘아이들과 마주하는 시간’이 줄어들고 있습니다.
          </p>

          <p className="mt-4 leading-relaxed text-slate-600">
            T&B School은 그 시간을 되돌려 드리기 위해 시작됐어요. 선생님 한 분 한
            분의 하루를 관찰하고, 가장 손이 많이 가는 일부터 자동화했습니다.
            앱 하나하나는 작지만, 100개가 모이면 선생님의 일주일이 달라집니다.
          </p>

        </motion.div>
      </div>

      {/* 하단 인용구 (한 줄, 가운데) */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mt-16 whitespace-nowrap text-center text-base italic text-slate-700 md:text-xl"
      >
        <span className="mr-2 text-brand-600">“</span>
        기술은 선생님을 대체하는 게 아니라, 선생님이 더 선생님다워지도록 돕는 것.
        <span className="ml-2 text-brand-600">”</span>
      </motion.blockquote>
    </Section>
  );
}

