import { Section } from "../ui/Section";
import { Button } from "../ui/Button";

const benefits = [
  "현재 등록된 모든 앱 평생 사용",
  "신규 추가되는 앱 자동 포함",
  "커스텀 앱 제작 우선 신청권",
  "선생님 전용 커뮤니티 초대",
  "월 1회 신규 앱 라이브 데모",
];

export function Pricing() {
  return (
    <Section id="pricing" className="bg-slate-50">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">티처버프 입학 안내</h2>
        <p className="mt-3 text-slate-600">한 번의 입학금으로 평생 동행합니다</p>
      </div>

      <div className="mx-auto mt-12 max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-600 bg-white p-10 shadow-2xl shadow-brand-600/10">
          <div className="absolute right-0 top-0 rounded-bl-2xl bg-brand-600 px-4 py-1.5 text-xs font-bold text-white">
            평생 회원
          </div>
          <h3 className="text-2xl font-extrabold">티처버프 정회원</h3>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-5xl font-extrabold">₩99,000</span>
            <span className="text-slate-500">/ 1회</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            * 가격은 임시 표시이며, 추후 변경될 수 있습니다.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  ✓
                </span>
                <span className="text-slate-700">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href="#custom" className="w-full">
              지금 입학하기
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
