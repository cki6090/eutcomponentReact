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
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
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

const STATS = [
  { label: "고객", value: 35, suffix: "" },
  { label: "하루평균 사용시간", value: 151810, suffix: "분" },
  { label: "업무 처리율", value: 1851, suffix: "건" },
];

const LOGOS = [
  { name: "React", file: "react.svg" },
  { name: "Vue", file: "vue.svg" },
  { name: "Angular", file: "angular.svg" },
  { name: "Next.js", file: "nextjs.svg" },
  { name: "Svelte", file: "svelte.svg" },
  { name: "Nuxt.js", file: "nuxtjs.svg" },
  { name: "Laravel", file: "laravel.svg" },
  { name: "Vite", file: "vite.svg" },
  { name: "Astro", file: "astro.svg" },
  { name: "Rails", file: "rails.svg" },
  { name: "HTMX", file: "htmx.svg" },
  { name: "Lit", file: "lit.svg" }
  
];

function LogoItem({ logo, colored, onActivate }) {
  return (
    <div
      className={`section6-logoItem${colored ? " colored" : ""}`}
      title={logo.name}
      onMouseEnter={onActivate}
    >
      <span className="section6-logoTooltip" role="tooltip">
        {logo.name}
      </span>
      <img src={`/logo/${logo.file}`} alt={logo.name} draggable={false} />
    </div>
  );
}

/* ── 컴포넌트 ── */
export default function Section6() {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const [coloredLogos, setColoredLogos] = useState(() => new Set());

  const activateLogo = (file) => {
    setColoredLogos((prev) => {
      if (prev.has(file)) return prev;
      const next = new Set(prev);
      next.add(file);
      return next;
    });
  };

  const titleOpacity = fadePhase(scrollPercent, 0, 8, 28, 38);
  const titleY = (1 - Math.min(1, titleOpacity)) * 32;

  const statsOpacity = fadePhase(scrollPercent, 32, 42, 62, 72);
  const counterProgress = easeOutCubic(mapRange(scrollPercent, 42, 62));

  const logosOpacity =
    scrollPercent < 68 ? 0 : scrollPercent < 78 ? (scrollPercent - 68) / 10 : 1;

  return (
    <div className="section section6" ref={sectionRef}>
      <div className="section6-sticky">
        {/* 1. 타이틀 */}
        <div
          className="section6-phase section6-titlePhase"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            pointerEvents: titleOpacity > 0 ? "auto" : "none",
          }}
        >
          <h2 className="section6-title">
            Empowering innovators worldwide with <span className="section6-titleHighlight">our technology</span>.
       
          </h2>
        </div>

        {/* 2. 카운터 */}
        <div
          className="section6-phase section6-statsPhase"
          style={{
            opacity: statsOpacity,
            pointerEvents: statsOpacity > 0 ? "auto" : "none",
          }}
        >
          <ul className="section6-stats">
            {STATS.map((stat) => {
              const current = Math.floor(stat.value * counterProgress);
              return (
                <li key={stat.label} className="section6-stat">
                  <p className="section6-statLabel">{stat.label}</p>
                  <p className="section6-statValue">
                    {current.toLocaleString()}
                    {stat.suffix && <span className="section6-statSuffix">{stat.suffix}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3. 로고 그리드 */}
        <div
          className="section6-phase section6-logosPhase"
          style={{
            opacity: logosOpacity,
            pointerEvents: logosOpacity > 0 ? "auto" : "none",
          }}
        >
          <p className="section6-logosLabel">a company with us</p>
          <div className="section6-logoGrid">
            {LOGOS.map((logo) => (
              <LogoItem
                key={logo.file}
                logo={logo}
                colored={coloredLogos.has(logo.file)}
                onActivate={() => activateLogo(logo.file)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
