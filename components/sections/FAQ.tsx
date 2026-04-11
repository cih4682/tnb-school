"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "어떤 플랜을 선택해야 하나요?",
    a: "처음이라면 원하는 앱 3개를 사용할 수 있는 BASIC(월 ₩27,900)으로 부담 없이 시작하시고, 모든 앱을 사용하고 싶다면 PRO(학기 ₩99,000)를 추천드립니다. 학교 단체로 등록하실 경우 TEAM 플랜으로 단체 할인을 받을 수 있어요."
  },
  {
    q: "PRO와 BASIC 중 무엇이 더 저렴한가요?",
    a: "BASIC을 6개월 사용하면 ₩167,400이지만, PRO 1학기는 ₩99,000입니다. PRO가 ₩68,400 더 저렴하면서 모든 앱을 사용할 수 있어요."
  },
  {
    q: "신규 앱이 추가되면 따로 비용이 드나요?",
    a: "아니요. PRO 회원이라면 학기 중 새로 추가되는 앱도 자동으로 무료 사용하실 수 있습니다."
  },
  {
    q: "커스텀 앱 제작은 누구나 신청할 수 있나요?",
    a: "PRO 회원이라면 우선 신청권이 주어집니다. 일반 신청도 가능하지만 대기열이 있을 수 있어요."
  },
  {
    q: "초·중·고 어느 단계 선생님께 적합한가요?",
    a: "전 학교급 선생님 모두를 위해 설계되었습니다. 앱별로 학년에 맞게 설정할 수 있어요."
  },
  {
    q: "환불이 가능한가요?",
    a: "결제 후 7일 이내, 앱 사용 이력이 없다면 전액 환불 가능합니다."
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">FAQ</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">자주 묻는 질문</h2>
        </motion.div>

        <div className="mt-14 divide-y divide-slate-100">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="text-sm font-semibold">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-slate-400">+</motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                      <p className="pb-5 text-sm leading-relaxed text-slate-500">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
