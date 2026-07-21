"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "후원은 어떻게 신청하나요?",
    a: "후원 안내에서 개인 후원·기업 후원·제작 문의 중 원하는 방식을 골라 신청하시면 됩니다. 개인 후원은 바로 시작할 수 있고, 기업 후원과 제작 문의는 상담을 통해 진행돼요."
  },
  {
    q: "후원금은 어디에 쓰이나요?",
    a: "티처버프는 'SJNF'의 인공지능 활용팀입니다. 후원금은 스포츠 대회 추진, 생활체육 활성화, 새로운 교사 앱 제작, 그리고 장학재단 지원에 함께 쓰입니다."
  },
  {
    q: "개인 후원과 기업 후원은 무엇이 다른가요?",
    a: "개인 후원은 후원자 명단 등재, 전용 커뮤니티 초대 등 개인을 위한 혜택 중심이에요. 기업 후원은 여기에 더해 홈페이지 로고 노출, CSR·ESG 실적 활용, 협회 대회 현장 부스 운영 등 기업에 맞는 혜택이 추가됩니다."
  },
  {
    q: "기부금영수증(소득공제)을 받을 수 있나요?",
    a: "현재 지정기부금단체 지정을 준비하고 있어요. 지정이 완료되면 기부금영수증을 발급해 드리고, 연말정산 소득공제도 받으실 수 있습니다. 진행 상황은 후원자분들께 따로 안내드릴게요."
  },
  {
    q: "후원은 언제든 중단할 수 있나요?",
    a: "네. 개인 정기 후원은 언제든 중단하실 수 있어요. 다음 결제일 전에 신청해 주시면 됩니다."
  },
  {
    q: "원하는 앱을 직접 제작 의뢰할 수 있나요?",
    a: "네. 제작 문의를 통해 학교·기관에 필요한 앱을 맞춤 제작해 드려요. 기능·디자인 상담부터 완성 후 유지·업데이트까지 함께 진행합니다."
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
