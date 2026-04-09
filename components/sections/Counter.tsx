"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "../ui/AppIcon";

const concerns = [
  {
    worry: "수업 준비가 막막해요",
    detail: "매번 자료 찾고, 슬라이드 만들고, 학습지 준비하는 데 시간이 다 가요.",
    app: "수업 플래너",
    appIcon: "calendar",
    solution: "주간 수업을 드래그앤드롭으로 정리. 5분이면 한 주가 세팅돼요.",
  },
  {
    worry: "생기부 마감이 무서워요",
    detail: "관찰 기록은 쌓여있는데, 문장으로 정리하려면 밤을 새야 해요.",
    app: "생기부 도우미",
    appIcon: "pen",
    solution: "관찰 기록만 입력하면 자연스러운 문장으로 변환해 줍니다.",
  },
  {
    worry: "평가 기준 만들기 어려워요",
    detail: "수행평가 루브릭을 매번 새로 만드는 게 부담이에요.",
    app: "루브릭 빌더",
    appIcon: "barChart",
    solution: "항목만 입력하면 평가 기준표 완성. 채점이 명확해져요.",
  },
  {
    worry: "학습지를 매번 직접 만들어요",
    detail: "학년·단원에 맞는 워크시트를 손수 제작하느라 퇴근이 늦어요.",
    app: "워크시트 생성기",
    appIcon: "fileText",
    solution: "학년·과목만 선택하면 맞춤 학습지가 자동 생성됩니다.",
  },
  {
    worry: "자리 배치 매번 고민이에요",
    detail: "공정하게, 조건에 맞게 배치하려면 시간이 너무 걸려요.",
    app: "자리 배치도",
    appIcon: "chair",
    solution: "조건만 설정하면 자동 배치. 공정하고 빠르게.",
  },
  {
    worry: "퀴즈 만들 시간이 없어요",
    detail: "단원평가, 쪽지시험 문제 하나하나 만드는 게 고역이에요.",
    app: "퀴즈 메이커",
    appIcon: "circleHelp",
    solution: "객관식·주관식 문제를 한 번에 자동 생성해요.",
  },
];

export function Counter() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">
            For You
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            누구에게 필요할까?
          </h2>
          <p className="mt-3 text-white/50">
            해당되는 고민을 눌러보세요
          </p>
        </motion.div>

        {/* 고민 그리드 */}
        <div className="mt-12 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {concerns.map((c, i) => {
            const isActive = active === i;
            return (
              <motion.button
                key={c.worry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onClick={() => setActive(isActive ? null : i)}
                className={`rounded-2xl border p-6 text-left transition ${
                  isActive
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <p className={`text-sm font-semibold leading-snug ${isActive ? "text-white" : "text-white/70"}`}>
                  {c.worry}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* 선택된 고민 → 솔루션 */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm md:p-10">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* 좌: 고민 */}
                  <div>
                    <p className="text-lg font-bold text-white">{concerns[active].worry}</p>
                    <p className="mt-3 leading-relaxed text-white/50">
                      {concerns[active].detail}
                    </p>
                  </div>

                  {/* 우: 솔루션 */}
                  <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.06] p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white">
                        <AppIcon name={concerns[active].appIcon} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">추천 앱</p>
                        <p className="text-sm font-bold text-white">{concerns[active].app}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/50">
                      {concerns[active].solution}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
