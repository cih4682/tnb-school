"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { key: "name", bot: "안녕하세요! 커스텀 앱 제작을 도와드릴게요.\n선생님 성함이 어떻게 되세요?", placeholder: "이름 입력", type: "text" },
  { key: "email", bot: "반갑습니다! 연락 가능한 이메일을 알려주세요.", placeholder: "이메일 입력", type: "email" },
  { key: "request", bot: "어떤 앱이 필요하신가요? 자유롭게 설명해 주세요.", placeholder: "원하는 앱 설명", type: "textarea" },
];

interface Message { from: "bot" | "user"; text: string }

export function CustomForm() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: steps[0].bot }]);
  const [done, setDone] = useState(false);

  function handleSend() {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user" as const, text: input }];
    if (step < steps.length - 1) {
      const next = step + 1;
      newMessages.push({ from: "bot", text: steps[next].bot });
      setMessages(newMessages);
      setStep(next);
    } else {
      newMessages.push({ from: "bot", text: "신청이 접수되었습니다!\n검토 후 3일 이내로 이메일 드릴게요." });
      setMessages(newMessages);
      setDone(true);
    }
    setInput("");
  }

  return (
    <section id="custom" className="border-y border-slate-100 bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Custom App</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">커스텀 앱 제작</h2>
          <p className="mt-3 text-slate-500">원하는 앱이 없나요? 대화로 간편하게 신청하세요.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="mx-auto mt-12 max-w-lg overflow-hidden rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold text-slate-600">T&B 앱 제작 어시스턴트</p>
          </div>

          <div className="flex h-[380px] flex-col gap-3 overflow-y-auto bg-slate-50 p-5">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${msg.from === "user" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md bg-white text-slate-800 shadow-sm"}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!done && (
            <div className="border-t border-slate-100 bg-white p-4">
              <div className="flex gap-2">
                {steps[step].type === "textarea" ? (
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={steps[step].placeholder} rows={2} className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400" />
                ) : (
                  <input type={steps[step].type} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={steps[step].placeholder} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400" />
                )}
                <button onClick={handleSend} disabled={!input.trim()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm text-white transition hover:bg-slate-800 disabled:opacity-20">↑</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
