# Cafe Map – 카카오 지도 기반 카페·음식점 검색 서비스

> Next.js + TypeScript + Kakao Maps + Kakao Local API 기반의 **실전형 지도 검색 서비스**입니다.  
> 키워드 검색을 통해 카페·음식점을 조회하고 지도·리스트·상세정보가 연동되는 직관적인 UX를 제공합니다.

<br>

---

## 배포 주소

- **Frontend (Vercel)** https://cafe-map-naver.vercel.app/  

<br>

---

## 사용 기술

| 영역        | 기술 스택                                                                 |
|-------------|---------------------------------------------------------------------------|
| 프론트엔드  | Next.js(App Router), TypeScript, Tailwind CSS                            |
| 지도/외부 API | Kakao Maps JavaScript SDK, Kakao Local API (keywordSearch)               |
| 배포        | Vercel                                                                    |
| 기타        | 전역 타입 선언(global.d.ts), 환경 변수 관리, 3단 레이아웃(AppShell) 설계 |

<br>

---

## 주요 기능 요약

- Kakao Local API 기반 **키워드 장소 검색**
- 카페(CE7) / 음식점(FD6) **카테고리 필터링 자동 적용**
- 검색 결과를 **좌측 리스트 + 중앙 지도 + 우측 상세 패널**로 구성
- 지도에 마커 표시 및 클릭 시:
  - InfoWindow 표시
  - 리스트 선택 상태 연동
  - 오른쪽 상세 패널 업데이트
- 리스트 클릭 시:
  - 지도 중심 이동(panTo)
  - 해당 마커 강조
  - InfoWindow 표시
- 장소 상세 정보 제공:
  - 이름 / 카테고리 / 주소 / 전화번호 / 카카오맵 링크

<br>

---

## 주요 화면

<img width="1437" height="808" alt="Image" src="https://github.com/user-attachments/assets/16b94b4b-e00a-4541-86ae-d3856322589c" />

기본 화면 (3단 레이아웃)
검색 결과 리스트 + 지도
선택된 장소 상세 정보 패널

<br>

---


## 폴더 구조
프론트엔드 (Next.js)

```html

cafe-map/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 전체 레이아웃(AppShell)
│   │   └── page.tsx             # 홈 페이지: 검색/지도/상세 연동
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppShell.tsx     # 3단 UI 레이아웃
│   │   ├── map/
│   │   │   └── KakaoMap.tsx     # 카카오 지도 + 마커 + panTo + InfoWindow
│   │   └── place/
│   │       └── PlaceDetail.tsx  # 선택된 장소 상세 정보 패널
│   │
│   └── types/
│       └── kakao.ts             # Kakao Local API 타입 정의
│
├── global.d.ts                  # window.kakao 타입 선언
├── .env.local                   # NEXT_PUBLIC_KAKAO_MAP_KEY 설정
└── package.json

```

<br>

---

## 환경변수 설정
.env.local
```
NEXT_PUBLIC_KAKAO_MAP_KEY=카카오_JavaScript_키
```
REST API 키가 아니라 반드시 JavaScript Key를 사용해야 합니다.

<br>

---

## Kakao Developers 설정  

https://developers.kakao.com  → 애플리케이션 추가
플랫폼 → Web → 도메인 등록
 - http://localhost:3000
 - https://your-vercel-url.vercel.app (배포 후)
Maps / Local API 서비스 활성화
JavaScript 키를 .env.local / Vercel 환경변수에 설정


<br>

---


## 구현 상세
✔ 지도 초기화 및 SDK 동적 로드
- Kakao Maps SDK를 <script>로 동적 로드
- autoload=false + kakao.maps.load() 방식으로 Next.js(App Router) 환경에 맞게 구성

✔ 마커 렌더링 및 경계 자동 조정
- 검색 결과마다 마커 생성
- LatLngBounds 로 모든 마커가 보이도록 지도 영역 자동 조정
  
✔ 리스트 ↔ 지도 완전 연동
- 리스트 클릭 → 지도 중심 이동 + InfoWindow + 상세 패널 업데이트
- 마커 클릭 → 리스트 선택 상태 동기화
  
✔ 상세 패널 구성
- Kakao Local API 응답에서 다음 필드 활용:
 - place_name
 - category_group_name, category_name
 - road_address_name, address_name
 - phone
 - place_url (카카오맵 상세 페이지)


<br>

---

## 트러블슈팅

| 문제 상황                                          | 원인                         | 해결 방법                                                      |
| ---------------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| Kakao SDK 로드 실패                                | 도메인이 Kakao Developers에 미등록 | Kakao Developers → 플랫폼 Web에 localhost / Vercel 도메인 등록      |
| `"App disabled OPEN_MAP_AND_LOCAL service"` 에러 | Maps / Local 서비스 비활성화      | 애플리케이션 > API 설정에서 Maps / Local 사용 설정                       |
| TypeScript에서 `window.kakao` 타입 오류              | 전역 타입 미선언                  | 루트에 `global.d.ts` 생성, `interface Window { kakao: any }` 선언 |

<br>

---


## 프로젝트를 통해서
 
- Next.js(App Router) + 외부 지도 SDK(Kakao Maps) 연동 경험+
- CSR 환경에서 안전한 SDK 로딩 순서와 전역 객체 관리 경험+
- 지도/리스트/상세 패널 구조 설계 및 상태 동기화+
- 외부 API(Kakao Local) 사용 경험 축적+

<br>

---

