"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const plans = [
  {
    name: "INDIVIDUAL",
    price: "10,000원~",
    unit: "/ 월,상시",
    desc: "혼자서도 큰 힘이 됩니다",
    badge: null,
    benefits: [
      "후원자 명단에 이름 등재",
      "새 앱 소식 가장 먼저 받기",
      "후원자 전용 커뮤니티 초대",
      "원하는 앱 기능 제안하기",
      "기부금영수증 발급 · 소득공제 (준비 중)",
      "후원자 전용 뱃지",
    ],
    cta: "개인으로 후원하기",
    featured: false,
  },
  {
    name: "CORPORATE",
    price: "후원문의",
    unit: "",
    desc: "기업 맞춤",
    badge: "추천",
    benefits: [
      "개인 후원 혜택 전부 포함",
      "기업 로고 홈페이지 노출",
      "CSR · ESG 사회공헌 실적 활용",
      "감사패 · 후원 인증서 제공",
      "협회 대회 현장 부스 운영",
      "분기별 후원 사용 리포트",
    ],
    cta: "기업으로 후원하기",
    featured: true,
  },
  {
    name: "CUSTOM",
    price: "제작 문의",
    unit: "",
    desc: "원하는 앱을 맞춤 제작해 보세요.",
    badge: null,
    benefits: [
      "원하는 교사 앱 맞춤 제작",
      "기능 · 디자인 1:1 상담",
      "제작 범위 · 일정 안내",
      "완성 후 유지 · 업데이트 지원",
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">Support</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">후원 안내</h2>
          <p className="mt-3 text-white/50">선생님을 위한 도구, 여러분의 후원으로 함께 만들어가요</p>
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
              className={`relative flex cursor-pointer flex-col rounded-2xl p-8 transition-shadow ${
                plan.featured
                  ? "border-shimmer pulse-glow bg-white/[0.08] backdrop-blur-sm"
                  : "border border-white/10 bg-white/[0.04] hover:border-white/25 hover:shadow-2xl hover:shadow-black/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-extrabold tracking-[0.15em] text-indigo-400">
                  {plan.name}
                </p>
              </div>
              {plan.badge && (
                <>
                  <Image
                    src="/tnb.png"
                    alt="후원 뱃지"
                    width={72}
                    height={72}
                    className="absolute right-3 top-3 h-16 w-16 rotate-6 drop-shadow-lg"
                  />
                  <span className="pointer-events-none absolute right-[6rem] top-6 -rotate-6 whitespace-nowrap font-hand text-xl leading-none text-amber-300">
                    후원뱃지
                  </span>
                  <svg
                    className="pointer-events-none absolute right-[4.6rem] top-[2.2rem] h-5 w-6 text-amber-300"
                    viewBox="0 0 24 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 13 C 8 12, 13 8, 20 4" />
                    <path d="M14 3 L 21 3.5 L 19 9" />
                  </svg>
                </>
              )}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  {plan.price}
                </span>
                {plan.unit && <span className="text-sm text-white/40">{plan.unit}</span>}
              </div>
              <p className="mt-2 text-xs text-white/40">{plan.desc}</p>

              <div className="my-6 h-px bg-white/10" />

              <ul className="flex-1 space-y-3">
                {plan.benefits.map((b, idx) => {
                  const soon = b.includes("(준비 중)");
                  const label = b.replace(" (준비 중)", "");
                  return (
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
                    <span className={`leading-relaxed ${label === "개인 후원 혜택 전부 포함" ? "font-extrabold text-white" : "text-white/70"}`}>
                      {label}
                    </span>
                    {soon && (
                      <span className="ml-auto shrink-0 rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
                        준비중
                      </span>
                    )}
                  </motion.li>
                  );
                })}
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
            티처버프는 <span className="font-bold text-white">'SJNF'</span>의 인공지능 활용팀입니다.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-indigo-300">
            여러분의 후원은 스포츠 대회 추진 · 생활체육 활성화 · 새로운 교사 앱 제작 · 장학재단 지원에 함께 쓰입니다.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
