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
    <section
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-28"
    >
      {/* 배경 블롭 */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-brand-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-pink-600/15 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
            티처버프 입학 안내
          </h2>
          <p className="mt-4 text-white/50">한 번의 입학금으로 평생 동행합니다</p>
        </motion.div>

        {/* 글래스 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-16 max-w-lg"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.06] p-10 shadow-2xl backdrop-blur-md md:p-12">
            {/* 코너 뱃지 */}
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-brand-600 to-pink-500 px-5 py-2 text-sm font-bold text-white">
              평생 회원
            </div>

            <h3 className="text-2xl font-extrabold text-white">티처버프 정회원</h3>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-6xl font-extrabold text-transparent">
                ₩99,000
              </span>
              <span className="text-white/40">/ 1회</span>
            </div>
            <p className="mt-2 text-sm text-white/40">
              * 가격은 임시 표시이며, 추후 변경될 수 있습니다.
            </p>

            <ul className="mt-10 space-y-4">
              {benefits.map((b, idx) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/30 text-xs text-brand-300">
                    ✓
                  </span>
                  <span className="text-white/80">{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <a
                href="#custom"
                className="shimmer-btn group relative block w-full overflow-hidden rounded-full bg-gradient-to-r from-brand-600 to-pink-500 px-6 py-4 text-center font-semibold text-white shadow-xl shadow-brand-600/30 transition hover:shadow-2xl hover:shadow-brand-600/40"
              >
                <span className="relative z-10">지금 입학하기</span>
                <div className="shimmer" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
