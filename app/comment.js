"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Comment({ url }) {
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  // useEffect가 handleSubmit가 실행될때도 한번 실행하기
  useEffect(() => {
    const fetchMenuList = async () => {
      const response = await axios.get(`http://localhost:3001/${url}`);
      setCommentList(response.data);
    };
    fetchMenuList();
  }, [comment]);

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    } else {
      const res = fetch(`http://localhost:3001/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          date: new Date().toISOString().slice(0, 10),
        }),
      });

      //초기화 부분
      setComment("");
      document.getElementById("comment-input").value = "";
    }
  };

  // 댓글 스크립트 부분 끝
  return (
    <div>
      <div className="comment-box">
        <div className="comment-list">
          {(!commentList || commentList.length === 0) && (
            <div style={{ textAlign: "center" }}>댓글을 로딩중입니다.</div>
          )}
          {commentList &&
            commentList.map((item, index) => (
              <div className="comment-item" key={index}>
                <div className="comment-item-content">{item.content}</div>
                <div className="comment-item-date">{item.date}</div>
              </div>
            ))}
        </div>

        <div className="comment-input-box">
          <input
            id="comment-input"
            type="text"
            placeholder="댓글을 입력 후 엔터를 눌러주세요"
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(); // ✅ Enter 입력 시 버튼과 같은 동작
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
