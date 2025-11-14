// src/app/page.tsx
import { AppShell } from "@/components/layout/AppShell";
import KakaoMap from "@/components/map/KakaoMap";

export default function HomePage() {
  return (
    <AppShell>
      <KakaoMap />
    </AppShell>
  );
}
