"use client";

import { useState } from "react";
import styles from "./teui.module.css";

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

const FONT_WEIGHTS = {
  SemiBold: 600,
  Bold: 700,
  Medium: 500,
  Regular: 400,
};

const TEXT_STYLES = {
  mainTitle: "Text Styles",
  title:
    "Pretendard 폰트 기반 텍스트 스타일 14종 — Title · Body · Label · List 카테고리로 구성됩니다.",
  previewText: "가나다라마바사아 AaBbCcDd 1234",
  sections: [
    {
      groupTitle: "Title",
      styles: [
        { size: 22, weightName: "SemiBold" },
        { size: 16, weightName: "Bold" },
        { size: 14, weightName: "Bold" },
        { size: 12, weightName: "Bold" },
      ],
    },
    {
      groupTitle: "Body",
      styles: [
        { size: 14, weightName: "SemiBold" },
        { size: 14, weightName: "Medium" },
        { size: 13, weightName: "SemiBold" },
        { size: 12, weightName: "SemiBold" },
        { size: 12, weightName: "Medium" },
        { size: 12, weightName: "Regular" },
      ],
    },
    {
      groupTitle: "Label",
      styles: [
        { size: 10, weightName: "SemiBold" },
        { size: 10, weightName: "Regular" },
      ],
    },
    {
      groupTitle: "List",
      styles: [
        { size: 12, weightName: "SemiBold" },
        { size: 12, weightName: "Medium" },
      ],
    },
  ],
};

const EFFECT_STYLES = {
  mainTitle: "Effect Styles",
  title: "Effect Styles",
  sections: [
    {
      groupTitle: "Drop Shadow",
      effects: [
        {
          spec: [
            "border-radius: 16px;",
            "background: #FFF;",
            "box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.40);",
          ],
          previewStyle: {
            borderRadius: "16px",
            background: "#FFF",
            boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.40)",
          },
        },
        {
          spec: [
            "border-radius: 16px;",
            "background: #FFF;",
            "box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.24);",
          ],
          previewStyle: {
            borderRadius: "16px",
            background: "#FFF",
            boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.24)",
          },
        },
      ],
    },
  ],
};

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
      className={`${styles.colorSwatch}${transparent ? ` ${styles.isTransparent}` : ""}`}
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
        <div className={styles.colorSwatchFill} style={{ background }} />
      )}
      <span className={isLightColor(value) ? styles.darkText : styles.lightText}>
        {value}
      </span>
      {copied && <span className={styles.colorSwatchCopy}>copy</span>}
    </div>
  );
}

function ColorPaletteComponent({ palette }) {
  const [theme, setTheme] = useState("light");
  const { mainTitle, themes } = palette;
  const { title, sections } = themes[theme];

  return (
    <div
      className={`${styles.colorPaletteComponent}${theme === "dark" ? ` ${styles.isDark}` : ""}`}
    >
      <div className={styles.colorPaletteHeader}>
        <div className={styles.colorPaletteHeaderText}>
          <h1>{mainTitle}</h1>
          <p className={styles.colorPaletteDescription}>{title}</p>
        </div>

        <div
          className={styles.colorPaletteThemeTabs}
          role="tablist"
          aria-label={`${mainTitle} 색상 테마`}
        >
          {THEME_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={theme === tab.id}
              className={`${styles.colorPaletteThemeTab}${theme === tab.id ? ` ${styles.isActive}` : ""}`}
              onClick={() => setTheme(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.colorPaletteGroup}>
        {sections.map((section) => (
          <div className={styles.colorPaletteBlock} key={section.groupTitle}>
            <div className={styles.colorPaletteGroupTitle}>{section.groupTitle}</div>
            <div className={styles.colorPaletteColors}>
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

function TextStylesComponent() {
  const { mainTitle, title, previewText, sections } = TEXT_STYLES;

  return (
    <div className={styles.textStylesComponent}>
      <div className={styles.textStylesHeader}>
        <h1>{mainTitle}</h1>
        <p className={styles.textStylesDescription}>{title}</p>
      </div>

      <div className={styles.textStylesGroup}>
        {sections.map((section) => (
          <div className={styles.textStylesBlock} key={section.groupTitle}>
            <div className={styles.textStylesGroupTitle}>{section.groupTitle}</div>
            <div className={styles.textStylesList}>
              {section.styles.map((style, index) => (
                <div
                  className={styles.textStyleItem}
                  key={`${section.groupTitle}-${index}`}
                >
                  <div className={styles.textStyleSpec}>
                    크기 {style.size}px 굵기 {style.weightName}
                  </div>
                  <div
                    className={styles.textStylePreview}
                    style={{
                      fontSize: `${style.size}px`,
                      fontWeight: FONT_WEIGHTS[style.weightName],
                    }}
                  >
                    {previewText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EffectStylesComponent() {
  const { mainTitle, title, sections } = EFFECT_STYLES;

  return (
    <div className={styles.effectStylesComponent}>
      <div className={styles.effectStylesHeader}>
        <h1>{mainTitle}</h1>
        <p className={styles.effectStylesDescription}>{title}</p>
      </div>

      <div className={styles.effectStylesGroup}>
        {sections.map((section) => (
          <div className={styles.effectStylesBlock} key={section.groupTitle}>
            <div className={styles.effectStylesGroupTitle}>{section.groupTitle}</div>
            <div className={styles.effectStylesList}>
              {section.effects.map((effect, index) => (
                <div
                  className={styles.effectStyleItem}
                  key={`${section.groupTitle}-${index}`}
                >
                  <div className={styles.effectStyleSpec}>
                    {effect.spec.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                  <div className={styles.effectStylePreviewWrap}>
                    <div
                      className={styles.effectStylePreview}
                      style={effect.previewStyle}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Teui() {
  return (
    <div className={styles.teuiPage}>
      {PALETTES.map((palette) => (
        <ColorPaletteComponent key={palette.mainTitle} palette={palette} />
      ))}
      <TextStylesComponent />
      <EffectStylesComponent />
    </div>
  );
}
