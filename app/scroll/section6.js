import { useEffect, useRef, useState } from "react";

/* ── SCRIPT : 스크롤 % ── */
function useSectionScroll() {
  const sectionRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const realHeight = el.offsetHeight - window.innerHeight;
      if (realHeight <= 0) return setScrollPercent(0);
      const percent = ((window.scrollY - el.offsetTop) / realHeight) * 100;
      setScrollPercent(Math.max(0, Math.min(100, percent)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { sectionRef, scrollPercent };
}

function mapRange(p, start, end) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function fadePhase(p, inStart, inEnd, outStart, outEnd) {
  if (p < inStart) return 0;
  if (p < inEnd) return (p - inStart) / (inEnd - inStart);
  if (p < outStart) return 1;
  if (p < outEnd) return 1 - (p - outStart) / (outEnd - outStart);
  return 0;
}

const TITLE_WORDS = ["Empowering", "innovators", "worldwide", "with"];

const STATS = [
  { label: "고객", value: 35, suffix: "" },
  { label: "하루평균 사용시간", value: 151810, suffix: "분" },
  { label: "업무 처리율", value: 1851, suffix: "건" },
];

/* ── 기존 브랜드 로고 (img) ── */
const BRAND_LOGOS = [
  { id: "react", name: "React", file: "react.svg" },
  { id: "vue", name: "Vue", file: "vue.svg" },
  { id: "angular", name: "Angular", file: "angular.svg" },
  { id: "nextjs", name: "Next.js", file: "nextjs.svg" },
  { id: "svelte", name: "Svelte", file: "svelte.svg" },
  { id: "nuxtjs", name: "Nuxt.js", file: "nuxtjs.svg" },
  { id: "laravel", name: "Laravel", file: "laravel.svg" },
  { id: "vite", name: "Vite", file: "vite.svg" },
  { id: "astro", name: "Astro", file: "astro.svg" },
  { id: "rails", name: "Rails", file: "rails.svg" },
  { id: "htmx", name: "HTMX", file: "htmx.svg" },
  { id: "lit", name: "Lit", file: "lit.svg" },
];

/* ── CLT Ocean & Container Logistics — 40 Concepts ── */
const CLT_LOGOS = [
  {
    id: "clt-01-compass",
    name: "01. Compass Route",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="11.5"
          fill="none"
          stroke="#0F172A"
          strokeWidth="2.2"
        />
        <path
          fill="#0EA5E9"
          d="m18.7 7.5-1.1 7.1-4.3 2.8-1.1 7.1 5.2-5.2 1.3-11.8z"
        />
        <circle cx="16" cy="16" r="2.2" fill="#F97316" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M5.5 24.5c4-2.5 7.5-2.5 11 0s6.8 2.5 10 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-02-cargo-cube",
    name: "02. Smart Cargo Cube",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="m16 3 12 6.4v13.2L16 29 4 22.6V9.4L16 3z" />
        <path fill="#0284C7" d="m16 6.5 8.5 4.6-8.5 4.6-8.5-4.6L16 6.5z" />
        <path fill="#0EA5E9" d="m6.8 13.5 7.6 4.1v7.6l-7.6-4v-7.7z" />
        <path fill="#F59E0B" d="m17.6 17.6 7.6-4.1v7.7l-7.6 4v-7.6z" />
      </svg>
    ),
  },
  {
    id: "clt-03-horizon",
    name: "03. Ocean Horizon",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#E0F2FE" />
        <path fill="#F59E0B" d="M10.5 14a5.5 5.5 0 0 1 11 0h-11z" />
        <path
          fill="#0369A1"
          d="M3.6 16h24.8c-.3 7.2-5.4 13-12.4 13S3.9 23.2 3.6 16z"
        />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="2"
          strokeLinecap="round"
          d="M6 20c3-2 5-2 8 0s5 2 8 0 4-1.6 5-1"
        />
      </svg>
    ),
  },
  {
    id: "clt-04-anchor-link",
    name: "04. Connected Anchor",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="7"
          r="3.2"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
        />
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 10.5v14M9 16H5m22 0h-4M6 20c1.5 5 5 8 10 8s8.5-3 10-8"
        />
        <circle cx="6" cy="16" r="2" fill="#F59E0B" />
        <circle cx="26" cy="16" r="2" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    id: "clt-05-speed-ship",
    name: "05. Velocity Vessel",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0F172A" d="m9 13 15-6-3 10H9v-4z" />
        <path fill="#0284C7" d="M5 17h24l-4 6.5H10L5 17z" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          d="M3 27h19M2 12h7M5 8h7"
        />
        <path fill="#F97316" d="m25 7 4 2-6 3 2-5z" />
      </svg>
    ),
  },
  {
    id: "clt-06-orbit",
    name: "06. Global Cargo Orbit",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="8.5" fill="#0B3A5B" />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.4"
          d="M8 16h16M16 7.5c3 2.5 4.5 5.3 4.5 8.5S19 22 16 24.5C13 22 11.5 19.2 11.5 16S13 10 16 7.5z"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="6.5"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2"
          transform="rotate(-24 16 16)"
        />
        <circle cx="27.5" cy="10.2" r="2.3" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-07-signal",
    name: "07. Maritime Signal",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0F172A" d="M14 12h4v16h-4z" />
        <path fill="#F97316" d="m16 3 4.5 7h-9L16 3z" />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.2"
          strokeLinecap="round"
          d="M10.5 8a9 9 0 0 0 0 12M21.5 8a9 9 0 0 1 0 12M6.5 5a14 14 0 0 0 0 18M25.5 5a14 14 0 0 1 0 18"
        />
        <path fill="#0369A1" d="M8 27h16v2H8z" />
      </svg>
    ),
  },
  {
    id: "clt-08-infinity-route",
    name: "08. Infinite Logistics",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="4"
          strokeLinecap="round"
          d="M5 16c3.2-5.8 7.2-5.8 11 0s7.8 5.8 11 0"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="4"
          strokeLinecap="round"
          d="M5 16c3.2 5.8 7.2 5.8 11 0s7.8-5.8 11 0"
        />
        <circle cx="5" cy="16" r="2.3" fill="#F59E0B" />
        <circle cx="27" cy="16" r="2.3" fill="#F97316" />
      </svg>
    ),
  },
  {
    id: "clt-09-port-pin",
    name: "09. Port Location",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="#0B3A5B"
          d="M16 2.5A10.5 10.5 0 0 0 5.5 13C5.5 21 16 29.5 16 29.5S26.5 21 26.5 13A10.5 10.5 0 0 0 16 2.5z"
        />
        <path fill="#0EA5E9" d="M9.5 14h13l-2 4H12l-2.5-4z" />
        <rect x="12" y="9" width="3.5" height="5" fill="#F8FAFC" />
        <rect x="16.5" y="7" width="3.5" height="7" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-10-prism",
    name: "10. CLT Prism",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0F172A" d="M16 2 30 26H2L16 2z" />
        <path fill="#0284C7" d="m16 8-7.5 15h6L16 8z" />
        <path fill="#0EA5E9" d="M16 8v15h7.5L16 8z" />
        <path fill="#F8FAFC" d="m16 13-3 7h6l-3-7z" />
        <path fill="#F59E0B" d="M9 27.5h14V30H9z" />
      </svg>
    ),
  },
  {
    id: "clt-11-monogram",
    name: "11. CLT Modern Monogram",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#0F172A" />
        <rect x="7" y="16" width="4" height="9" rx="1.5" fill="#38BDF8" />
        <rect x="14" y="10" width="4" height="15" rx="1.5" fill="#F8FAFC" />
        <rect x="21" y="13" width="4" height="12" rx="1.5" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-12-ribbon",
    name: "12. CLT Ribbon",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0284C7" d="M16 2 29 9.5v13L16 30 3 22.5v-13L16 2z" />
        <path
          fill="#F8FAFC"
          d="m16 9 2.3 5.2 5.2 1.8-5.2 1.8L16 23.5l-2.3-5.2-5.2-1.8 5.2-1.8L16 9z"
        />
        <circle cx="16" cy="16" r="2" fill="#FBBF24" />
      </svg>
    ),
  },
  {
    id: "clt-13-line",
    name: "13. CLT Signature Line",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 22c2-6 4-6 6 0s4 6 6 0 4-10 8-10 4 10 6 4"
        />
        <circle cx="4" cy="22" r="1.8" fill="#F97316" />
        <circle cx="28" cy="16" r="1.8" fill="#0EA5E9" />
      </svg>
    ),
  },
  {
    id: "clt-14-interlock",
    name: "14. CLT Interlock",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="#E0F2FE" />
        <circle
          cx="11"
          cy="17"
          r="5.5"
          fill="none"
          stroke="#0369A1"
          strokeWidth="2.4"
        />
        <circle
          cx="18"
          cy="12"
          r="5.5"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
        />
        <circle
          cx="21"
          cy="19"
          r="5.5"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.4"
        />
      </svg>
    ),
  },
  {
    id: "clt-15-forward",
    name: "15. CLT Forward",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0F172A" d="M3 5h20l6 11-6 11H3l6-11L3 5z" />
        <path
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10h-1.5a6 6 0 0 0 0 12H13m2.5-12v12h4"
        />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
          d="M19 10h8M23 10v12"
        />
        <path fill="#F97316" d="m25 3 5 3-5 3V3z" />
      </svg>
    ),
  },
  {
    id: "clt-16-container-wave",
    name: "16. Ocean Container",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="5" width="24" height="15" rx="2" fill="#0B3A5B" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.6"
          d="M9 7.5v10M13.5 7.5v10M18 7.5v10M22.5 7.5v10"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.2"
          strokeLinecap="round"
          d="M3 24c3.5-3.5 7-3.5 10.5 0s7 3.5 10.5 0 4.5-2.5 5-2"
        />
        <path fill="#F59E0B" d="M22 8h3v8h-3z" />
      </svg>
    ),
  },
  {
    id: "clt-17-container-ship",
    name: "17. Container Vessel",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="7" y="8" width="6" height="5" rx="1" fill="#F59E0B" />
        <rect x="14" y="8" width="6" height="5" rx="1" fill="#0EA5E9" />
        <rect x="21" y="8" width="6" height="5" rx="1" fill="#0284C7" />
        <path fill="#0F172A" d="M3 14h27l-4.5 9H9L3 14z" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          d="M4 27c4-2.5 8-2.5 12 0s8 2.5 12 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-18-stacked-cargo",
    name: "18. Stacked Sea Cargo",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="3" y="5" width="12" height="7" rx="1.5" fill="#0EA5E9" />
        <rect x="17" y="5" width="12" height="7" rx="1.5" fill="#F97316" />
        <rect x="6" y="14" width="12" height="7" rx="1.5" fill="#0369A1" />
        <rect x="20" y="14" width="9" height="7" rx="1.5" fill="#F59E0B" />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.3"
          d="M7 7.5v2M11 7.5v2M21 7.5v2M25 7.5v2M10 16.5v2M14 16.5v2M24 16.5v2"
        />
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.2"
          strokeLinecap="round"
          d="M3 26c4-3 8-3 12 0s8 3 14-1"
        />
      </svg>
    ),
  },
  {
    id: "clt-19-crane-container",
    name: "19. Smart Port Crane",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 27V5h20M12 5l-6 7M23 5v7"
        />
        <path
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeLinecap="round"
          d="M23 12v3"
        />
        <rect x="17" y="15" width="12" height="8" rx="1.5" fill="#0284C7" />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.4"
          d="M21 17v4M25 17v4"
        />
        <path fill="#0EA5E9" d="M3 27h27v2H3z" />
      </svg>
    ),
  },
  {
    id: "clt-20-cargo-route",
    name: "20. Global Container Route",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="#E0F2FE" />
        <path
          fill="none"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2.5 3"
          d="M5 20C8 9 19 5 27 11"
        />
        <rect x="9" y="13" width="14" height="10" rx="2" fill="#0B3A5B" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.5"
          d="M13 15.5v5M17 15.5v5"
        />
        <path fill="#F59E0B" d="m25 7 5 3-5 3V7z" />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="1.7"
          strokeLinecap="round"
          d="M6 26c3-2 6-2 9 0s6 2 10 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-21-lighthouse",
    name: "21. Lighthouse Beacon",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M13 30 14 12h4l1 18z" />
        <path fill="#F8FAFC" d="M14.3 16h3.4v3h-3.4zm-.3 5h4v3h-4z" />
        <path fill="#F59E0B" d="M13.5 8 16 3l2.5 5z" />
        <path
          fill="none"
          stroke="#FBBF24"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M18.5 8 27 5M19 10.5h9M18.5 13 27 16"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeLinecap="round"
          d="M4 27c4-3 8-3 12 0s8 3 12 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-22-tide-bars",
    name: "22. Tide Pulse Bars",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="20" width="4" height="8" fill="#7DD3FC" />
        <rect x="10" y="15" width="4" height="13" fill="#0EA5E9" />
        <rect x="16" y="10" width="4" height="18" fill="#0284C7" />
        <rect x="22" y="6" width="4" height="22" fill="#0B3A5B" />
        <path
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          d="M3 9c3-3 6-3 9 0s6 3 9 0 6-3 8-1"
        />
      </svg>
    ),
  },
  {
    id: "clt-23-knot",
    name: "23. Nautical Knot",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="3.2"
          strokeLinecap="round"
          d="M9 9a7 7 0 1 0 7 12"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="3.2"
          strokeLinecap="round"
          d="M16 21a7 7 0 1 0 7-12"
        />
        <circle cx="16" cy="16" r="1.8" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-24-radar",
    name: "24. Cargo Tracking Radar",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle
          cx="16"
          cy="16"
          r="8"
          fill="none"
          stroke="#0284C7"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="1.5"
        />
        <path
          fill="#0EA5E9"
          opacity="0.45"
          d="M16 16V4a12 12 0 0 1 10.9 6.9z"
        />
        <circle cx="22" cy="9.5" r="2.2" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-25-bridge",
    name: "25. Logistics Bridge",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.4"
          strokeLinecap="round"
          d="M4 22c4-10 20-10 24 0"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M9 22V13M13 22V9M16 22V7M19 22V9M23 22V13"
        />
        <rect x="2" y="22" width="28" height="2.4" fill="#334155" />
        <circle cx="16" cy="7" r="1.7" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-26-qr-door",
    name: "26. Smart Container ID",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="4" width="24" height="24" rx="3" fill="#0B3A5B" />
        <rect x="7" y="7" width="6" height="6" fill="#F8FAFC" />
        <rect x="19" y="7" width="6" height="6" fill="#F8FAFC" />
        <rect x="7" y="19" width="6" height="6" fill="#F8FAFC" />
        <rect x="19" y="19" width="3" height="3" fill="#0EA5E9" />
        <rect x="23" y="23" width="3" height="3" fill="#F59E0B" />
        <rect x="19" y="23" width="3" height="3" fill="#F97316" />
      </svg>
    ),
  },
  {
    id: "clt-27-s-wave",
    name: "27. Dual Wave S",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="4.5"
          strokeLinecap="round"
          d="M23 8c-8 0-8 8 0 8s8 8 0 8"
        />
        <circle cx="23" cy="8" r="2.4" fill="#F59E0B" />
        <circle cx="23" cy="24" r="2.4" fill="#0EA5E9" />
      </svg>
    ),
  },
  {
    id: "clt-28-chain",
    name: "28. Chain Link Trust",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect
          x="3"
          y="10"
          width="12"
          height="14"
          rx="6"
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="3"
        />
        <rect
          x="14"
          y="10"
          width="12"
          height="14"
          rx="6"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="3"
        />
        <circle cx="27" cy="17" r="3" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-29-net-shield",
    name: "29. Cargo Net Shield",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="#0B3A5B"
          d="M16 2 28 8v10c0 7-6 11-12 12C10 29 4 25 4 18V8z"
        />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.3"
          d="M16 6 8 11 16 16 24 11zM8 11v9l8 5M24 11v9l-8 5"
        />
        <circle cx="16" cy="16" r="1.7" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-30-pulse-route",
    name: "30. Live Route Pulse",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 18h5l3-8 4 14 3-10 3 6h8"
        />
        <circle cx="4" cy="18" r="2" fill="#0EA5E9" />
        <circle cx="27" cy="18" r="2" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "clt-31-twin-stack",
    name: "31. Twin Stack Container Ship",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M2 24 L8 17 H24 L30 24 Z" />
        <rect x="6" y="9" width="5" height="4" fill="#0EA5E9" />
        <rect x="12" y="9" width="5" height="4" fill="#F59E0B" />
        <rect x="18" y="9" width="5" height="4" fill="#0284C7" />
        <rect x="6" y="13" width="5" height="4" fill="#F97316" />
        <rect x="12" y="13" width="5" height="4" fill="#0EA5E9" />
        <rect x="18" y="13" width="5" height="4" fill="#F59E0B" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          d="M2 27c5-2 8-2 13 0s10 2 15 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-32-bow-wave",
    name: "32. Bow Wave Cutter",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M3 24 L24 24 L29 16 L10 10 Z" />
        <rect x="12" y="14" width="5" height="6" fill="#F59E0B" />
        <rect x="18" y="12" width="5" height="8" fill="#0EA5E9" />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M2 26c2-1 3-1 4 0M2 20l4 2M1 16l5 3"
        />
      </svg>
    ),
  },
  {
    id: "clt-33-skyline-deck",
    name: "33. Container Skyline Deck",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="3" y="18" width="5" height="10" fill="#0EA5E9" />
        <rect x="9" y="12" width="5" height="16" fill="#0284C7" />
        <rect x="15" y="16" width="5" height="12" fill="#F59E0B" />
        <rect x="21" y="8" width="5" height="20" fill="#0B3A5B" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          d="M2 28c6-2 8-2 12 0s10 2 16 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-34-full-freighter",
    name: "34. Fully Loaded Freighter",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0F172A" d="M2 22 L30 22 L26 12 L6 12 Z" />
        <rect x="8" y="14" width="3" height="3" fill="#0EA5E9" />
        <rect x="12" y="14" width="3" height="3" fill="#F59E0B" />
        <rect x="16" y="14" width="3" height="3" fill="#0284C7" />
        <rect x="20" y="14" width="3" height="3" fill="#F97316" />
        <rect x="8" y="18" width="3" height="3" fill="#F97316" />
        <rect x="12" y="18" width="3" height="3" fill="#0EA5E9" />
        <rect x="16" y="18" width="3" height="3" fill="#F59E0B" />
        <rect x="20" y="18" width="3" height="3" fill="#0284C7" />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeLinecap="round"
          d="M2 25c6-2 8-2 14 0s10 2 16 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-35-anchor-vessel",
    name: "35. Anchor Vessel Emblem",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M3 21 L29 21 L24 14 L8 14 Z" />
        <path
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 8v9M13 10h6M11 17a5 5 0 0 0 10 0"
        />
        <circle cx="16" cy="8" r="1.6" fill="#F59E0B" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          d="M2 24c5-2.5 8-2.5 13 0s10 2.5 15 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-36-night-voyage",
    name: "36. Night Voyage Freighter",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="23" cy="7" r="3.6" fill="#F8FAFC" />
        <circle cx="25" cy="5.5" r="3.2" fill="#0B3A5B" />
        <circle cx="7" cy="6" r="1" fill="#F8FAFC" />
        <circle cx="12" cy="4" r="0.8" fill="#F8FAFC" />
        <path fill="#0F172A" d="M3 22 L27 22 L23 15 H9Z" />
        <rect x="12" y="17" width="4" height="4" fill="#0EA5E9" />
        <rect x="17" y="17" width="4" height="4" fill="#F59E0B" />
        <path
          fill="none"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
          d="M2 25c5-2 8-2 13 0s10 2 15 0"
        />
      </svg>
    ),
  },
  {
    id: "clt-37-bow-front",
    name: "37. Frontal Bow View",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M16 4 L26 20 H6 Z" />
        <path fill="#0284C7" d="M3 20 H29 L26 26 H6 Z" />
        <rect x="13" y="10" width="6" height="8" fill="#F59E0B" />
        <path
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.6"
          strokeLinecap="round"
          d="M4 28h24"
        />
      </svg>
    ),
  },
  {
    id: "clt-38-mini-boat-badge",
    name: "38. Mini Cargo Boat Badge",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#0EA5E9" />
        <path fill="#F8FAFC" d="M8 20 L24 20 L21 25 H11 Z" />
        <rect x="13" y="12" width="6" height="6" fill="#F59E0B" />
        <path fill="none" stroke="#0B3A5B" strokeWidth="1.6" d="M9 12h14" />
      </svg>
    ),
  },
  {
    id: "clt-39-catamaran-cargo",
    name: "39. Catamaran Cargo Ferry",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0284C7" d="M2 26 6 19h4l-2 7z" />
        <path fill="#0284C7" d="M22 26 24 19h4l2 7z" />
        <rect x="4" y="19" width="24" height="3" fill="#0B3A5B" />
        <rect x="9" y="10" width="6" height="9" fill="#F59E0B" />
        <rect x="17" y="10" width="6" height="9" fill="#0EA5E9" />
      </svg>
    ),
  },
  {
    id: "clt-40-wake-trail",
    name: "40. Wake Trail Vessel",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M6 16 L20 16 L24 22 L4 22 Z" />
        <rect x="9" y="11" width="4" height="5" fill="#F59E0B" />
        <rect x="14" y="11" width="4" height="5" fill="#0EA5E9" />
        <path
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="1.4"
          strokeLinecap="round"
          d="M2 24c3 1 5 1 8 0M1 27c4 1.4 7 1.4 11 0"
        />
      </svg>
    ),
  },
];

/* ── 심플 아이콘 10종 ── */
const SIMPLE_LOGOS = [
  {
    id: "simple-01-anchor",
    name: "Anchor",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="7"
          r="3"
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.4"
        />
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.4"
          strokeLinecap="round"
          d="M16 10v16M9 15H6a10 10 0 0 0 10 10 10 10 0 0 0 10-10h-3M11 12h10"
        />
      </svg>
    ),
  },
  {
    id: "simple-02-container",
    name: "Container",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect
          x="5"
          y="9"
          width="22"
          height="14"
          rx="1.5"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="1.6"
          d="M11 9v14M21 9v14"
        />
      </svg>
    ),
  },
  {
    id: "simple-03-ship",
    name: "Ship",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M6 20h20l-3 6H9l-3-6z" />
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.2"
          strokeLinecap="round"
          d="M16 20V8m-5 5h10"
        />
      </svg>
    ),
  },
  {
    id: "simple-04-wave",
    name: "Wave",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
          strokeLinecap="round"
          d="M4 13c4-3 8-3 12 0s8 3 12 0"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.5"
          d="M4 20c4-3 8-3 12 0s8 3 12 0"
        />
      </svg>
    ),
  },
  {
    id: "simple-05-compass",
    name: "Compass",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.2"
        />
        <path fill="#F59E0B" d="m20 12-2 6-6 2 2-6 6-2z" />
      </svg>
    ),
  },
  {
    id: "simple-06-globe",
    name: "Globe",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.2"
        />
        <path
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="1.6"
          d="M4 16h24M16 4c4 3.5 4 20.5 0 24-4-3.5-4-20.5 0-24z"
        />
      </svg>
    ),
  },
  {
    id: "simple-07-crane",
    name: "Crane",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 28V6h18M12 6l-5 6"
        />
        <rect x="17" y="14" width="10" height="7" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "simple-08-lighthouse",
    name: "Lighthouse",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#0B3A5B" d="M13 28 14 11h4l1 17z" />
        <path fill="#F59E0B" d="M13.5 7 16 3l2.5 4z" />
      </svg>
    ),
  },
  {
    id: "simple-09-chain",
    name: "Chain",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <rect
          x="4"
          y="11"
          width="12"
          height="10"
          rx="5"
          fill="none"
          stroke="#0B3A5B"
          strokeWidth="2.4"
        />
        <rect
          x="16"
          y="11"
          width="12"
          height="10"
          rx="5"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="2.4"
        />
      </svg>
    ),
  },
  {
    id: "simple-10-pin",
    name: "Port Pin",
    Svg: () => (
      <svg className="section6-logoMark" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="#0B3A5B"
          d="M16 3a9 9 0 0 0-9 9c0 7 9 17 9 17s9-10 9-17a9 9 0 0 0-9-9z"
        />
        <circle cx="16" cy="12" r="3.2" fill="#F8FAFC" />
      </svg>
    ),
  },
];

const LOGOS = [...BRAND_LOGOS, ...CLT_LOGOS, ...SIMPLE_LOGOS];
const LOGO_SCATTER_POINTS = [
  { x: -65, y: -45 },
  { x: -35, y: -62 },
  { x: 0, y: -65 },
  { x: 35, y: -62 },
  { x: 65, y: -45 },
  { x: 68, y: 0 },
  { x: 65, y: 45 },
  { x: 35, y: 62 },
  { x: 0, y: 65 },
  { x: -35, y: 62 },
  { x: -65, y: 45 },
  { x: -68, y: 0 },
];

function LogoItem({ logo, colored, onActivate, index, gatherProgress }) {
  const Mark = logo.Svg;
  const scatterPoint = LOGO_SCATTER_POINTS[index % LOGO_SCATTER_POINTS.length];
  const spreadOffset = (Math.floor(index / LOGO_SCATTER_POINTS.length) % 5) * 3;
  const remaining = 1 - gatherProgress;
  const scatterX =
    (scatterPoint.x + Math.sign(scatterPoint.x) * spreadOffset) * remaining;
  const scatterY =
    (scatterPoint.y + Math.sign(scatterPoint.y) * spreadOffset) * remaining;

  return (
    <div
      className={`section6-logoItem${colored ? " colored" : ""}`}
      title={logo.name}
      onMouseEnter={onActivate}
      style={{
        "--logo-x": `${scatterX}vw`,
        "--logo-y": `${scatterY}vh`,
        "--logo-rotate": `${remaining * (index % 2 === 0 ? -140 : 140)}deg`,
        "--logo-scale": 0.55 + gatherProgress * 0.45,
        "--logo-opacity": 0.2 + gatherProgress * 0.8,
      }}
    >
      <span className="section6-logoTooltip" role="tooltip">
        {logo.name}
      </span>
      {Mark ? (
        <Mark />
      ) : (
        <img
          className="section6-logoMark"
          src={`/logo/${logo.file}`}
          alt={logo.name}
          draggable={false}
        />
      )}
    </div>
  );
}

/* ── 컴포넌트 ── */
export default function Section6() {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const [coloredLogos, setColoredLogos] = useState(() => new Set());

  const activateLogo = (id) => {
    setColoredLogos((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const titleOpacity = fadePhase(scrollPercent, 0, 8, 28, 38);
  const underlineProgress = easeOutCubic(mapRange(scrollPercent, 8, 28));

  const statsOpacity = fadePhase(scrollPercent, 32, 42, 62, 72);
  const counterProgress = easeOutCubic(mapRange(scrollPercent, 42, 62));

  const logosOpacity =
    scrollPercent < 68 ? 0 : scrollPercent < 78 ? (scrollPercent - 68) / 10 : 1;
  const logoGatherProgress = mapRange(scrollPercent, 68, 98);

  const [titleRevealed, setTitleRevealed] = useState(false);

  useEffect(() => {
    if (titleOpacity > 0.15) {
      setTitleRevealed(true);
    } else if (titleOpacity < 0.05) {
      setTitleRevealed(false);
    }
  }, [titleOpacity]);

  useEffect(() => {
    if (logosOpacity < 0.05) {
      setColoredLogos(new Set());
    }
  }, [logosOpacity]);

  return (
    <div className="section section6" ref={sectionRef}>
      <div className="section6-sticky">
        <div
          className="section6-phase section6-titlePhase"
          style={{
            opacity: titleOpacity,
            pointerEvents: titleOpacity > 0 ? "auto" : "none",
          }}
        >
          <h2
            className={`section6-title${titleRevealed ? " is-revealed" : ""}`}
            style={{
              "--underline-progress": underlineProgress,
              "--highlight-progress": `${underlineProgress * 100}%`,
            }}
          >
            <span className="section6-titleLine">
              {TITLE_WORDS.map((word, i) => (
                <span
                  key={word}
                  className="section6-titleWord"
                  style={{ "--w": i }}
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="section6-titleLine section6-titleLineAccent">
              <span className="section6-titleHighlight">our technology</span>.
            </span>
          </h2>
        </div>

        <div
          className={`section6-phase section6-statsPhase${statsOpacity > 0.15 ? " is-visible" : ""}`}
          style={{
            opacity: statsOpacity,
            pointerEvents: statsOpacity > 0 ? "auto" : "none",
          }}
        >
          <ul className="section6-stats">
            {STATS.map((stat, index) => {
              const current = Math.floor(stat.value * counterProgress);
              return (
                <li
                  key={stat.label}
                  className="section6-stat"
                  style={{ "--stat-index": index }}
                >
                  <p className="section6-statLabel">{stat.label}</p>
                  <p className="section6-statValue">
                    {current.toLocaleString()}
                    {stat.suffix && (
                      <span className="section6-statSuffix">{stat.suffix}</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="section6-phase section6-logosPhase"
          style={{
            opacity: logosOpacity,
            pointerEvents: logoGatherProgress > 0.95 ? "auto" : "none",
          }}
        >
          <p className="section6-logosLabel">a company with us</p>
          <div className="section6-logoGrid">
            {LOGOS.map((logo, index) => (
              <LogoItem
                key={logo.id}
                logo={logo}
                index={index}
                gatherProgress={logoGatherProgress}
                colored={coloredLogos.has(logo.id)}
                onActivate={() => activateLogo(logo.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
