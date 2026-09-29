"use client";
import AiBbox from "./aiBbox";
import ReportResult from "./reportResult";
import Scroll from "./scroll/scroll";
import ScrollDownArrowIcon from "./scrollDownArrowIcon";
import ScrollToTopButton from "./scrollToTopButton";

export default function Home() {
  return (
    <div className="index-page">
      <div className="index-ci">
        <div className="index-page-content">
          <div className="index-page-content-top">
            <h1>
              Project Name
              <br></br>
              <span>Scroll Event Page</span>
            </h1>

            <AiBbox />
          </div>

          <div className="scrollDownArrow">
            <ScrollDownArrowIcon />
          </div>
        </div>
        <Scroll />
        <ReportResult />
      </div>
      <ScrollToTopButton />
    </div>
  );
}
