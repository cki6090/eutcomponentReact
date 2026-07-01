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

/* ── SCRIPT : 다국어 콘텐츠 ── */
const LOCALES = [
  {
    code: "ko",
    label: "한국어",
    flag: "🇰🇷",
    title: "다국어 지원",
    lines: [
      "스크롤에 따라 언어가 자연스럽게 전환됩니다.",
      "컴포넌트 하나로 한·영·일을 모두 제공할 수 있어요.",
      "locale JSON과 React Context로 손쉽게 확장 가능합니다.",
      "→ t('welcome.message')  // こんにちは / Hello / 안녕하세요.",
    ],
  },
  {
    code: "en",
    label: "English",
    flag: "🇺🇸",
    title: "Multilingual",
    lines: [
      "Languages switch smoothly as you scroll.",
      "One component serves Korean, English, and Japanese.",
      "Extend easily with locale JSON and React Context.",
      "→ t('welcome.message')  // Hello / 안녕하세요. / こんにちは",
    ],
  },
  {
    code: "ja",
    label: "日本語",
    flag: "🇯🇵",
    title: "多言語対応",
    lines: [
      "スクロールに合わせて言語が切り替わります。",
      "1つのコンポーネントで韓国語・英語・日本語に対応。",
      "locale JSON と React Context で簡単に拡張できます。",
      "→ t('welcome.message')  // こんにちは / Hello / 안녕하세요.",
    ],
  },
];

function getLocaleState(scrollPercent) {
  const segment = 100 / LOCALES.length;
  const activeIndex = Math.min(LOCALES.length - 1, Math.floor(scrollPercent / segment));
  const segmentStart = activeIndex * segment;
  const segmentProgress =
    scrollPercent <= segmentStart
      ? 0
      : Math.min(100, ((scrollPercent - segmentStart) / segment) * 100);

  return { activeIndex, segmentProgress };
}

function getTypedHtml(scrollPercent, lines) {
  const totalLength = lines.join("").length;
  const currentLength = Math.floor(Math.min(scrollPercent / 100, 1) * totalLength);
  let result = "";
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const str = lines[i];
    if (count + str.length < currentLength) {
      result += str + "<br>";
      count += str.length;
    } else {
      result += str.slice(0, currentLength - count);
      break;
    }
  }
  return result;
}

function getFullHtml(lines) {
  return getTypedHtml(100, lines);
}

/* ── 컴포넌트 ── */
export default function Section5() {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const { activeIndex, segmentProgress } = getLocaleState(scrollPercent);
  const locale = LOCALES[activeIndex];
  const wrapOpacity = scrollPercent >= 1 ? 1 : 0;
  const prevLocale = activeIndex > 0 ? LOCALES[activeIndex - 1] : null;

  const [shownIndex, setShownIndex] = useState(0);
  const [titleFading, setTitleFading] = useState(false);

  useEffect(() => {
    if (activeIndex === shownIndex) return;
    setTitleFading(true);
    const timer = setTimeout(() => {
      setShownIndex(activeIndex);
      setTitleFading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [activeIndex, shownIndex]);

  return (
    <div className="section section5" ref={sectionRef}>
      <div className="titleTextWrap" style={{ opacity: wrapOpacity }}>
        <div>
          <p className={`titleText${titleFading ? " is-fading" : ""}`}>
            {LOCALES[shownIndex].title}
          </p>

          <div className="localeTabs">
            {LOCALES.map((loc, i) => (
              <span
                key={loc.code}
                className={`localeTab ${i === activeIndex ? "active" : ""}`}
              >
                <span className="localeFlag">{loc.flag}</span>
                {loc.label}
              </span>
            ))}
          </div>

          <div className="titleTextContentWrap">
            {prevLocale && (
              <p
                className="titleTextContent ghost"
                dangerouslySetInnerHTML={{ __html: getFullHtml(prevLocale.lines) }}
              />
            )}
            <p
              className="titleTextContent active"
              dangerouslySetInnerHTML={{
                __html: getTypedHtml(segmentProgress, locale.lines),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
