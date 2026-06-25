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

/* ── SCRIPT : 스크롤 비디오 ── */
const VIDEO_DURATION = 10;
const FRAME_COUNT = 120;

function useScrollVideo(videoSrc, scrollPercent) {
  const sourceRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const framesRef = useRef([]);
  const colorsRef = useRef([]);
  const lastFrameRef = useRef(-1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const source = sourceRef.current;
    const canvas = canvasRef.current;
    if (!source || !canvas) return;

    let cancelled = false;
    const captureCanvas = document.createElement("canvas");
    const captureCtx = captureCanvas.getContext("2d");

    const startCapture = () => {
      const w = source.videoWidth;
      const h = source.videoHeight;
      if (!w || !h || cancelled) return;

      const displayH = Math.round(window.innerHeight * 0.75);
      const displayW = Math.round((w / h) * displayH);
      canvas.width = displayW;
      canvas.height = displayH;
      captureCanvas.width = displayW;
      captureCanvas.height = displayH;

      let frameIndex = 0;
      const captureNext = () => {
        if (cancelled || frameIndex >= FRAME_COUNT) {
          if (!cancelled) setReady(true);
          return;
        }
        source.currentTime = (frameIndex / (FRAME_COUNT - 1)) * VIDEO_DURATION;
        source.onseeked = () => {
          if (cancelled) return;
          captureCtx.drawImage(source, 0, 0, displayW, displayH);
          const data = captureCtx.getImageData(0, 0, displayW, displayH).data;
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 64) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
          }
          colorsRef.current[frameIndex] = `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
          createImageBitmap(captureCanvas).then((bitmap) => {
            if (cancelled) return;
            framesRef.current[frameIndex++] = bitmap;
            captureNext();
          });
        };
      };
      captureNext();
    };

    if (source.readyState >= 1) startCapture();
    else source.addEventListener("loadedmetadata", startCapture, { once: true });
    return () => { cancelled = true; };
  }, [videoSrc]);

  useEffect(() => {
    if (!ready || scrollPercent < 0 || scrollPercent >= 100) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !framesRef.current.length) return;

    const index = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round((scrollPercent / 100) * (FRAME_COUNT - 1))));
    if (index === lastFrameRef.current) return;
    lastFrameRef.current = index;
    ctx.drawImage(framesRef.current[index], 0, 0, canvas.width, canvas.height);
    if (wrapRef.current && colorsRef.current[index]) {
      wrapRef.current.style.backgroundColor = colorsRef.current[index];
    }
  }, [ready, scrollPercent]);

  return { sourceRef, canvasRef, wrapRef };
}

/* ── 컴포넌트 ── */
export default function Section2({ videoSrc = "/video/scroller3.mp4" }) {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const { sourceRef, canvasRef, wrapRef } = useScrollVideo(videoSrc, scrollPercent);

  return (
    <div className="section section2" ref={sectionRef}>
      <div className="videoWrap" ref={wrapRef}>
        <canvas className="scrollVideoCanvas" ref={canvasRef} />
        <video className="scrollVideoSource" ref={sourceRef} src={videoSrc} muted playsInline preload="auto" />
      </div>
    </div>
  );
}
