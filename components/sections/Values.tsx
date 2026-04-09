"use client";

import { motion } from "framer-motion";
import { IconBolt, IconTicket, IconWrench } from "../ui/Icons";

const values = [
  { Icon: IconBolt, title: "5분이면 충분", desc: "복잡한 작업도 클릭 몇 번이면 끝. 수업 준비 시간을 돌려드려요." },
  { Icon: IconTicket, title: "한 번 입학, 평생 사용", desc: "입학금만 내면 모든 앱을 추가 비용 없이 사용할 수 있어요." },
  { Icon: IconWrench, title: "원하는 앱은 직접 의뢰", desc: "필요한 앱이 없다면? 선생님 맞춤으로 새로 만들어 드립니다." },
];

export function Values() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Why T&B School
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            왜 T&B School인가요?
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-12 md:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 text-slate-900">
                <v.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-500">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
