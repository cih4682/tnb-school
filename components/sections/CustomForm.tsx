"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { key: "name", bot: "안녕하세요! 커스텀 앱 제작을 도와드릴게요. 😊\n선생님 성함이 어떻게 되세요?", placeholder: "이름 입력", type: "text" },
  { key: "email", bot: "반갑습니다! 연락 가능한 이메일을 알려주세요.", placeholder: "이메일 입력", type: "email" },
  { key: "request", bot: "어떤 앱이 필요하신가요? 자유롭게 설명해 주세요.\n(예: 학생 독서 기록 시각화 앱)", placeholder: "원하는 앱 설명", type: "textarea" },
];

interface Message {
  from: "bot" | "user";
  text: string;
}

export function CustomForm() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: steps[0].bot },
  ]);
  const [done, setDone] = useState(false);

  function handleSend() {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user" as const, text: input }];

    if (step < steps.length - 1) {
      const nextStep = step + 1;
      newMessages.push({ from: "bot", text: steps[nextStep].bot });
      setMessages(newMessages);
      setStep(nextStep);
    } else {
      newMessages.push({
        from: "bot",
        text: "신청이 접수되었습니다! 🎉\n검토 후 3일 이내로 이메일 드릴게요. 감사합니다!",
      });
      setMessages(newMessages);
      setDone(true);
    }
    setInput("");
  }

  return (
    <section id="custom" className="relative bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">
            Custom App
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-5xl">
            커스텀 앱 제작
          </h2>
          <p className="mt-4 text-slate-500">
            원하는 앱이 없나요? 대화로 간편하게 신청하세요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-12 max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-xl"
        >
          {/* 헤더 */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm text-white">
              💬
            </div>
            <div>
              <p className="text-sm font-bold">T&B 앱 제작 어시스턴트</p>
              <p className="text-xs text-emerald-500">● 온라인</p>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex h-[400px] flex-col gap-3 overflow-y-auto p-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                      msg.from === "user"
                        ? "rounded-br-md bg-brand-600 text-white"
                        : "rounded-bl-md bg-white text-slate-800 shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 입력 영역 */}
          {!done && (
            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex gap-2">
                {steps[step].type === "textarea" ? (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={steps[step].placeholder}
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                ) : (
                  <input
                    type={steps[step].type}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={steps[step].placeholder}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                )}
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:opacity-30"
                >
                  ↑
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
