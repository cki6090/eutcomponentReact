"use client";
import LeftMenu from "../../leftMenu";
import { useParams } from "next/navigation";
import { menuComponentList, componentContents } from "../../components/data";

import Grid from "../../components/grid";
import Table from "../../components/table";
import Chart from "../../components/chart";
import Comment from "../../comment";
import CopyButton from "../../codecopy";

export default function Components() {
  const { id } = useParams();
  const componentContent = componentContents.find(
    (content) => content.title === id
  );

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
          <CopyButton code={componentContent.code} />
        </div>

        <Comment url={id} />
      </div>
    </div>
  );
}
