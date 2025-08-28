"use client";

import { useState } from "react";

export default function AiBbox() {
  const searchWord = [
    "button",
    "color",
    "chart",
    "grid",
    "table",
    "search",
    "header",
    "headerfooter",
    "headermain",
    "headermainfooter",
  ];
  const [tip, setTip] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const handleSubmit = (e) => {
    // aiInput값을 가져와서 searchWord에 값이랑 비교해서 3글자연속으로 있는지 확인

    const found = searchWord.find((item) => item.includes(aiInput));
    if (found) {
      // found가 button, color 일땐는 페이지 이동
      if (
        found === "button" ||
        found === "color" ||
        found === "chart" ||
        found === "grid" ||
        found === "table" ||
        found === "search"
      ) {
        window.location.href = `/components/${found}`;
      } else {
        window.location.href = `/layouts/${found}`;
      }
    } else {
      alert("no match");
      setTip(true);
    }
  };

  return (
    <div className="ai-box">
      <div className="ai-box-title">
        <h2 onClick={() => setTip(!tip)}>AI</h2>

        <div className="ai-box-input">
          <input
            type="text"
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Enter your prompt"
          />
        </div>
      </div>

      <div className={`tip ${tip ? "active" : ""}`}>
        검색어를 입력하고 Enter를 입력합니다. <br />
        예시: <strong>{searchWord.join(", ")}</strong> <br />
        but만 작성해도 button으로 인식합니다.
      </div>
    </div>
  );
}
