"use client";
import LeftMenu from "../../leftMenu";
import { useParams } from "next/navigation";
import { menuLayoutList, layoutContents } from "../../layouts/data";

import Comment from "../../comment";
import CopyButton from "../../codecopy";

export default function Components() {
  const { id } = useParams();
  const layoutContent = layoutContents.find((content) => content.title === id);

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
          <CopyButton code={layoutContent.code} />
        </div>

        <Comment url={id} />
      </div>
    </div>
  );
}
