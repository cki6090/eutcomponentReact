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

const TEXTS = [
  "Import Framework",
  "Import header and footer",
  "Import content area",
  "Creating a Content Area",
];
const TEXT_PHASES = [
  { inStart: 0, inEnd: 5, outStart: 20, outEnd: 25 },
  { inStart: 25, inEnd: 30, outStart: 45, outEnd: 50 },
  { inStart: 50, inEnd: 55, outStart: 70, outEnd: 75 },
  { inStart: 75, inEnd: 80, outStart: 100, outEnd: 100 },
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

  const WINDOWS = [
    [0, 25],
    [25, 50],
    [50, 75],
    [75, 100],
  ];

  const textStyle = (i) => {
    const phase = TEXT_PHASES[i];
    const enter = Math.max(
      0,
      Math.min(
        1,
        (scrollPercent - phase.inStart) / (phase.inEnd - phase.inStart),
      ),
    );
    const exit =
      phase.outStart === phase.outEnd
        ? 1
        : 1 -
          Math.max(
            0,
            Math.min(
              1,
              (scrollPercent - phase.outStart) /
                (phase.outEnd - phase.outStart),
            ),
          );
    const easedEnter = 1 - Math.pow(1 - enter, 3);
    const segmentStart = i * 25;
    const segmentProgress = Math.max(
      0,
      Math.min(1, (scrollPercent - segmentStart) / 25),
    );

    return {
      "--text-opacity": easedEnter * exit,
      "--text-y": `${-30 * (1 - segmentProgress)}px`,
      "--text-blur": `${5 * (1 - easedEnter * exit)}px`,
    };
  };

  const imgStyle = (i) => {
    const [start, end] = WINDOWS[i];
    const p = Math.max(0, Math.min(1, (scrollPercent - start) / (end - start)));
    return { "--p": p };
  };

  return (
    <div className="section section1" ref={sectionRef}>
      <div className="textBox">
        {TEXTS.map((text, i) => (
          <p key={text} className={`text${i}`} style={textStyle(i)}>
            {text}
          </p>
        ))}
      </div>
      <div className="boxWrap">
        {IMAGES.map((src, i) => (
          <div key={src} className="imgCard" style={imgStyle(i)}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
