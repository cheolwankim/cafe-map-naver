// src/app/page.tsx
"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import KakaoMap from "@/components/map/KakaoMap";
import type { KakaoPlace } from "@/types/kakao";
import { PlaceDetail } from "@/components/place/PlaceDetail";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<KakaoPlace[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const kakao = (window as any).kakao;
    if (!kakao?.maps?.services) {
      setError("지도 SDK가 아직 로드되지 않았습니다.");
      return;
    }

    const ps = new kakao.maps.services.Places();

    setLoading(true);
    setError(null);

    ps.keywordSearch(
      trimmed,
      (data: any, status: string) => {
        const statusEnum = kakao.maps.services.Status;
        if (status === statusEnum.OK) {
          const raw = data as KakaoPlace[];

          // 카페(CE7), 음식점(FD6)만 필터링
          const filtered = raw.filter((p) =>
            ["CE7", "FD6"].includes(p.category_group_code)
          );

          setPlaces(filtered);
          setSelectedPlaceId(null);
          setError(null);
        } else if (status === statusEnum.ZERO_RESULT) {
          setPlaces([]);
          setSelectedPlaceId(null);
          setError("검색 결과가 없습니다.");
        } else {
          setPlaces([]);
          setSelectedPlaceId(null);
          setError("검색 중 오류가 발생했습니다.");
        }

        setLoading(false);
      },
      {
        size: 15, // 최대 15개까지만 받아오기 (리스트/마커 관리 용이)
      }
    );
  };

  // 왼쪽 패널 내용
  const leftPanel = (
    <>
      <div className="border-b px-4 py-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
            placeholder="지역 + 카페 예) 홍대 카페"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
            disabled={loading}
          >
            검색
          </button>
        </form>
        {loading && <p className="mt-2 text-xs text-slate-500">검색 중...</p>}
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-slate-700">
        {places.length === 0 && !error && !loading && (
          <p className="text-xs text-slate-500">
            검색어를 입력하고 카페/식당을 검색해 보세요.
          </p>
        )}

        <ul className="space-y-2">
          {places.map((place) => {
            const isSelected = place.id === selectedPlaceId;
            return (
              <li
                key={place.id}
                className={`cursor-pointer rounded border px-2 py-2 ${
                  isSelected
                    ? "border-slate-900 bg-slate-100"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
                onClick={() => setSelectedPlaceId(place.id)}
              >
                <p className="text-sm font-semibold">{place.place_name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {place.road_address_name || place.address_name}
                </p>
                {place.category_group_name && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {place.category_group_name} · {place.category_name}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );

  // 오른쪽 패널 내용 (선택된 장소 간단 정보만 우선)
  // 오른쪽 패널 내용 (선택된 장소 상세 카드)
  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null;

  const rightPanel = <PlaceDetail place={selectedPlace} />;

  return (
    <AppShell left={leftPanel} right={rightPanel}>
      <KakaoMap
        places={places}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={setSelectedPlaceId}
      />
    </AppShell>
  );
}
