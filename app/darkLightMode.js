"use client";

import { useState } from "react";

export default function DarkLightMode() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // true 일때 html 에 darkmode 클래스 추가
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  return (
    <div>
      {darkMode ? (
        <div className="darkmode" onClick={toggleDarkMode}>
          🌙
        </div>
      ) : (
        <div className="lightmode" onClick={toggleDarkMode}>
          🌞
        </div>
      )}
    </div>
  );
}
