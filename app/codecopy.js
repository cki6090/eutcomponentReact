"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function CopyButton({ code, id }) {
  const params = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [like, setLike] = useState(0);
  const [loading, setLoading] = useState(false);

  // id prop이 있으면 그것을 사용하고, 없으면 useParams에서 가져옴
  const currentId = id || params.id;

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/${currentId}like`
        );
        setLike(response.data);
      } catch (error) {
        console.error("좋아요 정보를 불러오는데 실패했습니다:", error);
      }
    };

    if (currentId) {
      fetchLike();
    }
  }, [currentId]);

  const handleCopy = async () => {
    try {
      // 클립보드 복사
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      console.log("코드가 클립보드에 복사되었습니다!");

      // 좋아요 업데이트
      const res = await fetch(`http://localhost:3001/${currentId}like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          like: like.like + 1,
        }),
      });

      if (res.ok) {
        // 좋아요 상태 업데이트
        setLike((prev) => ({ ...prev, like: prev.like + 1 }));
      } else {
        console.error("좋아요 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("복사 또는 좋아요 업데이트 중 오류 발생:", error);

      // 클립보드 복사 실패 시 fallback
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const result = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (result) {
          setIsCopied(true);
          console.log("fallback으로 코드가 클립보드에 복사되었습니다!");
        } else {
          alert("클립보드 복사에 실패했습니다. 수동으로 복사해주세요.");
        }
      } catch (fallbackError) {
        console.error("fallback 복사도 실패:", fallbackError);
        alert("클립보드 복사에 실패했습니다. 수동으로 복사해주세요.");
      }
    }

    // 복사 상태 초기화
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button className="copy-button" onClick={handleCopy}>
      {isCopied ? <span>✅ Copied!</span> : <span>Code Copy</span>}{" "}
      <span>📋{like.like || 0}</span>
    </button>
  );
}
