"use client";
import AiBbox from "./aiBbox";
import Scroll from "./scroll/scroll";
import ScrollDownArrowIcon from "./scrollDownArrowIcon";
import ScrollToTopButton from "./scrollToTopButton";

export default function Home() {
  return (
    <div className="index-page">
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
          <div className="scrollDownArrow">
            <ScrollDownArrowIcon />
          </div>
        </div>
        <Scroll />
      </div>
      <ScrollToTopButton />
    </div>
  );
}
