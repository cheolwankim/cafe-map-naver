// src/types/kakao.ts
// Kakao Local API (키워드 검색) 응답에서 사용하는 필드들
export interface KakaoPlace {
  id: string;
  place_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // 경도 (lng)
  y: string; // 위도 (lat)
  place_url: string;
}
