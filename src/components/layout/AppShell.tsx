// src/components/layout/AppShell.tsx
"use client";

import type { ReactNode } from "react";

/**
 * 페이지 전체 공통 골격:
 * - 상단 헤더
 * - 아래 3컬럼 레이아웃
 *   - 왼쪽: 검색 / 리스트
 *   - 가운데: 지도
 *   - 오른쪽: 상세 / 리뷰
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 상단 헤더 */}
      <header className="flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm">
        <div className="text-lg font-semibold">
          Cafe Map
          <span className="ml-2 text-xs font-normal text-slate-500">
            카카오 지도 기반 카페/식당 리뷰
          </span>
        </div>
        {/* 우측 상단: 로그인/유저 영역 (추후 구현) */}
        <div className="text-sm text-slate-500">로그인 영역 (TODO)</div>
      </header>

      {/* 메인 컨텐츠: 3컬럼 */}
      <main className="flex flex-1 overflow-hidden">
        {/* 왼쪽: 검색 / 리스트 */}
        <aside className="flex w-72 min-w-[18rem] flex-col border-r bg-slate-50">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold">검색 / 필터</p>
            <p className="mt-1 text-xs text-slate-500">
              키워드 검색, 카테고리 필터 등이 들어갈 영역입니다.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-slate-600">
            장소 리스트 영역 (TODO)
          </div>
        </aside>

        {/* 가운데: 지도 영역 */}
        <section className="flex-1 border-r bg-slate-100">
          {children}
        </section>

        {/* 오른쪽: 선택한 장소 정보 / 리뷰 */}
        <aside className="flex w-96 min-w-[22rem] flex-col bg-white">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold">선택한 장소 정보</p>
            <p className="mt-1 text-xs text-slate-500">
              장소 상세 정보, 평균 평점, 리뷰 목록이 들어갈 영역입니다.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-slate-600">
            아직 선택된 장소가 없습니다.
          </div>
        </aside>
      </main>
    </div>
  );
}
