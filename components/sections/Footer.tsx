export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <div>
          <p className="text-lg font-extrabold text-slate-900">T&B School</p>
          <p className="text-sm text-slate-500">선생님을 위한 100개의 도구</p>
        </div>
        <div className="text-sm text-slate-500">
          <p>문의: hello@tnb.school</p>
          <p className="mt-1">© {new Date().getFullYear()} T&B School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
