"use client";

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import "../globals.css";

const code = `
<div className="main-layout">
  <div className="main-content">
    <header>
      <h1>헤더 영역</h1>
      <p>이곳은 헤더 콘텐츠가 들어갑니다.</p>
    </header>
    
    <main>
      <h1>메인 영역</h1>
      <p>이곳은 메인 콘텐츠가 들어갑니다.</p>
    </main>
    
    <footer>
      <div className="footer-menu">
        <ul>
          <li>
            <button>메뉴1</button>
            <button>메뉴2</button>
            <button>메뉴3</button>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</div>
`;

export default function LiveCode() {
  return (
    <LiveProvider code={code} noInline={false}>
      <div className="live-code-container">
        <div className="live-editor">
          <LiveEditor />
        </div>

        <div className="live-preview">
          <LivePreview />
        </div>
      </div>

      <LiveError
        style={{
          color: "red",
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid red",
          borderRadius: "5px",
          margin: "10px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </LiveProvider>
  );
}
