"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const steps = [
  { key: "name", bot: "안녕하세요! 커스텀 앱 제작을 도와드릴게요.\n선생님 성함이 어떻게 되세요?", placeholder: "이름 입력", type: "text" },
  { key: "phone", bot: "연락 가능한 전화번호를 알려주세요.", placeholder: "전화번호 입력", type: "tel" },
  { key: "email", bot: "이메일 주소도 알려주세요.", placeholder: "이메일 입력", type: "email" },
  { key: "request", bot: "어떤 앱이 필요하신가요? 자유롭게 설명해 주세요.", placeholder: "원하는 앱 설명", type: "textarea" },
  { key: "privacy", bot: "마지막으로, 개인정보 수집·이용에 동의해 주셔야 신청이 완료됩니다.\n\n수집 항목: 이름, 전화번호, 이메일\n수집 목적: 커스텀 앱 제작 상담\n보유 기간: 상담 완료 후 1년\n\n동의하시면 '동의'를 입력해 주세요.", placeholder: "'동의' 입력", type: "text" },
];

interface Message { from: "bot" | "user"; text: string }

export function CustomForm() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: steps[0].bot }]);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", request: "" });
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user" as const, text: input }];

    // 입력값 저장
    const updatedData = { ...formData };
    if (step === 0) updatedData.name = input.trim();
    if (step === 1) updatedData.phone = input.trim();
    if (step === 2) updatedData.email = input.trim();
    if (step === 3) updatedData.request = input.trim();
    setFormData(updatedData);

    // 개인정보 동의 체크
    if (step === 4 && input.trim() !== "동의") {
      newMessages.push({ from: "bot", text: "'동의'를 정확히 입력해 주세요." });
      setMessages(newMessages);
      setInput("");
      return;
    }

    if (step < steps.length - 1) {
      const next = step + 1;
      newMessages.push({ from: "bot", text: steps[next].bot });
      setMessages(newMessages);
      setStep(next);
    } else {
      // DB 저장
      await supabase.from("app_requests").insert({
        name: updatedData.name,
        phone: updatedData.phone,
        email: updatedData.email,
        request: updatedData.request,
      });

      // 슬랙 알림
      fetch("/api/slack-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      newMessages.push({ from: "bot", text: "신청이 접수되었습니다!\n검토 후 3일 이내로 이메일 드릴게요." });
      setMessages(newMessages);
      setDone(true);
    }
    setInput("");
  }

  return (
    <section id="custom" className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">Custom App</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">커스텀 앱 제작</h2>
          <p className="mt-3 text-white/50">원하는 앱이 없나요? 대화로 간편하게 신청하세요.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="mx-auto mt-12 max-w-lg overflow-hidden rounded-2xl border border-white/15">
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold text-white/70">T&B 앱 제작 어시스턴트</p>
          </div>

          <div ref={chatRef} className="flex h-[380px] flex-col gap-3 overflow-y-auto bg-white/[0.03] p-5">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div style={{ wordBreak: "keep-all" }} className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm md:max-w-[80%] ${msg.from === "user" ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md bg-white/10 text-white/90"}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!done && (
            <div className="border-t border-white/10 bg-white/[0.04] p-4">
              <div className="flex gap-2">
                {steps[step].type === "textarea" ? (
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={steps[step].placeholder} rows={2} className="flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30" />
                ) : (
                  <input type={steps[step].type} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={steps[step].placeholder} className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30" />
                )}
                <button onClick={handleSend} disabled={!input.trim()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm text-white transition hover:bg-indigo-500 disabled:opacity-20">↑</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
