"use client";
import { useState } from "react";
import { ContactUs } from "./data";

export default function PersonalQnA() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [QnAList, setQnAList] = useState(ContactUs);
  const [loading, setLoading] = useState(false);


  const handleSubmit = () => {
  
    if (!title.trim() || !content.trim()) {
      //포커스 가서 보더 빨간색 처리
      if (!title.trim()) {
        document.getElementById("title-input").style.border = "1px solid red";
      }
      
      if (!content.trim()) {
        document.getElementById("textarea-input").style.border = "1px solid red";
      }
      return;
    } else {
      // 새로운 QnA 항목을 로컬 상태에 추가
      const newQnA = {
        id: QnAList.length,
        title: title,
        content: content,
        date: new Date().toISOString().slice(0, 10),
        answer: "",
      };

      setQnAList([...QnAList, newQnA]);

      //초기화 부분
      setTitle("");
      setContent("");
      document.getElementById("title-input").value = "";
      document.getElementById("textarea-input").value = "";

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="QnA-form">
      <div className="QnA-form-title">🤔 1:1 문의하기</div>

      <div className="QnA-form-box">
        <div className="QnA-form-input">
          <input
            id="title-input"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="제목을 입력해주세요"
          />
        </div>
        <div className="QnA-form-textarea">
          <textarea
            id="textarea-input"
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="내용을 입력해주세요"
          ></textarea>
        </div>
        <div className="QnA-form-button">
          <button
            className="button-default success "
            onClick={() => {
              handleSubmit();
            }}
          >
            {loading ? "등록 완료 시 아래 리스트에 추가됩니다." : "문의하기"}
          </button>
        </div>
      </div>

      <div className="QnA-list-content">
        {QnAList.map((item, index) => (
          <div
            className="QnA-list-content-item"
            key={index}
            style={{ "--time": index }}
          >
            <div className="QnA-list-content-title">
              {item.title}{" "}
              <div className="QnA-list-content-date">📅 {item.date}</div>
            </div>

            <div className="QnA-list-content-content">⁉️ {item.content}</div>

            <div className="QnA-list-content-answer">
              {item.answer
                ? `✅ ${item.answer}`
                : "❌ 답변이 아직 등록되지 않았습니다."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
