// src/app/page.tsx
import { AppShell } from "@/components/layout/AppShell";

/**
 * 메인 페이지:
 * - 현재는 중앙 영역에 "지도 자리" 박스만 표시
 * - 다음 브랜치에서 실제 네이버 지도 SDK를 얹을 예정
 */
export default function HomePage() {
  return (
    <AppShell>
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg border border-dashed border-slate-400 bg-white/60 px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">
            여기 지도(Naver Maps)가 들어갈 자리입니다.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            다음 단계에서 네이버 지도 API 스크립트를 로드하고,
            실제 지도를 렌더링할 예정입니다.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
