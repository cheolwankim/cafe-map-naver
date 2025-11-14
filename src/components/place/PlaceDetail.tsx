// src/components/place/PlaceDetail.tsx
"use client";

import type { KakaoPlace } from "@/types/kakao";

type PlaceDetailProps = {
  place: KakaoPlace | null;
};

export function PlaceDetail({ place }: PlaceDetailProps) {
  if (!place) {
    return (
      <div className="flex h-full flex-col px-4 py-3 text-sm text-slate-600">
        <p className="mb-2 text-xs font-semibold text-slate-500">
          선택한 장소 정보
        </p>
        <p className="text-xs text-slate-500">
          리스트나 지도에서 장소를 선택하면 상세 정보가 표시됩니다.
        </p>
      </div>
    );
  }

  const {
    place_name,
    category_group_name,
    category_name,
    road_address_name,
    address_name,
    phone,
    place_url,
  } = place;

  return (
    <div className="flex h-full flex-col px-4 py-3 text-sm text-slate-800">
      {/* 제목 영역 */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-slate-500">
          선택한 장소 정보
        </p>
        <h2 className="mt-1 text-lg font-bold">{place_name}</h2>

        {/* 카테고리 배지 */}
        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
          {category_group_name && (
            <span className="rounded-full border border-slate-300 px-2 py-[2px] text-slate-700">
              {category_group_name}
            </span>
          )}
          {category_name && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-[2px] text-slate-500">
              {category_name}
            </span>
          )}
        </div>
      </div>

      {/* 본문 정보 */}
      <div className="space-y-3 text-xs">
        {/* 주소 */}
        <div>
          <p className="font-semibold text-slate-600">주소</p>
          {road_address_name && (
            <p className="mt-1 text-slate-700">{road_address_name}</p>
          )}
          {address_name && address_name !== road_address_name && (
            <p className="mt-1 text-slate-500">{address_name}</p>
          )}
        </div>

        {/* 전화번호 */}
        {phone && (
          <div>
            <p className="font-semibold text-slate-600">전화번호</p>
            <a
              href={`tel:${phone}`}
              className="mt-1 inline-block text-slate-700 underline"
            >
              {phone}
            </a>
          </div>
        )}

        {/* 외부 링크 */}
        <div>
          <p className="font-semibold text-slate-600">자세히 보기</p>
          <a
            href={place_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-slate-900 underline"
          >
            카카오맵 상세 페이지 열기
          </a>
        </div>
      </div>
    </div>
  );
}
