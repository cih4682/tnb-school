"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "체험반",
    price: "무료",
    unit: "",
    desc: "T&B School을 먼저 경험해 보세요",
    badge: null,
    benefits: [
      "기본 앱 3개 사용",
      "앱 미리보기",
      "커뮤니티 읽기 전용",
    ],
    cta: "체험 시작하기",
    featured: false,
  },
  {
    name: "정회원",
    price: "₩99,000",
    unit: "/ 1회",
    desc: "가장 인기 있는 플랜",
    badge: "인기",
    benefits: [
      "현재 등록된 모든 앱 평생 사용",
      "신규 추가되는 앱 자동 포함",
      "커스텀 앱 제작 우선 신청권",
      "선생님 전용 커뮤니티 초대",
      "월 1회 신규 앱 라이브 데모",
    ],
    cta: "지금 입학하기",
    featured: true,
  },
  {
    name: "프리미엄",
    price: "₩199,000",
    unit: "/ 1회",
    desc: "최우선 지원과 전용 혜택",
    badge: null,
    benefits: [
      "정회원 혜택 전부 포함",
      "커스텀 앱 제작 무료 1회",
      "1:1 온보딩 세션",
      "신규 앱 베타 테스트 참여",
      "전용 고객 지원 채널",
    ],
    cta: "프리미엄 입학하기",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-20 md:py-36">
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

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? "border-2 border-indigo-500/50 bg-white/[0.08] shadow-2xl shadow-indigo-500/10 backdrop-blur-sm md:-mt-4 md:mb-[-16px] md:py-10"
                  : "border border-white/10 bg-white/[0.04]"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white">
                  {plan.badge}
                </span>
              )}

              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {plan.name}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`font-extrabold tracking-tight text-white ${
                  plan.featured ? "text-4xl" : "text-3xl"
                }`}>
                  {plan.price}
                </span>
                {plan.unit && <span className="text-white/40">{plan.unit}</span>}
              </div>
              <p className="mt-2 text-xs text-white/40">{plan.desc}</p>

              <div className="my-6 h-px bg-white/10" />

              <ul className="space-y-3">
                {plan.benefits.map((b, idx) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 + idx * 0.06 }}
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
                className={`mt-8 block w-full rounded-full py-3.5 text-center text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-white text-slate-900 hover:bg-white/90"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-white/30">
          * 가격은 임시 표시이며, 추후 변경될 수 있습니다.
        </p>
      </div>
    </section>
  );
}
