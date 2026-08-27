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
  const thresholds = [21, 50, 73, 96];
  const active = thresholds.map((t, i) => (scrollPercent > t ? i + 1 : -1)).filter((i) => i >= 0);
  const boxWrapRef = useRef(null);
  const imgRefs = useRef([]);

  const WINDOWS = [[5, 27], [27, 50], [50, 75], [75, 100]];
  const stacked = scrollPercent >= WINDOWS[3][1];

  useEffect(() => {
    imgRefs.current.forEach((img, i) => {
      if (!img) return;
      img.classList.toggle("landed", scrollPercent >= WINDOWS[i][1]);
    });
    if (boxWrapRef.current) boxWrapRef.current.classList.toggle("stacked", stacked);
  }, [scrollPercent, stacked]);

  const imgStyle = (i) => {
    const [start, end] = WINDOWS[i];
    const p = Math.max(0, Math.min(1, (scrollPercent - start) / (end - start)));
    return { "--p": p };
  };

  return (
    <div className="section section1" ref={sectionRef}>
      <div className="textBox">
        {TEXTS.map((text, i) => (
          <p key={i} className={`text${i} ${i === 0 || active.includes(i) ? "active" : ""}`}>{text}</p>
        ))}
      </div>
      <div className="boxWrap" ref={boxWrapRef}>
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className="imgCard"
            style={imgStyle(i)}
            ref={(el) => { imgRefs.current[i] = el; }}
          >
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
