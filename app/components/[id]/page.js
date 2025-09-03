"use client";
import { useState } from "react";

import LeftMenu from "../../leftMenu";
import { useParams } from "next/navigation";
import { menuComponentList, componentContents } from "../../components/data";

import Grid from "../../components/grid";
import Table from "../../components/table";
import Chart from "../../components/chart";
import Comment from "../../comment";

export default function Components() {
  const { id } = useParams();
  const componentContent = componentContents.find(
    (content) => content.title === id
  );

  const [isCopied, setIsCopied] = useState(false);
  const [like, setLike] = useState(componentContent.like);

  const handleCopy = async () => {
    // 클립보드 복사
    await navigator.clipboard.writeText(componentContent.code);
    setIsCopied(true);

    // 좋아요 업데이트 작성부분
    setLike(like + 1);

    // 복사 상태 초기화
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };

  return (
    <div className="main-layout component-view">
      <LeftMenu title="components" menuList={menuComponentList} />

      <div className="main-content">
        <div
          dangerouslySetInnerHTML={{
            __html: componentContent.code
              .replace(/className=/g, "class=")
              .replace(/htmlFor/g, "For")
              .replace(/defaultChecked/g, "checked"),
          }}
        />
        {/* //url에서 각각gird table 일때만 grid.js table.js 파일을 인폴트 해오기 */}
        {id === "grid" && <Grid />}
        {id === "table" && <Table />}
        {id === "chart" && <Chart />}
        <div className="code-box-container">
          <pre className="code-box">{componentContent.code}</pre>

          <button className="copy-button" onClick={handleCopy}>
            {isCopied ? <span>✅ Copied!</span> : <span>Code Copy</span>}{" "}
            <span>📋{like}</span>
          </button>
        </div>

        <Comment url={id} />
      </div>
    </div>
  );
}
