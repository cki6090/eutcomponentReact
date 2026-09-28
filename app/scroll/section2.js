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

/* ── SCRIPT : 스크롤 비디오 ── */
const VIDEO_DURATION = 10;
const FRAME_COUNT = 240;
/** 60fps 기준 추종 속도. 너무 낮으면 늦게 따라오고, 1이면 즉시 반응 */
const FOLLOW = 0.22;
/** 휠을 멈춘 뒤 관성으로 더 진행할 스크롤 % (대략 한 칸) */
const COAST_PERCENT = 1.6;
const COAST_DURATION_MS = 480;
const COAST_IDLE_MS = 70;
const COAST_MIN_VELOCITY = 0.002;
const MAX_CAPTURE_WIDTH = 1920;

function getVideoDisplaySize(videoWidth, videoHeight) {
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;
  const videoRatio = videoWidth / videoHeight;
  const viewRatio = viewWidth / viewHeight;

  let displayWidth = viewWidth;
  let displayHeight = viewHeight;

  if (viewRatio > videoRatio) {
    displayWidth = viewWidth;
    displayHeight = Math.round(viewWidth / videoRatio);
  } else {
    displayHeight = viewHeight;
    displayWidth = Math.round(viewHeight * videoRatio);
  }

  return { displayWidth, displayHeight };
}

function getAverageColor(ctx, width, height) {
  const data = ctx.getImageData(0, 0, width, height).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 16) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count += 1;
  }

  return `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
}

function useScrollVideo(videoSrc, scrollPercent, sectionRef) {
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
    const captureCtx = captureCanvas.getContext("2d", {
      alpha: false,
      willReadFrequently: false,
    });
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = 32;
    colorCanvas.height = 32;
    const colorCtx = colorCanvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });

    const startCapture = () => {
      const videoWidth = source.videoWidth;
      const videoHeight = source.videoHeight;
      if (!videoWidth || !videoHeight || cancelled) return;

      const { displayWidth, displayHeight } = getVideoDisplaySize(
        videoWidth,
        videoHeight,
      );
      const scale = Math.min(1, MAX_CAPTURE_WIDTH / displayWidth);
      const captureWidth = Math.round(displayWidth * scale);
      const captureHeight = Math.round(displayHeight * scale);

      canvas.width = captureWidth;
      canvas.height = captureHeight;
      captureCanvas.width = captureWidth;
      captureCanvas.height = captureHeight;
      captureCtx.imageSmoothingEnabled = true;
      captureCtx.imageSmoothingQuality = "high";

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

          captureCtx.drawImage(source, 0, 0, captureWidth, captureHeight);
          colorCtx.drawImage(captureCanvas, 0, 0, 32, 32);
          colorsRef.current[idx] = getAverageColor(colorCtx, 32, 32);

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
    else
      source.addEventListener("loadedmetadata", startCapture, { once: true });

    return () => {
      cancelled = true;
      framesRef.current.forEach((bmp) => bmp?.close?.());
      framesRef.current = [];
    };
  }, [videoSrc]);

  const targetPercentRef = useRef(scrollPercent);
  const velocityRef = useRef(0);
  const lastPercentRef = useRef(scrollPercent);
  const lastScrollTimeRef = useRef(performance.now());
  const coastRef = useRef(null);
  const isCoastingRef = useRef(false);

  useEffect(() => {
    const handleCancelCoast = () => {
      if (!isCoastingRef.current) return;
      isCoastingRef.current = false;
      coastRef.current = null;
    };
    window.addEventListener("wheel", handleCancelCoast, { passive: true });
    window.addEventListener("touchstart", handleCancelCoast, { passive: true });
    window.addEventListener("keydown", handleCancelCoast);
    return () => {
      window.removeEventListener("wheel", handleCancelCoast);
      window.removeEventListener("touchstart", handleCancelCoast);
      window.removeEventListener("keydown", handleCancelCoast);
    };
  }, []);

  useEffect(() => {
    const now = performance.now();

    if (isCoastingRef.current) {
      lastPercentRef.current = scrollPercent;
      lastScrollTimeRef.current = now;
      targetPercentRef.current = scrollPercent;
      return;
    }

    const elapsed = Math.max(8, now - lastScrollTimeRef.current);
    velocityRef.current = (scrollPercent - lastPercentRef.current) / elapsed;
    lastPercentRef.current = scrollPercent;
    lastScrollTimeRef.current = now;
    coastRef.current = null;
    targetPercentRef.current = scrollPercent;
  }, [scrollPercent]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!canvas || !ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

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

    const startTarget = (targetPercentRef.current / 100) * (FRAME_COUNT - 1);
    smoothIndexRef.current = startTarget;
    const startFrame = Math.round(startTarget);
    lastFrameRef.current = startFrame;
    drawFrame(startFrame);

    let rafId;
    let lastTime = performance.now();
    const loop = (now) => {
      const dt = Math.min(2.5, (now - lastTime) / 16.67);
      lastTime = now;

      const idleMs = now - lastScrollTimeRef.current;
      const sectionEl = sectionRef.current;
      if (
        !coastRef.current &&
        sectionEl &&
        idleMs > COAST_IDLE_MS &&
        Math.abs(velocityRef.current) >= COAST_MIN_VELOCITY
      ) {
        const realHeight = sectionEl.offsetHeight - window.innerHeight;
        if (realHeight > 0) {
          const direction = Math.sign(velocityRef.current);
          const speedBoost = Math.min(1.2, Math.abs(velocityRef.current) * 220);
          const coastAmount = COAST_PERCENT + speedBoost * 0.5;
          const startY = window.scrollY;
          const endY = startY + direction * ((coastAmount / 100) * realHeight);
          coastRef.current = {
            startY,
            endY,
            startTime: now,
          };
          isCoastingRef.current = true;
          velocityRef.current = 0;
        }
      }

      if (coastRef.current) {
        const coast = coastRef.current;
        const progress = Math.min(
          1,
          (now - coast.startTime) / COAST_DURATION_MS,
        );
        const eased = 1 - Math.pow(1 - progress, 3);
        const nextY = coast.startY + (coast.endY - coast.startY) * eased;
        window.scrollTo(0, nextY);
        if (progress >= 1) {
          coastRef.current = null;
          isCoastingRef.current = false;
        }
      }

      const target = Math.max(
        0,
        Math.min(
          FRAME_COUNT - 1,
          (targetPercentRef.current / 100) * (FRAME_COUNT - 1),
        ),
      );

      let current = smoothIndexRef.current;
      const diff = target - current;
      if (Math.abs(diff) < 0.001) {
        current = target;
      } else {
        const follow = 1 - Math.pow(1 - FOLLOW, dt);
        current += diff * follow;
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
    return () => {
      cancelAnimationFrame(rafId);
      isCoastingRef.current = false;
      coastRef.current = null;
    };
  }, [ready, sectionRef]);

  return { sourceRef, canvasRef, wrapRef };
}

/* ── 컴포넌트 ── */
export default function Section2({ videoSrc = "/video/scroller3.mp4" }) {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const { sourceRef, canvasRef, wrapRef } = useScrollVideo(
    videoSrc,
    scrollPercent,
    sectionRef,
  );

  return (
    <div className="section section2" ref={sectionRef}>
      <div className="videoWrap" ref={wrapRef}>
        <canvas className="scrollVideoCanvas" ref={canvasRef} />
        <video
          className="scrollVideoSource"
          ref={sourceRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
}
