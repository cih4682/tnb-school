"use client";

import { motion } from "framer-motion";
import { Section } from "../ui/Section";

export function PricingVideo() {
  return (
    <Section className="!py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl"
      >
        <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl bg-gradient-to-br from-brand-500 to-pink-500 opacity-20 blur-3xl" />
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
          <video
            src="/school.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
        </div>
      </motion.div>
    </Section>
  );
}
