"use client";

import { motion } from "framer-motion";

export function AiCourse() {
  return (
    <section className="bg-white py-20 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* 좌: 텍스트 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              AI Course
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.3] tracking-tight md:text-4xl">
              학교에서 필요한
              <br />
              인공지능 뽀개기
            </h2>
            <p className="mt-6 leading-relaxed text-slate-500">
              선생님을 위한 실전 AI 활용 강의.
              <br />
              수업 준비, 평가, 업무 자동화까지 —
              <br />
              학교 현장에 바로 쓸 수 있는 인공지능 활용법을 알려드립니다.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 px-5 py-2.5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              </span>
              <span className="text-sm font-medium text-slate-600">현재 준비 중입니다</span>
            </motion.div>

            <p className="mt-4 text-xs text-slate-400">
              오픈 시 정회원에게 가장 먼저 안내드립니다.
            </p>
          </motion.div>

          {/* 우: 커리큘럼 미리보기 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              커리큘럼 (예정)
            </p>

            <div className="mt-6 space-y-4">
              {[
                { num: "01", title: "AI가 뭔지 5분 안에 이해하기" },
                { num: "02", title: "ChatGPT로 수업 자료 만들기" },
                { num: "03", title: "AI로 평가 문항 자동 생성하기" },
                { num: "04", title: "생기부 작성에 AI 활용하기" },
                { num: "05", title: "학교 업무 자동화 실전 팁" },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <span className="text-sm font-bold text-slate-300">{item.num}</span>
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              총 5개 챕터 · 상세 커리큘럼 준비 중
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
