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

const WORDS = ["Apply", "a", "variety", "of", "theme", "colors"];
const THRESHOLDS = [16, 32, 48, 64, 80, 96];

/* ── 컴포넌트 ── */
export default function Section3() {
  const { sectionRef, scrollPercent } = useSectionScroll();

  return (
    <div className="section section3" ref={sectionRef}>
      <div className="themeBoxtitle">
        {WORDS.map((word, i) => (
          <span key={word} style={{ opacity: scrollPercent >= THRESHOLDS[i] ? 1 : 0.1 }}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
