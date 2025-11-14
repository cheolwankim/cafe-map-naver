// src/components/map/KakaoMap.tsx
"use client";

import { useEffect, useRef } from "react";
import type { KakaoPlace } from "@/types/kakao";

type KakaoMapProps = {
  places: KakaoPlace[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string) => void;
};

/**
 * 중앙 영역에 표시되는 카카오 지도 컴포넌트
 * - 최초 마운트 시 Kakao Maps JS SDK 스크립트를 로드하고 지도 생성
 * - places가 변경될 때마다 마커를 다시 찍고, bounds를 재계산
 */
export default function KakaoMap({
  places,
  selectedPlaceId,
  onSelectPlace,
}: KakaoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
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

    return () => {
      // SDK는 한 번만 쓰고, SPA 구조에서는 보통 그대로 둡니다.
      // script.remove(); 는 필요하면 나중에 고려
    };
  }, []);

  // 2) places / selectedPlaceId 변경 시 마커 재생성
  useEffect(() => {
    const kakao = (window as any).kakao;
    const map = mapInstanceRef.current;
    if (!kakao?.maps || !map) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
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

      markersRef.current.push(marker);
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
  }, [places, selectedPlaceId, onSelectPlace]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
