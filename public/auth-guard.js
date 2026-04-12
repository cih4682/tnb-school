(async function () {
  // Supabase CDN 로드
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')

  const supabase = createClient(
    'https://uxvahakahmzqqelbeiyw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dmFoYWthaG16cXFlbGJlaXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTI0NjcsImV4cCI6MjA5MTI4ODQ2N30.1cw9RULfAuchUnJSyI_cBM4sjtoKXe2FT_bZYNB0acA'
  )

  const FONT = '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  const LOGIN_URL = 'https://teacherbuff.com/login'
  const PRICING_URL = 'https://teacherbuff.com/#pricing'
  const HOME_URL = 'https://teacherbuff.com'

  // Pretendard 폰트 로드
  if (!document.getElementById('tb-font')) {
    const link = document.createElement('link')
    link.id = 'tb-font'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
    document.head.appendChild(link)
  }

  // Shimmer CSS
  if (!document.getElementById('tb-style')) {
    const style = document.createElement('style')
    style.id = 'tb-style'
    style.textContent = `
      @keyframes tb-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .tb-shimmer-text {
        background: linear-gradient(90deg, #a5b4fc 0%, #f9a8d4 25%, #fde68a 50%, #f9a8d4 75%, #a5b4fc 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        animation: tb-shimmer 4s linear infinite;
      }
    `
    document.head.appendChild(style)
  }

  // 화면 렌더링 함수
  function showScreen(headline, sub, body) {
    const overlay = document.createElement('div')
    overlay.id = 'tb-auth-overlay'
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#020617 0%,#1e1b4b 50%,#0f172a 100%);font-family:' + FONT
    overlay.innerHTML = `
      <div style="width:100%;max-width:400px;padding:24px;text-align:center">
        <h2 class="tb-shimmer-text" style="font-size:32px;font-weight:800;letter-spacing:-0.02em;margin:0;line-height:1.3">${headline}</h2>
        <p style="margin-top:12px;font-size:15px;font-weight:500;color:rgba(255,255,255,0.7)">${sub}</p>
        <h1 style="font-size:28px;font-weight:800;color:white;margin:40px 0 0;letter-spacing:-0.01em;font-family:${FONT}">T&B School</h1>
        ${body}
      </div>
    `
    document.body.appendChild(overlay)
  }

  // 세션 확인 (getSession은 URL 해시 토큰도 자동 처리)
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  // URL에 해시 토큰이 있으면 처리 완료까지 대기
  if (!user && window.location.hash.includes('access_token')) {
    // OAuth 리다이렉트 직후 — 세션 처리 대기
    await new Promise(resolve => {
      supabase.auth.onAuthStateChange((event, sess) => {
        if (event === 'SIGNED_IN' && sess) {
          resolve(sess)
        }
      })
      // 5초 안에 안 되면 타임아웃
      setTimeout(resolve, 5000)
    })
    // 페이지 새로고침으로 깨끗하게 시작 (해시 제거)
    window.location.href = window.location.origin + window.location.pathname
    return
  }

  // 1. 로그인 안 됨 → teacherbuff.com/login으로 이동 (redirect 포함)
  if (!user) {
    const redirect = encodeURIComponent(window.location.origin + window.location.pathname)
    window.location.href = LOGIN_URL + '?redirect=' + redirect
    return
  }

  // 2. profiles 조회
  let { data: profile } = await supabase
    .from('profiles')
    .select('plan, role')
    .eq('user_id', user.id)
    .single()

  // 3. profile 없으면 자동 생성
  if (!profile) {
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '익명'
    await supabase.from('profiles').insert({
      user_id: user.id,
      name: name,
      email: user.email || '',
    })
    // 다시 조회
    const res = await supabase.from('profiles').select('plan, role').eq('user_id', user.id).single()
    profile = res.data
  }

  if (!profile) {
    // 그래도 없으면 (RLS 등 문제) → 홈으로
    window.location.href = HOME_URL
    return
  }

  // 4. admin / PRO / TEAM → 통과 (아무것도 안 함)
  if (profile.role === 'admin' || profile.plan === 'pro' || profile.plan === 'team') {
    return
  }

  // 5. managed_apps에서 이 앱 URL 찾기
  const { data: apps } = await supabase
    .from('managed_apps')
    .select('id')
    .eq('url', window.location.origin)
    .limit(1)

  if (apps && apps.length > 0) {
    // 6. user_apps 권한 확인
    const { data: grant } = await supabase
      .from('user_apps')
      .select('id')
      .eq('user_id', user.id)
      .eq('app_id', apps[0].id)
      .limit(1)

    // 권한 있음 → 통과
    if (grant && grant.length > 0) {
      return
    }
  }

  // 7. 권한 없음 → 승인 대기 화면
  showScreen(
    '승인 대기 중입니다',
    '관리자가 확인 후 승인해 드립니다',
    `<p style="margin-top:8px;font-size:14px;color:rgba(255,255,255,0.5)">잠시만 기다려 주세요</p>
     <div style="margin-top:32px;padding:16px 24px;background:rgba(255,255,255,0.06);border-radius:12px;border:1px solid rgba(255,255,255,0.1)">
       <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0">플랜 가입 또는 관리자 승인 후<br/>이 앱을 사용할 수 있습니다.</p>
     </div>
     <a href="${PRICING_URL}" style="display:inline-block;margin-top:32px;padding:14px 36px;background:white;color:#0f172a;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;font-family:${FONT}">플랜 안내 보기</a>
     <a href="${HOME_URL}" style="display:block;margin-top:16px;color:rgba(255,255,255,0.4);font-size:13px;text-decoration:none">홈페이지 바로가기</a>`
  )
})()
