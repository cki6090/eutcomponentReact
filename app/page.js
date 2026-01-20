"use client";

import AiBbox from "./aiBbox";
import { useState, useEffect } from "react";

export default function Home() {
   const [progress, setProgress] = useState(0);
   const ranges = [
     { start: 1, end: 20 },
     { start: 20, end: 40 },
     { start: 40, end: 60 },
     { start: 60, end: 80 },
     { start: 80, end: 100 },
   ];

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;

        setProgress(Math.min(100, Math.max(0, percent)));
        console.log(percent);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);




  const getThumbTranslateY = (index) => {

    const maxTranslate = 500;
    const { start, end } = ranges[index];

    // 시작 구간 전이면 이동 없음(0)
    if (progress < start) return 0;
    // 끝 구간 지나면 최대치까지 이동
    if (progress > end) return maxTranslate;

    // 현재 진행 정도를 범위 내에서 비율(0~1)로 변환
    const percentInRange = (progress - start) / (end - start);
    // 비율에 따라 maxTranslate만큼 곱해서 실제 이동 거리 산출
    return Math.round(percentInRange * maxTranslate);
  };

  const getImageTransform = () => {
    const { start, end } = ranges[0];
    const startRotate = -10;
    const endRotate = 0;
    const startTranslate = -1;
    const endTranslate = -50;

    if (progress < start) {
      return `translate(${startTranslate}%, 0) rotate(${startRotate}deg)`;
    }

    if (progress > end) {
      return `translate(${endTranslate}%, 0) rotate(${endRotate}deg)`;
    }

    const percentInRange = (progress - start) / (end - start);
    const rotate = startRotate + (endRotate - startRotate) * percentInRange;
    const translate =
      startTranslate + (endTranslate - startTranslate) * percentInRange;

    return `translate(${translate}%, 0) rotate(${rotate}deg)`;
  };

  return (
    <div
      className="index-page"
    
    >
      <div className="index-ci">
        <div className="index-page-content">
          <h1>
            Project Name
            <br></br>
            <span>Component Page</span>
          </h1>
          <p>
            TECHNOLOGY STACK <br></br>
            React, Next.js, TypeScript, CSS
            <br></br>
            NextAuth.js, json-server, axios, recharts, react-live
          </p>
          <AiBbox />
        </div>

        <div className="index-page-image" style={{ transform: getImageTransform() }}>
           <div className="progress-wrapper">
            {/* <div
              className="progress-bar"
              style={{ width: `${progress}%`, backgroundColor: "red", height: "20px" }}
            />
            <span className="progress-value">
              {Math.round(progress)}%
            </span> */}
          </div>

          <ul className="thumbs">
            <li style={{ transform: `translateY(-${getThumbTranslateY(1)}px)` }}>
              <img src="/indeximg4.png" alt="thumb1" />
            </li>
            <li style={{ transform: `translateY(-${getThumbTranslateY(2)}px)` }}>
              <img src="/indeximg2.jpg" alt="thumb2" />
            </li>
            <li style={{ transform: `translateY(-${getThumbTranslateY(3)}px)` }}>
              <img src="/indeximg3.jpg" alt="thumb3" />
            </li>
             <li style={{ transform: `translateY(-${getThumbTranslateY(4)}px)` }}>
              <img src="/indeximg5.png" alt="thumb4" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
