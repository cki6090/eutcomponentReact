"use client";

import { useState } from "react";
import "./teui.css";

// ─────────────────────────────────────────
// 1. 데이터 (화면에 보여줄 내용)
// ─────────────────────────────────────────

const PALETTES = [
  {
    mainTitle: "Color Palette",
    themes: {
      light: {
        title: "테마별 변경 색상 (라이트)",
        sections: [
          { groupTitle: "Primary(Orange)", colors: ["#FCCFAE", "#DF813C", "#694E3A"] },
          { groupTitle: "Primary(Blue)", colors: ["#78B3FF", "#00B8E6", "#1A47AF"] },
          { groupTitle: "Primary(Green)", colors: ["#5EE4A9", "#63D7E8", "#28654A"] },
          { groupTitle: "Primary(Black)", colors: ["#A4B6CD", "#98F2FF", "#004D7D"] },
          {
            groupTitle: "Secondary 01(보조 강조 색상)",
            colors: ["#FBC55A", "#6EFAFF", "#00FFD4", "#43D0FF"],
          },
        ],
      },
      dark: {
        title: "테마별 변경 색상 (다크)",
        sections: [
          { groupTitle: "Primary(Orange)", colors: ["#FCCFAE", "#DF813C", "#694E3A"] },
          { groupTitle: "Primary(Blue)", colors: ["#78B3FF", "#00B8E6", "#1A47AF"] },
          { groupTitle: "Primary(Green)", colors: ["#5EE4A9", "#63D7E8", "#28654A"] },
          { groupTitle: "Primary(Black)", colors: ["#A4B6CD", "#98F2FF", "#004D7D"] },
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
          { groupTitle: "Secondary 02(보조 강조 색상)", colors: ["#DDE0FF"] },
          { groupTitle: "Base(보조 강조 색상)", colors: ["#24364D", "#FFFFFF"] },
          { groupTitle: "Grey(중립 배경 및 보조 텍스트)", colors: ["#F8FAFC", "#F1F5F9", "#94A3B8"] },
          { groupTitle: "Stroke(경계선 및 구분선)", colors: ["#E4EBF2", "#CBD5E1"] },
          { groupTitle: "Blue(정보 및 링크)", colors: ["#0084AD", "#A3EAFF", "#DEF6FF"] },
          { groupTitle: "Green(성공 상태)", colors: ["#25910F", "#E0FFDA"] },
          { groupTitle: "Orange(경고 상태)", colors: ["#C67C22", "#FFEED8"] },
          { groupTitle: "Purple(특수 강조)", colors: ["#88009D", "#FBE2FF"] },
          {
            groupTitle: "Transparency(반투명 오버레이)",
            colors: [
              { value: "#94A3B8 · 12%", background: "rgba(148, 163, 184, 0.12)" },
              { value: "#94A3B8 · 24%", background: "rgba(148, 163, 184, 0.24)" },
              { value: "#24364D · 24%", background: "rgba(36, 54, 77, 0.24)" },
              { value: "#24364D · 32%", background: "rgba(36, 54, 77, 0.32)" },
            ],
          },
        ],
      },
      dark: {
        title: "(다크)",
        sections: [
          { groupTitle: "Secondary 02(보조 강조 색상)", colors: ["#46686D"] },
          { groupTitle: "Base(보조 강조 색상)", colors: ["#F1F7FF", "#323E4A"] },
          { groupTitle: "Grey(중립 배경 및 보조 텍스트)", colors: ["#222E3A", "#161C23", "#989DA4"] },
          { groupTitle: "Stroke(경계선 및 구분선)", colors: ["#515A63", "#7E8286"] },
          { groupTitle: "Blue(정보 및 링크)", colors: ["#8CD1FF", "#0C5970", "#2E4F9C"] },
          { groupTitle: "Green(성공 상태)", colors: ["#5BFF3A", "#426F46"] },
          { groupTitle: "Orange(경고 상태)", colors: ["#FFA48B", "#623C35"] },
          { groupTitle: "Purple(특수 강조)", colors: ["#F194FF", "#69536D"] },
          {
            groupTitle: "Transparency(반투명 오버레이)",
            colors: [
              { value: "#77889F · 40%", background: "rgba(119, 136, 159, 0.4)" },
              { value: "#77889F · 64%", background: "rgba(119, 136, 159, 0.64)" },
              { value: "#BFCFE6 · 16%", background: "rgba(191, 207, 230, 0.16)" },
              { value: "#BFCFE6 · 40%", background: "rgba(191, 207, 230, 0.4)" },
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

const TEXT_STYLES = {
  mainTitle: "Text Styles",
  title:
    "Pretendard 폰트 기반 텍스트 스타일 14종 — Title · Body · Label · List 카테고리로 구성됩니다.",
  previewText: "가나다라마바사아 AaBbCcDd 1234",
  sections: [
    {
      groupTitle: "Title",
      styles: [
        { size: 22, weightName: "SemiBold", fontWeight: 600 },
        { size: 16, weightName: "Bold", fontWeight: 700 },
        { size: 14, weightName: "Bold", fontWeight: 700 },
        { size: 12, weightName: "Bold", fontWeight: 700 },
      ],
    },
    {
      groupTitle: "Body",
      styles: [
        { size: 14, weightName: "SemiBold", fontWeight: 600 },
        { size: 14, weightName: "Medium", fontWeight: 500 },
        { size: 13, weightName: "SemiBold", fontWeight: 600 },
        { size: 12, weightName: "SemiBold", fontWeight: 600 },
        { size: 12, weightName: "Medium", fontWeight: 500 },
        { size: 12, weightName: "Regular", fontWeight: 400 },
      ],
    },
    {
      groupTitle: "Label",
      styles: [
        { size: 10, weightName: "SemiBold", fontWeight: 600 },
        { size: 10, weightName: "Regular", fontWeight: 400 },
      ],
    },
    {
      groupTitle: "List",
      styles: [
        { size: 12, weightName: "SemiBold", fontWeight: 600 },
        { size: 12, weightName: "Medium", fontWeight: 500 },
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

// ─────────────────────────────────────────
// 2. 유틸 함수
// ─────────────────────────────────────────

// className 여러 개를 공백으로 이어 붙이는 헬퍼
function classNames(...names) {
  return names.filter(Boolean).join(" ");
}

// 색상 데이터를 통일된 형태로 변환
function getColorInfo(color) {
  if (typeof color === "string") {
    return { value: color, background: color, isTransparent: false };
  }
  return {
    value: color.value,
    background: color.background,
    isTransparent: true,
  };
}

// 밝은 색인지 판별 (글자색 결정용)
function isLightColor(hexColor) {
  const hex = hexColor.replace("#", "").slice(0, 6);
  if (hex.length !== 6) return true;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 160;
}

// ─────────────────────────────────────────
// 3. 공통 컴포넌트
// ─────────────────────────────────────────

function SectionHeader({ mainTitle, title, headerClass, descriptionClass }) {
  return (
    <div className={headerClass}>
      <h1>{mainTitle}</h1>
      <p className={descriptionClass}>{title}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// 4. 색상 팔레트 컴포넌트
// ─────────────────────────────────────────

function ColorSwatch({ color }) {
  const [copied, setCopied] = useState(false);
  const colorInfo = getColorInfo(color);
  const textClass = isLightColor(colorInfo.value) ? "dark-text" : "light-text";

  async function copyColor() {
    await navigator.clipboard.writeText(colorInfo.value);
    setCopied(true);
    setTimeout(function () {
      setCopied(false);
    }, 1000);
  }

  return (
    <div
      className={classNames("color-swatch", colorInfo.isTransparent && "is-transparent")}
      style={colorInfo.isTransparent ? undefined : { background: colorInfo.background }}
      onClick={copyColor}
      role="button"
      tabIndex={0}
    >
      {colorInfo.isTransparent && (
        <div className="color-swatch-fill" style={{ background: colorInfo.background }} />
      )}
      <span className={textClass}>{colorInfo.value}</span>
      {copied && <span className="color-swatch-copy">copy</span>}
    </div>
  );
}

function ColorGroup({ groupTitle, colors }) {
  return (
    <div className="color-palette-block">
      <div className="color-palette-group-title">{groupTitle}</div>
      <div className="color-palette-colors">
        {colors.map(function (color, index) {
          return <ColorSwatch key={groupTitle + "-" + index} color={color} />;
        })}
      </div>
    </div>
  );
}

function ThemeTabButtons({ theme, onThemeChange }) {
  return (
    <div className="color-palette-theme-tabs" role="tablist">
      {THEME_TABS.map(function (tab) {
        const isActive = theme === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={classNames("color-palette-theme-tab", isActive && "is-active")}
            onClick={function () {
              onThemeChange(tab.id);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ColorPaletteComponent({ palette }) {
  const [theme, setTheme] = useState("light");
  const currentTheme = palette.themes[theme];
  const isDark = theme === "dark";

  return (
    <div className={classNames("color-palette-component", isDark && "is-dark")}>
      <div className="color-palette-header">
        <div className="color-palette-header-text">
          <h1>{palette.mainTitle}</h1>
          <p className="color-palette-description">{currentTheme.title}</p>
        </div>
        <ThemeTabButtons theme={theme} onThemeChange={setTheme} />
      </div>

      <div className="color-palette-group">
        {currentTheme.sections.map(function (section) {
          return (
            <ColorGroup
              key={section.groupTitle}
              groupTitle={section.groupTitle}
              colors={section.colors}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 5. 텍스트 스타일 컴포넌트
// ─────────────────────────────────────────

function TextStyleRow({ size, weightName, fontWeight, previewText }) {
  return (
    <div className="text-style-item">
      <div className="text-style-spec">
        크기 {size}px 굵기 {weightName}
      </div>
      <div
        className="text-style-preview"
        style={{ fontSize: size + "px", fontWeight: fontWeight }}
      >
        {previewText}
      </div>
    </div>
  );
}

function TextStyleGroup({ groupTitle, styles, previewText }) {
  return (
    <div className="text-styles-block">
      <div className="text-styles-group-title">{groupTitle}</div>
      <div className="text-styles-list">
        {styles.map(function (style, index) {
          return (
            <TextStyleRow
              key={groupTitle + "-" + index}
              size={style.size}
              weightName={style.weightName}
              fontWeight={style.fontWeight}
              previewText={previewText}
            />
          );
        })}
      </div>
    </div>
  );
}

function TextStylesComponent() {
  return (
    <div className="text-styles-component">
      <SectionHeader
        mainTitle={TEXT_STYLES.mainTitle}
        title={TEXT_STYLES.title}
        headerClass="text-styles-header"
        descriptionClass="text-styles-description"
      />

      <div className="text-styles-group">
        {TEXT_STYLES.sections.map(function (section) {
          return (
            <TextStyleGroup
              key={section.groupTitle}
              groupTitle={section.groupTitle}
              styles={section.styles}
              previewText={TEXT_STYLES.previewText}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 6. 이펙트 스타일 컴포넌트
// ─────────────────────────────────────────

function EffectStyleRow({ spec, previewStyle }) {
  return (
    <div className="effect-style-item">
      <div className="effect-style-spec">
        {spec.map(function (line) {
          return <div key={line}>{line}</div>;
        })}
      </div>
      <div className="effect-style-preview-wrap">
        <div className="effect-style-preview" style={previewStyle} />
      </div>
    </div>
  );
}

function EffectStylesComponent() {
  return (
    <div className="effect-styles-component">
      <SectionHeader
        mainTitle={EFFECT_STYLES.mainTitle}
        title={EFFECT_STYLES.title}
        headerClass="effect-styles-header"
        descriptionClass="effect-styles-description"
      />

      <div className="effect-styles-group">
        {EFFECT_STYLES.sections.map(function (section) {
          return (
            <div className="effect-styles-block" key={section.groupTitle}>
              <div className="effect-styles-group-title">{section.groupTitle}</div>
              <div className="effect-styles-list">
                {section.effects.map(function (effect, index) {
                  return (
                    <EffectStyleRow
                      key={section.groupTitle + "-" + index}
                      spec={effect.spec}
                      previewStyle={effect.previewStyle}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 7. 페이지 (최종 조립)
// ─────────────────────────────────────────

export default function TeuiPage() {
  return (
    <div className="teui-page">
      {/* 
        아래 코드는 PALETTES 배열에 있는 각 팔레트 데이터를 순회하면서,
        ColorPaletteComponent라는 리액트 컴포넌트로 화면에 보여준다.
        즉, 여러 색상 팔레트 섹션을 페이지에 반복해서 렌더링하는 부분이다.

        PALETTES.map(...) : 배열의 각 아이템(palette)에 대해 아래의 함수를 실행한다.
        ColorPaletteComponent에 key(고유값)와 palette(팔레트 데이터)를 props로 전달한다.
      */}
      {PALETTES.map(function (palette) {
        return <ColorPaletteComponent key={palette.mainTitle} palette={palette} />;
      })}
 
      <TextStylesComponent />
      <EffectStylesComponent />
    </div>
  );
}
