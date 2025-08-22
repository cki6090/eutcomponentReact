"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function CopyButton({ code }) {
  const { id } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [like, setLike] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const like = async () => {
      const response = await axios.get(`http://localhost:3001/${id}like`);
      setLike(response.data);
    };
    like();
  }, [loading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // json-server에서 좋아요(like) 갯수를 PATCH로 업데이트
    const res = fetch(`http://localhost:3001/${id}like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        like: like.like + 1,
      }),
    });
  };

  return (
    <button className="copy-button" onClick={handleCopy}>
      {loading ? <span> ⏳Copying.... </span> : <span>Code Copy</span>}{" "}
      <span>📋{like.like}</span>
    </button>
  );
}
