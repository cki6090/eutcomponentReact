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

/* ── SCRIPT : 부채꼴 clip-path ── */
function mapRange(p, start, end) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

function easeInOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getFanClipPath(startDeg, sweepDeg, cx = 100, cy = 100, radius = 220) {
  if (sweepDeg <= 0) {
    return `polygon(${cx}% ${cy}%, ${cx}% ${cy}%, ${cx}% ${cy}%)`;
  }
  if (sweepDeg >= 359.5) return "inset(0)";

  const points = [`${cx.toFixed(1)}% ${cy.toFixed(1)}%`];
  const steps = Math.max(12, Math.ceil(sweepDeg / 12));
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + (sweepDeg * i) / steps;
    const rad = (deg * Math.PI) / 180;
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return `polygon(${points.join(", ")})`;
}

const LAYER_IMAGES = [
  "/img/theme01.png",
  "/img/theme01_1.png",
  "/img/theme02.png",
  "/img/theme02_1.png",
  "/img/theme03.png",
  "/img/theme03_1.png",
  "/img/theme04.png",
  "/img/theme04_1.png",
  "/img/theme05.png",
  "/img/theme05_1.png",
  "/img/theme06.png",
  "/img/theme06_1.png",
];

function getCardClipPath(i, scrollPercent, layerCount) {
  const overlapStart = 0.15;
  const revealDuration = 100 / (1 + (layerCount - 1) * overlapStart);
  const stagger = revealDuration * overlapStart;
  const fanStart = 180;
  const fanSweepMax = 270;

  if (i === 0) return "inset(0)";

  const segStart = i * stagger;
  const segEnd = segStart + revealDuration;

  if (scrollPercent < segStart) return getFanClipPath(fanStart, 0);
  if (scrollPercent >= segEnd) return "inset(0)";
  const eased = easeInOutCubic(mapRange(scrollPercent, segStart, segEnd));
  return getFanClipPath(fanStart, eased * fanSweepMax);
}

/* ── 컴포넌트 ── */
export default function Section4() {
  const { sectionRef, scrollPercent } = useSectionScroll();

  return (
    <div className="section section4" ref={sectionRef}>
      <div className="layer-sticky">
        <div className="layer-stack">
          {LAYER_IMAGES.map((src, i) => (
            <div
              key={src}
              className="layer-card"
              style={{ clipPath: getCardClipPath(i, scrollPercent, LAYER_IMAGES.length) }}
            >
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
