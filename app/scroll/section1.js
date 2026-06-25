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

const TEXTS = [
  "Scroll Events page",
  "Import Framework",
  "Import header and footer",
  "Import content area",
  "Creating a Content Area",
];

const IMAGES = [
  "/img/ldcdbg01.png",
  "/img/ldcdbg02.png",
  "/img/ldcdbg03.png",
  "/img/ldcdbg04.png",
];

/* ── 컴포넌트 ── */
export default function Section1() {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const thresholds = [21, 44, 70, 94];
  const active = thresholds.map((t, i) => (scrollPercent > t ? i + 1 : -1)).filter((i) => i >= 0);

  const imgStyle = (i) => {
    if (i === 0 && scrollPercent >= 27) return { left: "0%", opacity: 1 };
    if (i === 0 && scrollPercent >= 5 && scrollPercent < 27) {
      let v = 100 - ((scrollPercent - 5) / 22) * 110;
      if (v <= 10) v = 0; else if (v >= 90) v = 100;
      return { left: `${Math.round(v)}%`, opacity: 1 };
    }
    if (i === 1 && scrollPercent >= 50) return { left: "0%", opacity: 1 };
    if (i === 1 && scrollPercent >= 27 && scrollPercent < 50) {
      let v = 100 - ((scrollPercent - 27) / 23) * 110;
      if (v <= 10) v = 0; else if (v >= 90) v = 100;
      return { left: `${Math.round(v)}%`, opacity: 1 };
    }
    if (i === 2 && scrollPercent >= 75) return { left: "0%", opacity: 1 };
    if (i === 2 && scrollPercent >= 50 && scrollPercent < 75) {
      let v = 100 - ((scrollPercent - 50) / 25) * 110;
      if (v <= 10) v = 0; else if (v >= 90) v = 100;
      return { left: `${Math.round(v)}%`, opacity: 1 };
    }
    if (i === 3 && scrollPercent >= 100) return { opacity: 1 };
    if (i === 3 && scrollPercent >= 75) {
      let v = (scrollPercent - 75) / 25;
      if (v <= 0.2) return { opacity: 0 };
      if (v >= 0.8) return { opacity: 1 };
      return { opacity: v };
    }
    if (i === 3) return { opacity: 0 };
    return undefined;
  };

  return (
    <div className="section section1" ref={sectionRef}>
      <div className="textBox">
        {TEXTS.map((text, i) => (
          <p key={i} className={`text${i} ${i === 0 || active.includes(i) ? "active" : ""}`}>{text}</p>
        ))}
      </div>
      <div className="boxWrap">
        {IMAGES.map((src, i) => (
          <img key={src} src={src} alt="" style={imgStyle(i)} />
        ))}
      </div>
    </div>
  );
}
