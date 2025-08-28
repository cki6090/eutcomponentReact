"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PersonalQnA() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [QnAList, setQnAList] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenuList = async () => {
      const response = await axios.get(`http://localhost:3001/QnA`);
      setQnAList(response.data);
    };
    fetchMenuList();
  }, [loading]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    } else {
      const res = fetch(`http://localhost:3001/QnA`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          date: new Date().toISOString().slice(0, 10),
          answer: answer,
        }),
      });

      //초기화 부분
      setTitle("");
      setContent("");
      document.getElementById("title-input").value = "";
      document.getElementById("textarea-input").value = "";

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="QnA-form">
      <div className="QnA-form-title">✅ 1:1 문의하기</div>

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
          <div className="QnA-list-content-item" key={index}>
            <div className="QnA-list-content-title">
              {item.title} 📅 {item.date}
            </div>
            <div className="QnA-list-content-content">➡️ {item.content}</div>
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
