"use client";
import AiBbox from "./aiBbox";
import Scroll from "./scroll";

export default function Home() {
  return (
    <div
      className="index-page"
      onScroll={() => console.log("index-page scroll")}
    >
      <div className="index-ci">
        <div className="index-page-content">
          <h1>
            Project Name
            <br></br>
            <span>Component Page</span>
          </h1>
          <p>
            TECHNOLOGY STACK <br></br>
            React, Next.js, TypeScript, CSS
            <br></br>
            NextAuth.js, json-server, axios, recharts, react-live
          </p>
          <AiBbox />
        </div>
        <Scroll />
      </div>
    </div>
  );
}
