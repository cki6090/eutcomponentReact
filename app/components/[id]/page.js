"use client";
import LeftMenu from "@/app/leftMenu";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Grid from "@/app/components/grid";
import Table from "@/app/components/table";
import Button from "@/app/components/button";

export default function Components() {
  const [menuList, setMenuList] = useState([]);
  const [componentContents, setComponentContents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMenuList = async () => {
      const response = await axios.get(
        "http://localhost:3001/menuComponentList"
      );
      const response2 = await axios.get(
        "http://localhost:3001/componentContents"
      );
      setMenuList(response.data);
      setComponentContents(response2.data);
    };

    fetchMenuList();
  }, []);

  const copyCode = () => {
    const codeElement = document.querySelector(".code-box");
    const codeText = codeElement.textContent;
    if (
      navigator &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard.writeText(codeText);
    } else {
      // navigator.clipboard가 지원되지 않을 때 fallback 처리
      const textarea = document.createElement("textarea");
      textarea.value = codeText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    alert("코드가 복사되었습니다.");

    //data-name 해당 값이 배열 내에 존재하는지 확인하거나, 존재한다면 해당 값의 인덱스를 찾아오기
    const dataName = document
      .querySelector(".copy-button")
      .getAttribute("data-name");

    const indexNum = menuList.findIndex((item) => item.link === dataName);
    const updatedLike = (menuList[indexNum].like || 0) + 1;

    axios.patch(`http://localhost:3001/menuComponentList/${indexNum}`, {
      like: updatedLike,
    });
  };

  //url 파라미터 가져오기
  const { id } = useParams();
  //url 파라미터랑 setComponentContents 비교해서 같은 것 찾기
  const componentContent = componentContents.find(
    (content) => content.title === id
  );
  console.log(id);
  return (
    <div className="main-layout">
      <LeftMenu title="components" menuList={menuList} />

      <div className="main-content">
        {componentContent && (
          <div
            className="component-view"
            dangerouslySetInnerHTML={{ __html: componentContent.code }}
          />
        )}

        {/* //url에서 각각gird table 일때만 grid.js table.js 파일을 인폴트 해오기 */}
        {id === "grid" && <Grid />}
        {id === "table" && <Table />}
        {id === "button" && <Button />}

        <div className="code-box-container">
          <pre className="code-box">{componentContent?.code}</pre>

          <button
            className="copy-button"
            onClick={copyCode}
            data-name={componentContent?.title}
          >
            코드 소스 복사
          </button>
        </div>
      </div>
    </div>
  );
}
