"use client";

import { useState, useEffect } from "react";
import { comment as componentComments } from "./components/data.js";
import { comment as layoutComments } from "./layouts/data.js";

export default function Comment({ url }) {
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");

  // useEffect가 handleSubmit가 실행될때도 한번 실행하기
  useEffect(() => {
    const fetchCommentList = () => {
      // components와 layouts 데이터에서 해당 url의 댓글 찾기
      let comments = [];
      if (componentComments[url]) {
        comments = componentComments[url];
      } else if (layoutComments[url]) {
        comments = layoutComments[url];
      }
      setCommentList(comments);
      console.log(comments);
    };

    fetchCommentList();
  }, []);

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    } else {
      // 새로운 댓글을 리스트에 추가
      const newComment = {
        id: commentList.length,
        content: comment,
        date: new Date().toISOString().slice(0, 10),
      };

      // setCommentList를 함수형 업데이트로 변경 (최신 상태 보장)
      // newComment를 배열에 추가해줍니다.
      const updatedList = [...commentList, newComment];
      setCommentList(updatedList);

      console.log(setCommentList);

      // 입력값 초기화
      setComment("");
      if (document.getElementById("comment-input")) {
        document.getElementById("comment-input").value = "";
      }
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
