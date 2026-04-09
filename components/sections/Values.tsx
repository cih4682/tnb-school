"use client";

import { motion } from "framer-motion";
import { Section } from "../ui/Section";

const values = [
  {
    icon: "⚡",
    title: "5분이면 충분",
    desc: "복잡한 작업도 클릭 몇 번이면 끝. 수업 준비 시간을 돌려드려요.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: "🎟️",
    title: "한 번 입학, 평생 사용",
    desc: "입학금만 내면 모든 앱을 추가 비용 없이 사용할 수 있어요.",
    gradient: "from-brand-500 to-pink-500",
  },
  {
    icon: "🛠️",
    title: "원하는 앱은 직접 의뢰",
    desc: "필요한 앱이 없다면? 선생님 맞춤으로 새로 만들어 드립니다.",
    gradient: "from-cyan-400 to-blue-600",
  },
];

export function Values() {
  return (
    <Section>
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold md:text-4xl"
        >
          왜 T&B School인가요?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-slate-600"
        >
          선생님의 시간을 아껴주는 3가지 약속
        </motion.p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${v.gradient}`}
            />
            <div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${v.gradient} text-3xl shadow-lg`}
            >
              {v.icon}
            </div>
            <h3 className="mt-5 text-xl font-bold">{v.title}</h3>
            <p className="mt-2 text-slate-600">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
