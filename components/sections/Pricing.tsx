"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "BASIC",
    price: "₩27,900",
    unit: "/ 월",
    desc: "처음이라면 부담 없이",
    badge: null,
    benefits: [
      "원하는 앱 3개 선택 사용",
      "앱 미리보기",
      "커뮤니티 읽기 · 댓글",
      "언제든 해지 / 업그레이드",
      "월 자동 결제",
    ],
    cta: "시작하기",
    featured: false,
  },
  {
    name: "PRO",
    price: "₩99,000",
    unit: "/ 학기 (6개월)",
    desc: "가장 인기 있는 플랜",
    badge: "추천",
    benefits: [
      "모든 앱 사용",
      "신규 추가되는 앱 자동 포함",
      "커스텀 앱 제작 우선 신청권",
      "선생님 전용 커뮤니티 초대",
      "월 1회 신규 앱 라이브 데모",
      "베타 앱 우선 체험",
    ],
    cta: "지금 입학하기",
    featured: true,
  },
  {
    name: "TEAM",
    price: "단체 문의",
    unit: "",
    desc: "학교 · 단체 전용",
    badge: null,
    benefits: [
      "정회원 혜택 전부 포함",
      "10명 이상 · 10% 할인",
      "30명 이상 · 20% 할인",
      "50명 이상 · 30% 할인",
      "1회 인공지능 연수 제공",
    ],
    cta: "상담 문의",
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
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">입학 안내</h2>
          <p className="mt-3 text-white/50">선생님의 상황에 맞는 플랜을 선택하세요</p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ scale: 1.04, y: -8 }}
              id={plan.featured ? "pro-plan" : undefined}
              style={plan.featured ? { scrollMarginTop: '80px' } : undefined}
              className={`relative cursor-pointer rounded-2xl p-8 transition-shadow ${
                plan.featured
                  ? "border-shimmer pulse-glow bg-white/[0.08] backdrop-blur-sm"
                  : "border border-white/10 bg-white/[0.04] hover:border-white/25 hover:shadow-2xl hover:shadow-black/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-extrabold tracking-[0.15em] text-indigo-400">
                  {plan.name}
                </p>
                {plan.badge && (
                  <span className="text-shimmer text-base font-extrabold tracking-wide">
                    ⭐ {plan.badge}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  {plan.price}
                </span>
                {plan.unit && <span className="text-sm text-white/40">{plan.unit}</span>}
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
                    className="flex items-start gap-3 text-sm"
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span className={`leading-relaxed ${b === "모든 앱 사용" ? "font-extrabold text-white" : "text-white/70"}`}>{b}</span>
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

        {/* 가성비 임팩트 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-10 max-w-2xl rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.08] px-6 py-4 text-center backdrop-blur-sm"
        >
          <p className="text-sm text-white/80">
            베이직 1학기 = <span className="font-bold text-white">₩167,400</span>
            <span className="hidden md:inline"> · </span>
            <br className="md:hidden" />
            정회원 1학기 = <span className="font-bold text-white">₩99,000</span>
          </p>
          <p className="mt-1 text-xs text-indigo-300">
            정회원이 <span className="font-bold">₩68,400 더 저렴</span>하면서 모든 앱을 사용할 수 있어요
          </p>
        </motion.div>

      </div>
    </section>
  );
}
