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

const TEXTS = [
  "Theme Color",
  "Header · Footer",
  "Button · Input · Status",
  "Progress · Summary",
];
const TEXT_PHASES = [
  { inStart: 0, inEnd: 5, outStart: 20, outEnd: 25 },
  { inStart: 25, inEnd: 30, outStart: 45, outEnd: 50 },
  { inStart: 50, inEnd: 55, outStart: 70, outEnd: 75 },
  { inStart: 75, inEnd: 80, outStart: 100, outEnd: 100 },
];

const THEME_COLORS = [
  { name: "Primary", color: "#1a6fd4" },
  { name: "Accent", color: "#ff8a3d" },
  { name: "Success", color: "#1f9d6a" },
  { name: "Warning", color: "#d97706" },
  { name: "Danger", color: "#e11d48" },
  { name: "Surface", color: "#e2e8f0" },
];

function getDropStyle(progress) {
  const p = easeOutCubic(progress);
  return {
    "--drop-opacity": p,
    "--drop-y": `${(1 - p) * -48}px`,
  };
}

function getThemeDropStyle(progress) {
  const p = easeOutCubic(progress);
  return {
    "--drop-y": `${(1 - p) * -120}px`,
  };
}

/* ── 컴포넌트 ── */
export default function Section1() {
  const { sectionRef, scrollPercent } = useSectionScroll();

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

  const cardProgress = mapRange(scrollPercent, 0, 6);
  const blockProgress = [
    mapRange(scrollPercent, 4, 12),
    mapRange(scrollPercent, 28, 36),
    mapRange(scrollPercent, 52, 60),
    mapRange(scrollPercent, 76, 84),
  ];

  return (
    <div className="section section1" ref={sectionRef}>
      <div className="section1Sticky">
        <div className="textBox">
          {TEXTS.map((text, i) => (
            <p key={text} className={`text${i}`} style={textStyle(i)}>
              {text}
            </p>
          ))}
        </div>

        <div className="boxWrap">
          <div className="imgCard" style={getDropStyle(cardProgress)}>
            <div
              className="imgCardBlock"
              style={getDropStyle(blockProgress[0])}
            >
              <p className="imgCardLabel">Theme Color</p>
              <div className="imgCardThemeRow">
                {THEME_COLORS.map((item, i) => (
                  <div
                    key={item.name}
                    className="imgCardThemeItem"
                    style={getThemeDropStyle(
                      mapRange(scrollPercent, 10 + i * 2, 16 + i * 2),
                    )}
                  >
                    <span
                      className="imgCardThemeSwatch"
                      style={{ background: item.color }}
                    />
                    <strong>{item.name}</strong>
                    <em>{item.color}</em>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="imgCardBlock"
              style={getDropStyle(blockProgress[1])}
            >
              <p className="imgCardLabel">Header · Footer</p>
              <div className="imgCardHalf">
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 34, 42))}
                >
                  <span className="imgCardPanelTitle">Header</span>
                  <div className="imgCardChrome header">
                    <strong>Project Name</strong>
                    <div className="imgCardNav">
                      <span className="is-active">Home</span>
                      <span>Theme</span>
                      <span>Guide</span>
                    </div>
                  </div>
                </div>
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 40, 48))}
                >
                  <span className="imgCardPanelTitle">Footer</span>
                  <div className="imgCardChrome footer">
                    <span>© Component Page</span>
                    <div className="imgCardBtnRow">
                      <button type="button" className="imgCardBtn ghost">
                        Cancel
                      </button>
                      <button type="button" className="imgCardBtn primary">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="imgCardBlock"
              style={getDropStyle(blockProgress[2])}
            >
              <p className="imgCardLabel">Button · Input · Status</p>
              <div className="imgCardTriple">
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 58, 66))}
                >
                  <span className="imgCardPanelTitle">Button</span>
                  <button type="button" className="imgCardBtn primary">
                    Primary
                  </button>
                  <button type="button" className="imgCardBtn ghost">
                    Ghost
                  </button>
                </div>
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 62, 70))}
                >
                  <span className="imgCardPanelTitle">Input</span>
                  <label className="imgCardField">
                    <span>Search</span>
                    <input type="text" defaultValue="Booking No." readOnly />
                  </label>
                  <label className="imgCardField">
                    <span>Type</span>
                    <select defaultValue="general" disabled>
                      <option value="general">General</option>
                    </select>
                  </label>
                </div>
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 66, 74))}
                >
                  <span className="imgCardPanelTitle">Status</span>
                  <div className="imgCardStatusRow">
                    <span className="imgCardStatus ok">Ready</span>
                    <span className="imgCardStatus warn">Pending</span>
                  </div>
                  <div className="imgCardChipRow">
                    <span className="imgCardChip">EDI</span>
                    <span className="imgCardChip on">Hold</span>
                    <span className="imgCardChip">VIP</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="imgCardBlock"
              style={getDropStyle(blockProgress[3])}
            >
              <p className="imgCardLabel">Progress · Summary</p>
              <div className="imgCardHalf">
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 82, 90))}
                >
                  <span className="imgCardPanelTitle">Progress</span>
                  <div className="imgCardMeter">
                    <div className="imgCardMeterHead">
                      <span>Capacity</span>
                      <strong>68%</strong>
                    </div>
                    <div className="imgCardProgress">
                      <i style={{ width: "68%" }} />
                    </div>
                  </div>
                  <div className="imgCardMeter">
                    <div className="imgCardMeterHead">
                      <span>Sync</span>
                      <strong>42%</strong>
                    </div>
                    <div className="imgCardProgress accent">
                      <i style={{ width: "42%" }} />
                    </div>
                  </div>
                </div>
                <div
                  className="imgCardPanel"
                  style={getDropStyle(mapRange(scrollPercent, 88, 96))}
                >
                  <span className="imgCardPanelTitle">Summary</span>
                  <ul className="imgCardList">
                    <li>
                      <em>Theme</em>
                      <strong>Ocean Blue</strong>
                    </li>
                    <li>
                      <em>Mode</em>
                      <strong>Light</strong>
                    </li>
                    <li>
                      <em>Components</em>
                      <strong>Ready</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
