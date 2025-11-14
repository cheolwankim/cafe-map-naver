// src/components/map/KakaoMap.tsx
"use client";

import { useEffect, useRef } from "react";
import type { KakaoPlace } from "@/types/kakao";

type KakaoMapProps = {
  places: KakaoPlace[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string) => void;
};

type MarkerEntry = {
  placeId: string;
  marker: any;
  position: any;
};

/**
 * 중앙 영역에 표시되는 카카오 지도 컴포넌트
 * - SDK 로드 + 지도 생성
 * - places 변경 시 마커 재생성
 * - 리스트/마커 선택 시 지도 중심 이동 + 인포윈도우 표시
 */
export default function KakaoMap({
  places,
  selectedPlaceId,
  onSelectPlace,
}: KakaoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const infoWindowRef = useRef<any | null>(null);

  // 1) SDK 로드 + 지도 생성
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!appKey) {
      console.error(
        "[KakaoMap] NEXT_PUBLIC_KAKAO_MAP_KEY 가 설정되어 있지 않습니다.",
      );
      return;
    }

    const scriptId = "kakao-maps-sdk";

    const createMap = () => {
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) return;

      const center = new kakao.maps.LatLng(37.5665, 126.9780); // 서울시청
      const options = {
        center,
        level: 4,
      };

      mapInstanceRef.current = new kakao.maps.Map(
        mapContainerRef.current,
        options,
      );
      infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
    };

    const existingScript = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      const kakao = (window as any).kakao;
      if (kakao?.maps) {
        kakao.maps.load(() => {
          createMap();
        });
      } else {
        existingScript.addEventListener("load", () => {
          kakao.maps.load(() => {
            createMap();
          });
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?` +
      `appkey=${appKey}` +
      `&autoload=false&libraries=services`;

    script.onload = () => {
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) return;
      kakao.maps.load(() => {
        createMap();
      });
    };

    script.onerror = () => {
      console.error("[KakaoMap] kakao sdk 로드 실패");
    };

    document.head.appendChild(script);
  }, []);

  // 2) places 변경 시 마커 재생성
  useEffect(() => {
    const kakao = (window as any).kakao;
    const map = mapInstanceRef.current;
    if (!kakao?.maps || !map) return;

    // 기존 마커 제거
    markersRef.current.forEach((entry) => entry.marker.setMap(null));
    markersRef.current = [];

    if (!places.length) return;

    const bounds = new kakao.maps.LatLngBounds();

    places.forEach((place) => {
      const position = new kakao.maps.LatLng(
        Number(place.y),
        Number(place.x),
      );

      const marker = new kakao.maps.Marker({
        position,
        map,
      });

      const entry: MarkerEntry = { placeId: place.id, marker, position };
      markersRef.current.push(entry);
      bounds.extend(position);

      kakao.maps.event.addListener(marker, "click", () => {
        if (!infoWindowRef.current) {
          infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
        }
        const content = `<div style="padding:6px 8px;font-size:12px;">${place.place_name}</div>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, marker);

        onSelectPlace?.(place.id);
      });
    });

    map.setBounds(bounds);
  }, [places, onSelectPlace]);

  // 3) selectedPlaceId 변경 시 해당 마커로 이동 + 인포윈도우 열기
  useEffect(() => {
    if (!selectedPlaceId) return;

    const kakao = (window as any).kakao;
    const map = mapInstanceRef.current;
    if (!kakao?.maps || !map) return;

    const entry = markersRef.current.find(
      (m) => m.placeId === selectedPlaceId,
    );
    if (!entry) return;

    map.panTo(entry.position);

    if (!infoWindowRef.current) {
      infoWindowRef.current = new kakao.maps.InfoWindow({ zIndex: 1 });
    }

    const place = places.find((p) => p.id === selectedPlaceId);
    const title = place?.place_name ?? "";

    const content = `<div style="padding:6px 8px;font-size:12px;">${title}</div>`;
    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(map, entry.marker);
  }, [selectedPlaceId, places]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
