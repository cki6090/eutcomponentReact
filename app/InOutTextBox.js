"use client";

import React, { useEffect, useState, useRef } from "react";

const texts = [
  "첫 번째 텍스트",
  "두 번째 텍스트",
  "세 번째 텍스트",
  "네 번째 텍스트",
  "다섯 번째 텍스트",
];

export default function InOutTextBox() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const initialPositionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const box = document.querySelector(".InOutTextBox");
      const firstText = document.querySelector(".InOutText");

      if (box && firstText) {
        const scrollTop = window.scrollY;

        // 초기 위치를 한 번만 저장
        if (initialPositionRef.current === null) {
          initialPositionRef.current = firstText.offsetTop;
        }

        const firstTextTop = initialPositionRef.current;

        // 첫 번째 InOutText 상단에 도달했는지 확인
        if (scrollTop >= firstTextTop) {
          if (!isFixed) {
            setIsFixed(true);
          }

          // position: fixed 상태에서 스크립트 동작
          const progress = scrollTop - firstTextTop;
          const step = box.offsetHeight / texts.length;
          const index = Math.min(Math.floor(progress / step), texts.length - 1);
          setActiveIndex(index);
        } else {
          if (isFixed) {
            setIsFixed(false);
            setActiveIndex(0);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed]);

  return (
    <div className={`InOutTextBox ${isFixed ? "fixed" : ""}`}>
      {texts.map((text, index) => (
        <div
          key={index}
          className={`InOutText ${
            index === activeIndex ? "active" : index < activeIndex ? "out" : ""
          }`}
        >
          {text}
        </div>
      ))}
    </div>
  );
}
