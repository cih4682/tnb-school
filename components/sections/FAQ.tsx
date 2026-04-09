"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "입학금은 한 번만 내면 되나요?",
    a: "네, 평생 회원으로 한 번만 결제하시면 모든 앱을 추가 비용 없이 사용하실 수 있어요.",
    popular: true,
  },
  {
    q: "신규 앱이 추가되면 따로 비용이 드나요?",
    a: "아니요. 100개 목표까지 추가되는 모든 앱은 정회원에게 자동으로 무료 제공됩니다.",
    popular: true,
  },
  {
    q: "커스텀 앱 제작은 누구나 신청할 수 있나요?",
    a: "정회원이라면 우선 신청권이 주어집니다. 일반 신청도 가능하지만 대기열이 있을 수 있어요.",
  },
  {
    q: "초·중·고 어느 단계 선생님께 적합한가요?",
    a: "전 학교급 선생님 모두를 위해 설계되었습니다. 앱별로 학년에 맞게 설정할 수 있어요.",
  },
  {
    q: "환불이 가능한가요?",
    a: "결제 후 7일 이내, 앱 사용 이력이 없다면 전액 환불 가능합니다.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = search
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <section id="faq" className="relative bg-slate-50 py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
            자주 묻는 질문
          </h2>
        </motion.div>

        {/* 검색창 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(null);
              }}
              placeholder="질문을 검색해 보세요..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </motion.div>

        <div className="mt-8 space-y-3">
          {filtered.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    {f.popular && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-600">
                        인기
                      </span>
                    )}
                    <span className="font-semibold">{f.q}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl text-brand-600"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-slate-100 px-6 py-5 text-slate-600">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-slate-400">
              검색 결과가 없어요. 다른 키워드로 검색해 보세요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
