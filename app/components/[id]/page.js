"use client";
import LeftMenu from "@/app/leftMenu";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Components() {
  const [menuList, setMenuList] = useState([]);
  const [componentContents, setComponentContents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMenuList = async () => {
      const response = await axios.get("http://localhost:3001/menuList");
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
    navigator.clipboard.writeText(codeText);
    //alert("코드가 복사되었습니다.");

    //data-name 해당 값이 배열 내에 존재하는지 확인하거나, 존재한다면 해당 값의 인덱스를 찾아오기
    const dataName = document
      .querySelector(".copy-button")
      .getAttribute("data-name");

    const indexNum = menuList.findIndex((item) => item.link === dataName);
    const updatedLike = (menuList[indexNum].like || 0) + 1;

    axios.patch(`http://localhost:3001/menuList/${indexNum}`, {
      like: updatedLike,
    });

    router.refresh();
  };

  //url 파라미터 가져오기
  const { id } = useParams();
  //url 파라미터랑 setComponentContents 비교해서 같은 것 찾기
  const componentContent = componentContents.find(
    (content) => content.title === id
  );

  return (
    <div className="main-layout">
      <LeftMenu title="components" menuList={menuList} />

      <div className="main-content">
        <div className="page-title">{componentContent?.title}</div>
        <div className="image-box">
          <img src={componentContent?.image} width="80%" />
        </div>

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
  );
}
