"use client";
import { useState } from "react";

import LeftMenu from "../../leftMenu";
import { useParams } from "next/navigation";
import { menuLayoutList, layoutContents } from "../../layouts/data";
import Comment from "../../comment";

export default function Components() {
  const { id } = useParams();
  const layoutContent = layoutContents.find((content) => content.title === id);

  const [isCopied, setIsCopied] = useState(false);
  const [like, setLike] = useState(layoutContent.like);

  const handleCopy = async () => {
    // 클립보드 복사
    await navigator.clipboard.writeText(layoutContent.code);
    setIsCopied(true);
    console.log("코드가 클립보드에 복사되었습니다!");

    // 좋아요 업데이트 작성부분
    setLike(like + 1);
    // 복사 상태 초기화
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="main-layout layout component-view">
      <LeftMenu title="layouts" menuList={menuLayoutList} />

      <div className="main-content">
        <div
          dangerouslySetInnerHTML={{
            __html: layoutContent.code
              .replace(/className=/g, "class=")
              .replace(/htmlFor/g, "For")
              .replace(/defaultChecked/g, "checked"),
          }}
        />

        <div className="code-box-container">
          <pre className="code-box">{layoutContent.code}</pre>
          <button className="copy-button" onClick={handleCopy}>
            {isCopied ? <span>✅ Copied!</span> : <span>Code Copy</span>}{" "}
            <span>📋{like}</span>
          </button>
        </div>

        <Comment url={id} like={layoutContent.like} />
      </div>
    </div>
  );
}
