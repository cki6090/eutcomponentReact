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
const FRAME_COUNT = 160;
/** 스크롤 추종 — 너무 낮으면 늦게 따라오고, 1이면 즉시 반응 */
const LERP = 0.18;

function useScrollVideo(videoSrc, scrollPercent) {
  const sourceRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const framesRef = useRef([]);
  const colorsRef = useRef([]);
  const smoothIndexRef = useRef(0);
  const lastFrameRef = useRef(-1);
  const lastColorRef = useRef("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const source = sourceRef.current;
    const canvas = canvasRef.current;
    if (!source || !canvas) return;

    let cancelled = false;
    const captureCanvas = document.createElement("canvas");
    const captureCtx = captureCanvas.getContext("2d", { alpha: false });

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

      framesRef.current = new Array(FRAME_COUNT);
      colorsRef.current = new Array(FRAME_COUNT);

      let frameIndex = 0;
      const captureNext = () => {
        if (cancelled || frameIndex >= FRAME_COUNT) {
          if (!cancelled) setReady(true);
          return;
        }
        const idx = frameIndex;
        source.currentTime = (idx / (FRAME_COUNT - 1)) * VIDEO_DURATION;
        source.onseeked = () => {
          if (cancelled) return;
          captureCtx.drawImage(source, 0, 0, displayW, displayH);
          const data = captureCtx.getImageData(0, 0, displayW, displayH).data;
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 80) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
          }
          colorsRef.current[idx] = `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
          createImageBitmap(captureCanvas).then((bitmap) => {
            if (cancelled) {
              bitmap.close?.();
              return;
            }
            framesRef.current[idx] = bitmap;
            frameIndex = idx + 1;
            captureNext();
          });
        };
      };
      captureNext();
    };

    if (source.readyState >= 1) startCapture();
    else source.addEventListener("loadedmetadata", startCapture, { once: true });

    return () => {
      cancelled = true;
      framesRef.current.forEach((bmp) => bmp?.close?.());
      framesRef.current = [];
    };
  }, [videoSrc]);

  const targetPercentRef = useRef(scrollPercent);
  useEffect(() => {
    targetPercentRef.current = scrollPercent;
  }, [scrollPercent]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const drawFrame = (frame) => {
      const bmp = framesRef.current[frame];
      if (!bmp) return;
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);

      const color = colorsRef.current[frame];
      if (wrapRef.current && color && color !== lastColorRef.current) {
        lastColorRef.current = color;
        wrapRef.current.style.backgroundColor = color;
      }
    };

    // 첫 화면
    const startTarget = (targetPercentRef.current / 100) * (FRAME_COUNT - 1);
    smoothIndexRef.current = startTarget;
    const startFrame = Math.round(startTarget);
    lastFrameRef.current = startFrame;
    drawFrame(startFrame);

    let rafId;
    const loop = () => {
      const target = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, (targetPercentRef.current / 100) * (FRAME_COUNT - 1))
      );

      let current = smoothIndexRef.current;
      const diff = target - current;
      if (Math.abs(diff) < 0.001) {
        current = target;
      } else {
        current += diff * LERP;
      }
      smoothIndexRef.current = current;

      const frame = Math.round(current);
      if (frame !== lastFrameRef.current) {
        lastFrameRef.current = frame;
        drawFrame(frame);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [ready]);

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
