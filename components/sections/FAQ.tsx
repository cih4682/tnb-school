"use client";

import { useState } from "react";
import { Section } from "../ui/Section";

const faqs = [
  {
    q: "입학금은 한 번만 내면 되나요?",
    a: "네, 평생 회원으로 한 번만 결제하시면 모든 앱을 추가 비용 없이 사용하실 수 있어요.",
  },
  {
    q: "신규 앱이 추가되면 따로 비용이 드나요?",
    a: "아니요. 100개 목표까지 추가되는 모든 앱은 정회원에게 자동으로 무료 제공됩니다.",
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

  return (
    <Section id="faq">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">자주 묻는 질문</h2>
      </div>
      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition hover:bg-slate-50"
              >
                <span>{f.q}</span>
                <span
                  className={`text-brand-600 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 px-6 py-5 text-slate-600">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
