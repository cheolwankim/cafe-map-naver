// src/components/map/KakaoMap.tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * 중앙 영역에 표시되는 카카오 지도 컴포넌트
 * - 최초 마운트 시 Kakao Maps JS SDK 스크립트를 로드
 * - 로드가 끝나면 kakao.maps.load 콜백에서 실제 지도 생성
 */
export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!appKey) {
      console.error(
        "[KakaoMap] NEXT_PUBLIC_KAKAO_MAP_KEY 가 설정되어 있지 않습니다."
      );
      return;
    }

    const script = document.createElement("script");
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?` +
      `appkey=${appKey}` +
      `&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) {
        console.error("[KakaoMap] window.kakao.maps 가 없습니다.");
        return;
      }

      kakao.maps.load(() => {
        if (!mapRef.current) return;

        const center = new kakao.maps.LatLng(37.5665, 126.978); // 서울시청
        const options = {
          center,
          level: 4, // 숫자 작을수록 더 확대
        };

        const map = new kakao.maps.Map(mapRef.current, options);
      });
    };

    script.onerror = () => {
      console.error("[KakaoMap] kakao sdk 로드 실패");
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // 이제 서비스 활성화도 되었으니 h-full로 레이아웃에 맞게 채움
  return <div ref={mapRef} className="h-full w-full" />;
}
