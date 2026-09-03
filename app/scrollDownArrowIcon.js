import React from "react";

export default function ScrollDownArrowIcon({ className = "" }) {
  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight + 150, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes arrow-bounce-down {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }

        @keyframes scroll-label-wave {
          0%, 30%, 100% { transform: translateY(0) rotate(0); }
          7% { transform: translateY(-7px) rotate(-3deg); }
          14% { transform: translateY(3px) rotate(2deg); }
          21% { transform: translateY(-2px) rotate(-1deg); }
        }

        .scroll-down-arrow-icon {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          color: #64748b;
        }

        .scroll-down-arrow-icon .scroll-down-label {
          display: inline-flex;
          gap: 0.45em;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .scroll-down-arrow-icon .scroll-down-label-word {
          display: inline-block;
          transform-origin: center bottom;
          animation: scroll-label-wave 3s cubic-bezier(0.22, 1, 0.36, 1) infinite both;
        }

        .scroll-down-arrow-icon .scroll-down-label-word:nth-child(1) {
          animation-delay: 0.2s;
        }

        .scroll-down-arrow-icon .scroll-down-label-word:nth-child(2) {
          animation-delay: 0.48s;
        }

        .scroll-down-arrow-icon .scroll-down-arrow {
          animation: arrow-bounce-down 1.6s ease-in-out infinite;
        }
      `}</style>
      <div
        className={`scroll-down-arrow-icon ${className}`}
        aria-label="Scroll down"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <span className="scroll-down-label">
          <span className="scroll-down-label-word">Scroll</span>
          <span className="scroll-down-label-word">down</span>
        </span>
        <svg
          className="scroll-down-arrow"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4v10M10 14l-5-5M10 14l5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
