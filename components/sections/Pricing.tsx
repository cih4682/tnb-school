"use client";

import { motion } from "framer-motion";

const benefits = [
  "현재 등록된 모든 앱 평생 사용",
  "신규 추가되는 앱 자동 포함",
  "커스텀 앱 제작 우선 신청권",
  "선생님 전용 커뮤니티 초대",
  "월 1회 신규 앱 라이브 데모",
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">Pricing</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">입학 안내</h2>
          <p className="mt-3 text-white/50">한 번의 입학금으로 평생 동행합니다</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-16 max-w-md"
        >
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-10 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">평생 회원</p>
            <h3 className="mt-2 text-xl font-bold text-white">티처버프 정회원</h3>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tight text-white">₩99,000</span>
              <span className="text-white/40">/ 1회</span>
            </div>
            <p className="mt-2 text-xs text-white/30">
              * 가격은 추후 변경될 수 있습니다.
            </p>

            <div className="my-8 h-px bg-white/10" />

            <ul className="space-y-4">
              {benefits.map((b, idx) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <svg className="h-4 w-4 shrink-0 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span className="text-white/70">{b}</span>
                </motion.li>
              ))}
            </ul>

            <a
              href="#custom"
              className="mt-8 block w-full rounded-full bg-white py-3.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-white/90"
            >
              지금 입학하기
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
