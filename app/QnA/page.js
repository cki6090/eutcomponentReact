"use client";
import { useState } from "react";
import { QnAList } from "./data";
import PersonalQnA from "./PersonalQnA";

export default function QnA() {
  const [tab, setTab] = useState("자주하는 질문");
  const QnAtitle = ["자주하는 질문", "문의하기"];

  return (
    <div className="main-layout">
      <div className="main-content">
        <div className="QnA-tab">
          {QnAtitle.map((item, index) => (
            <div
              key={index}
              className={tab === item ? "on" : ""}
              onClick={() => setTab(item)}
            >
              {item}
            </div>
          ))}
        </div>

        {tab === "자주하는 질문" && (
          <div className="QnA-list">
            <div className="QnA-list-content">
              {QnAList.map((item, index) => (
                <div
                  key={index}
                  className="QnA-list-content-item"
                  style={{ "--time": index }}
                >
                  <div className="QnA-list-content-title">⁉️ {item.title}</div>
                  <div className="QnA-list-content-content">
                    ➡️ {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "문의하기" && <PersonalQnA />}
      </div>
    </div>
  );
}
