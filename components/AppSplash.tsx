// 홈 화면 앱(standalone)으로 열었을 때만, 세션당 한 번 보여주는 시작 애니메이션.
// OS 시작화면(manifest background_color #4772a7 = maskable 아이콘 가장자리색)과 같은 배경색에서 이어지도록 한다.
// 첫 페인트 전에 <head> 스크립트가 html 에 .tnb-splash 를 붙여야 깜빡임이 없다 → 순수 CSS 로 동작.

export const SPLASH_SCRIPT = `(function(){try{var s=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;if(s&&!sessionStorage.getItem('tnb-splash')){sessionStorage.setItem('tnb-splash','1');document.documentElement.classList.add('tnb-splash')}}catch(e){}})();`;

export function AppSplash() {
  return (
    <div className="tnb-splash-screen" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/splash-owl.png" alt="" className="tnb-splash-owl" />
      <p className="tnb-splash-word">
        Teacher<span>Buff</span>
      </p>
    </div>
  );
}
