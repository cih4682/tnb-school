"use client";

import { FormEvent, useState } from "react";
import { Section } from "../ui/Section";

interface Errors {
  name?: string;
  email?: string;
  request?: string;
}

export function CustomForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = "이름을 입력해 주세요.";
    if (!email.trim()) e.email = "이메일을 입력해 주세요.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "올바른 이메일 형식이 아니에요.";
    if (!request.trim() || request.trim().length < 10)
      e.request = "어떤 앱이 필요한지 10자 이상 적어주세요.";
    return e;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
      // TODO: 추후 백엔드 연동
    }
  }

  if (submitted) {
    return (
      <Section id="custom">
        <div className="mx-auto max-w-xl rounded-3xl border border-brand-200 bg-brand-50 p-12 text-center">
          <div className="text-5xl">🎉</div>
          <h3 className="mt-4 text-2xl font-bold text-brand-900">
            신청이 접수되었습니다!
          </h3>
          <p className="mt-2 text-brand-700">
            검토 후 영업일 기준 3일 이내로 이메일 드릴게요.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="custom">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">커스텀 앱 제작</h2>
        <p className="mt-3 text-slate-600">
          원하는 앱이 없나요? 선생님만을 위한 앱을 만들어 드립니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-12 max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
        noValidate
      >
        <Field label="이름" error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="홍길동"
          />
        </Field>

        <Field label="이메일" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="teacher@school.kr"
          />
        </Field>

        <Field label="어떤 앱이 필요하세요?" error={errors.request}>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="예: 학생들의 독서 기록을 시각화해주는 앱이 필요해요."
          />
        </Field>

        <button
          type="submit"
          className="w-full rounded-full bg-brand-600 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
        >
          신청하기
        </button>
      </form>
    </Section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
