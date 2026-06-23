"use client";

import { useState } from "react";
import "./teui.css";

const PALETTES = [
  {
    mainTitle: "Color Palette",
    themes: {
      light: {
        title: "테마별 변경 색상 (라이트)",
        sections: [
          {
            groupTitle: "Primary(Orange)",
            colors: ["#FCCFAE", "#DF813C", "#694E3A"],
          },
          {
            groupTitle: "Primary(Blue)",
            colors: ["#78B3FF", "#00B8E6", "#1A47AF"],
          },
          {
            groupTitle: "Primary(Green)",
            colors: ["#5EE4A9", "#63D7E8", "#28654A"],
          },
          {
            groupTitle: "Primary(Black)",
            colors: ["#A4B6CD", "#98F2FF", "#004D7D"],
          },
          {
            groupTitle: "Secondary 01(보조 강조 색상)",
            colors: ["#FBC55A", "#6EFAFF", "#00FFD4", "#43D0FF"],
          },
        ],
      },
      dark: {
        title: "테마별 변경 색상 (다크)",
        sections: [
          {
            groupTitle: "Primary(Orange)",
            colors: ["#FCCFAE", "#DF813C", "#694E3A"],
          },
          {
            groupTitle: "Primary(Blue)",
            colors: ["#78B3FF", "#00B8E6", "#1A47AF"],
          },
          {
            groupTitle: "Primary(Green)",
            colors: ["#5EE4A9", "#63D7E8", "#28654A"],
          },
          {
            groupTitle: "Primary(Black)",
            colors: ["#A4B6CD", "#98F2FF", "#004D7D"],
          },
          {
            groupTitle: "Secondary 01(보조 강조 색상)",
            colors: ["#FBC55A", "#6EFAFF", "#00FFD4", "#43D0FF"],
          },
        ],
      },
    },
  },
  {
    mainTitle: "공통 색상",
    themes: {
      light: {
        title: "(라이트)",
        sections: [
          {
            groupTitle: "Secondary 02(보조 강조 색상)",
            colors: ["#DDE0FF"],
          },
          {
            groupTitle: "Base(보조 강조 색상)",
            colors: ["#24364D", "#FFFFFF"],
          },
          {
            groupTitle: "Grey(중립 배경 및 보조 텍스트)",
            colors: ["#F8FAFC", "#F1F5F9", "#94A3B8"],
          },
          {
            groupTitle: "Stroke(경계선 및 구분선)",
            colors: ["#E4EBF2", "#CBD5E1"],
          },
          {
            groupTitle: "Blue(정보 및 링크)",
            colors: ["#0084AD", "#A3EAFF", "#DEF6FF"],
          },
          {
            groupTitle: "Green(성공 상태)",
            colors: ["#25910F", "#E0FFDA"],
          },
          {
            groupTitle: "Orange(경고 상태)",
            colors: ["#C67C22", "#FFEED8"],
          },
          {
            groupTitle: "Purple(특수 강조)",
            colors: ["#88009D", "#FBE2FF"],
          },
          {
            groupTitle: "Transparency(반투명 오버레이)",
            colors: [
              {
                value: "#94A3B8 · 12%",
                background: "rgba(148, 163, 184, 0.12)",
              },
              {
                value: "#94A3B8 · 24%",
                background: "rgba(148, 163, 184, 0.24)",
              },
              {
                value: "#24364D · 24%",
                background: "rgba(36, 54, 77, 0.24)",
              },
              {
                value: "#24364D · 32%",
                background: "rgba(36, 54, 77, 0.32)",
              },
            ],
          },
        ],
      },
      dark: {
        title: "(다크)",
        sections: [
          {
            groupTitle: "Secondary 02(보조 강조 색상)",
            colors: ["#46686D"],
          },
          {
            groupTitle: "Base(보조 강조 색상)",
            colors: ["#F1F7FF", "#323E4A"],
          },
          {
            groupTitle: "Grey(중립 배경 및 보조 텍스트)",
            colors: ["#222E3A", "#161C23", "#989DA4"],
          },
          {
            groupTitle: "Stroke(경계선 및 구분선)",
            colors: ["#515A63", "#7E8286"],
          },
          {
            groupTitle: "Blue(정보 및 링크)",
            colors: ["#8CD1FF", "#0C5970", "#2E4F9C"],
          },
          {
            groupTitle: "Green(성공 상태)",
            colors: ["#5BFF3A", "#426F46"],
          },
          {
            groupTitle: "Orange(경고 상태)",
            colors: ["#FFA48B", "#623C35"],
          },
          {
            groupTitle: "Purple(특수 강조)",
            colors: ["#F194FF", "#69536D"],
          },
          {
            groupTitle: "Transparency(반투명 오버레이)",
            colors: [
              {
                value: "#77889F · 40%",
                background: "rgba(119, 136, 159, 0.4)",
              },
              {
                value: "#77889F · 64%",
                background: "rgba(119, 136, 159, 0.64)",
              },
              {
                value: "#BFCFE6 · 16%",
                background: "rgba(191, 207, 230, 0.16)",
              },
              {
                value: "#BFCFE6 · 40%",
                background: "rgba(191, 207, 230, 0.4)",
              },
            ],
          },
        ],
      },
    },
  },
];

const THEME_TABS = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

function normalizeColor(color) {
  if (typeof color === "string") {
    return { value: color, background: color, transparent: false };
  }

  return {
    value: color.value,
    background: color.background,
    transparent: true,
  };
}

function isLightColor(color) {
  const hex = color.replace("#", "").slice(0, 6);
  if (hex.length !== 6 || Number.isNaN(parseInt(hex, 16))) {
    return true;
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function ColorSwatch({ color }) {
  const [copied, setCopied] = useState(false);
  const { value, background, transparent } = normalizeColor(color);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      className={`color-swatch${transparent ? " is-transparent" : ""}`}
      style={transparent ? undefined : { background }}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      }}
    >
      {transparent && (
        <div className="color-swatch-fill" style={{ background }} />
      )}
      <span className={isLightColor(value) ? "dark-text" : "light-text"}>
        {value}
      </span>
      {copied && <span className="color-swatch-copy">copy</span>}
    </div>
  );
}

function ColorPaletteComponent({ palette }) {
  const [theme, setTheme] = useState("light");
  const { mainTitle, themes } = palette;
  const { title, sections } = themes[theme];

  return (
    <div
      className={`color-palette-component${
        theme === "dark" ? " is-dark" : ""
      }`}
    >
      <div className="color-palette-header">
        <div className="color-palette-header-text">
          <h1>{mainTitle}</h1>
          <p className="color-palette-description">{title}</p>
        </div>

        <div
          className="color-palette-theme-tabs"
          role="tablist"
          aria-label={`${mainTitle} 색상 테마`}
        >
          {THEME_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={theme === tab.id}
              className={`color-palette-theme-tab${
                theme === tab.id ? " is-active" : ""
              }`}
              onClick={() => setTheme(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="color-palette-group">
        {sections.map((section) => (
          <div className="color-palette-block" key={section.groupTitle}>
            <div className="color-palette-group-title">{section.groupTitle}</div>
            <div className="color-palette-colors">
              {section.colors.map((color, index) => (
                <ColorSwatch
                  key={`${section.groupTitle}-${index}`}
                  color={color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeuiPage() {
  return (
    <div className="teui-page">
      {PALETTES.map((palette) => (
        <ColorPaletteComponent key={palette.mainTitle} palette={palette} />
      ))}
    </div>
  );
}
