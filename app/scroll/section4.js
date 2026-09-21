import { useEffect, useId, useRef, useState } from "react";

/* ── SCRIPT : 스크롤 % ── */
function useSectionScroll() {
  const sectionRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const realHeight = el.offsetHeight - window.innerHeight;
      if (realHeight <= 0) return setScrollPercent(0);
      const percent = ((window.scrollY - el.offsetTop) / realHeight) * 100;
      setScrollPercent(Math.max(0, Math.min(100, percent)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { sectionRef, scrollPercent };
}

/* ── SCRIPT : 부채꼴 clip-path ── */
function mapRange(p, start, end) {
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

function easeInOutCubic(t) {
  t = Math.max(0, Math.min(1, t));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getFanClipPath(startDeg, sweepDeg, cx = 100, cy = 100, radius = 220) {
  if (sweepDeg <= 0) {
    return `polygon(${cx}% ${cy}%, ${cx}% ${cy}%, ${cx}% ${cy}%)`;
  }
  if (sweepDeg >= 359.5) return "inset(0)";

  const points = [`${cx.toFixed(1)}% ${cy.toFixed(1)}%`];
  const steps = Math.max(12, Math.ceil(sweepDeg / 12));
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + (sweepDeg * i) / steps;
    const rad = (deg * Math.PI) / 180;
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    points.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return `polygon(${points.join(", ")})`;
}

function getCardClipPath(i, scrollPercent, layerCount) {
  const overlapStart = 0.15;
  const revealDuration = 100 / (1 + (layerCount - 1) * overlapStart);
  const stagger = revealDuration * overlapStart;
  const fanStart = 180;
  const fanSweepMax = 120;

  if (i === 0) return "inset(0)";

  const segStart = i * stagger;
  const segEnd = segStart + revealDuration;

  if (scrollPercent < segStart) return getFanClipPath(fanStart, 0);
  if (scrollPercent >= segEnd) return "inset(0)";
  const eased = easeInOutCubic(mapRange(scrollPercent, segStart, segEnd));
  return getFanClipPath(fanStart, eased * fanSweepMax);
}

/* ── 6컬러 × light/dark = 12 테마 (CSS variables) ── */
const COLOR_FAMILIES = [
  {
    name: "Ocean Blue",
    light: {
      "--bg": "#eef5ff",
      "--surface": "#ffffff",
      "--surface-2": "#f1f6fd",
      "--text": "#0f2744",
      "--text-muted": "#5b738f",
      "--border": "#c9d9ec",
      "--primary": "#1a6fd4",
      "--primary-soft": "#d6e8ff",
      "--primary-fg": "#ffffff",
      "--accent": "#ff8a3d",
      "--accent-fg": "#ffffff",
      "--success": "#1f9d6a",
      "--warning": "#d97706",
      "--danger": "#dc3d4a",
      "--input-bg": "#ffffff",
      "--shadow": "0 10px 28px rgba(15, 39, 68, 0.1)",
      "--ring": "rgba(26, 111, 212, 0.35)",
    },
    dark: {
      "--bg": "#0d1622",
      "--surface": "#152233",
      "--surface-2": "#1c2d42",
      "--text": "#e8f1ff",
      "--text-muted": "#91a7c2",
      "--border": "#2d425c",
      "--primary": "#4ea1ff",
      "--primary-soft": "#1a3554",
      "--primary-fg": "#061018",
      "--accent": "#ffb070",
      "--accent-fg": "#1a1008",
      "--success": "#3dd68c",
      "--warning": "#fbbf24",
      "--danger": "#ff7b87",
      "--input-bg": "#101b29",
      "--shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "--ring": "rgba(78, 161, 255, 0.4)",
    },
  },
  {
    name: "Forest Green",
    light: {
      "--bg": "#eefaf3",
      "--surface": "#ffffff",
      "--surface-2": "#f0faf4",
      "--text": "#143328",
      "--text-muted": "#5a7868",
      "--border": "#c5e4d3",
      "--primary": "#1f9d6a",
      "--primary-soft": "#d4f5e6",
      "--primary-fg": "#ffffff",
      "--accent": "#e28a2e",
      "--accent-fg": "#ffffff",
      "--success": "#0f8a55",
      "--warning": "#d97706",
      "--danger": "#d64545",
      "--input-bg": "#ffffff",
      "--shadow": "0 10px 28px rgba(20, 51, 40, 0.1)",
      "--ring": "rgba(31, 157, 106, 0.35)",
    },
    dark: {
      "--bg": "#0c1813",
      "--surface": "#13241c",
      "--surface-2": "#1a3227",
      "--text": "#e7f8ef",
      "--text-muted": "#8fb8a4",
      "--border": "#2a4638",
      "--primary": "#3dd68c",
      "--primary-soft": "#1a3d2d",
      "--primary-fg": "#04140d",
      "--accent": "#ffb86b",
      "--accent-fg": "#1a1008",
      "--success": "#5ee4a9",
      "--warning": "#fbbf24",
      "--danger": "#ff8a8a",
      "--input-bg": "#0e1c16",
      "--shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "--ring": "rgba(61, 214, 140, 0.4)",
    },
  },
  {
    name: "Violet",
    light: {
      "--bg": "#f6f1ff",
      "--surface": "#ffffff",
      "--surface-2": "#f4effc",
      "--text": "#2a1848",
      "--text-muted": "#6f5f8c",
      "--border": "#ddd0f3",
      "--primary": "#7c3aed",
      "--primary-soft": "#ebe0ff",
      "--primary-fg": "#ffffff",
      "--accent": "#ec4899",
      "--accent-fg": "#ffffff",
      "--success": "#16a34a",
      "--warning": "#d97706",
      "--danger": "#e11d48",
      "--input-bg": "#ffffff",
      "--shadow": "0 10px 28px rgba(42, 24, 72, 0.1)",
      "--ring": "rgba(124, 58, 237, 0.35)",
    },
    dark: {
      "--bg": "#140f1f",
      "--surface": "#1d152c",
      "--surface-2": "#271c3a",
      "--text": "#f3eaff",
      "--text-muted": "#b0a0c9",
      "--border": "#3a2d55",
      "--primary": "#a78bfa",
      "--primary-soft": "#2d2048",
      "--primary-fg": "#140a24",
      "--accent": "#f472b6",
      "--accent-fg": "#1a0810",
      "--success": "#4ade80",
      "--warning": "#fbbf24",
      "--danger": "#fb7185",
      "--input-bg": "#120c1c",
      "--shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "--ring": "rgba(167, 139, 250, 0.4)",
    },
  },
  {
    name: "Amber",
    light: {
      "--bg": "#fff7ed",
      "--surface": "#fffdf9",
      "--surface-2": "#fff3e4",
      "--text": "#3b2610",
      "--text-muted": "#8a6a48",
      "--border": "#ecd7b8",
      "--primary": "#df813c",
      "--primary-soft": "#ffe4c8",
      "--primary-fg": "#ffffff",
      "--accent": "#24364d",
      "--accent-fg": "#ffffff",
      "--success": "#25910f",
      "--warning": "#c67c22",
      "--danger": "#ba1a1a",
      "--input-bg": "#ffffff",
      "--shadow": "0 10px 28px rgba(59, 38, 16, 0.1)",
      "--ring": "rgba(223, 129, 60, 0.35)",
    },
    dark: {
      "--bg": "#1a120c",
      "--surface": "#241910",
      "--surface-2": "#322314",
      "--text": "#fff1e0",
      "--text-muted": "#c4a888",
      "--border": "#4a3420",
      "--primary": "#ff9f5a",
      "--primary-soft": "#3a2616",
      "--primary-fg": "#1a0e06",
      "--accent": "#98f2ff",
      "--accent-fg": "#041418",
      "--success": "#5bff3a",
      "--warning": "#ffa48b",
      "--danger": "#ff8a8a",
      "--input-bg": "#160f0a",
      "--shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "--ring": "rgba(255, 159, 90, 0.4)",
    },
  },
  {
    name: "Rose",
    light: {
      "--bg": "#fff1f5",
      "--surface": "#ffffff",
      "--surface-2": "#ffebf1",
      "--text": "#3f1526",
      "--text-muted": "#8b5a6d",
      "--border": "#f0c9d6",
      "--primary": "#db2777",
      "--primary-soft": "#fce7f1",
      "--primary-fg": "#ffffff",
      "--accent": "#7c3aed",
      "--accent-fg": "#ffffff",
      "--success": "#16a34a",
      "--warning": "#d97706",
      "--danger": "#e11d48",
      "--input-bg": "#ffffff",
      "--shadow": "0 10px 28px rgba(63, 21, 38, 0.1)",
      "--ring": "rgba(219, 39, 119, 0.35)",
    },
    dark: {
      "--bg": "#180c12",
      "--surface": "#24141c",
      "--surface-2": "#321c28",
      "--text": "#ffe8f0",
      "--text-muted": "#c79aab",
      "--border": "#4a2c3a",
      "--primary": "#f472b6",
      "--primary-soft": "#3a1c2c",
      "--primary-fg": "#1a0810",
      "--accent": "#c4b5fd",
      "--accent-fg": "#140a24",
      "--success": "#4ade80",
      "--warning": "#fbbf24",
      "--danger": "#fb7185",
      "--input-bg": "#140a10",
      "--shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "--ring": "rgba(244, 114, 182, 0.4)",
    },
  },
  {
    name: "Slate Cyan",
    light: {
      "--bg": "#f1f7ff",
      "--surface": "#ffffff",
      "--surface-2": "#eef4fb",
      "--text": "#24364d",
      "--text-muted": "#64748b",
      "--border": "#d4dee9",
      "--primary": "#0084ad",
      "--primary-soft": "#def6ff",
      "--primary-fg": "#ffffff",
      "--accent": "#00b8e6",
      "--accent-fg": "#042028",
      "--success": "#25910f",
      "--warning": "#c67c22",
      "--danger": "#ba1a1a",
      "--input-bg": "#ffffff",
      "--shadow": "0 10px 28px rgba(36, 54, 77, 0.1)",
      "--ring": "rgba(0, 132, 173, 0.35)",
    },
    dark: {
      "--bg": "#12181f",
      "--surface": "#1a222c",
      "--surface-2": "#232d3a",
      "--text": "#f1f7ff",
      "--text-muted": "#989da4",
      "--border": "#515a63",
      "--primary": "#8cd1ff",
      "--primary-soft": "#0c5970",
      "--primary-fg": "#041018",
      "--accent": "#98f2ff",
      "--accent-fg": "#041418",
      "--success": "#5bff3a",
      "--warning": "#ffa48b",
      "--danger": "#ff8a8a",
      "--input-bg": "#161c23",
      "--shadow": "0 12px 32px rgba(0, 0, 0, 0.45)",
      "--ring": "rgba(140, 209, 255, 0.4)",
    },
  },
];

const THEMES = COLOR_FAMILIES.flatMap((family) => [
  {
    id: `${family.name}-light`,
    name: family.name,
    mode: "light",
    vars: family.light,
  },
  {
    id: `${family.name}-dark`,
    name: family.name,
    mode: "dark",
    vars: family.dark,
  },
]);

const PALETTE_KEYS = [
  { key: "--primary", label: "Primary" },
  { key: "--accent", label: "Accent" },
  { key: "--success", label: "Success" },
  { key: "--warning", label: "Warning" },
  { key: "--danger", label: "Danger" },
  { key: "--surface", label: "Surface" },
];

const CARGO_OPTIONS = [
  "Dangerous",
  "Awkward",
  "Reefer",
  "Food Grade",
  "Scrap",
  "Oversize",
];
const TAB_ITEMS = ["Master", "Container", "Customer", "Remark"];

function ThemeShowcase({ theme, index }) {
  const uid = useId();
  const toastTimer = useRef(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [selectVal, setSelectVal] = useState("general");
  const [toggleOn, setToggleOn] = useState(index % 2 === 0);
  const [notify, setNotify] = useState(true);
  const [checks, setChecks] = useState(() => new Set(["Reefer", "Food Grade"]));
  const [region, setRegion] = useState("Asia");
  const [tab, setTab] = useState("Master");
  const [range, setRange] = useState(42 + (index % 5) * 8);
  const [rating, setRating] = useState(3 + (index % 3));
  const [rows, setRows] = useState([
    { type: "20GP", qty: 2 },
    { type: "40HC", qty: 1 },
  ]);
  const [pickedSwatch, setPickedSwatch] = useState("--primary");
  const [toast, setToast] = useState("");
  const [dateVal, setDateVal] = useState("2026-08-25");
  const [timeVal, setTimeVal] = useState("14:30");
  const [qty, setQty] = useState(4);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("demo1234");
  const [tags, setTags] = useState(() => new Set(["EDI", "Hold"]));
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [alertOn, setAlertOn] = useState(true);
  const [accordionOpen, setAccordionOpen] = useState(false);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const toggleCheck = (label) => {
    setChecks((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const toggleTag = (tag) => {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const runLoading = () => {
    setLoading(true);
    showToast("Submitting…");
    window.setTimeout(() => {
      setLoading(false);
      showToast("Done");
    }, 1200);
  };

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1400);
  };

  const addRow = () => {
    setRows((prev) => {
      if (prev.length >= 2) {
        showToast("Max 2 rows");
        return prev;
      }
      showToast("Row added");
      return [...prev, { type: "40GP", qty: 1 }];
    });
  };

  const removeRow = () => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      showToast("Row removed");
      return prev.slice(0, -1);
    });
  };

  return (
    <div
      className={`s4-showcase${theme.mode === "dark" ? " is-dark" : ""}`}
      style={theme.vars}
      data-theme={theme.id}
    >
      <header className="s4-head">
        <div>
          <p className="s4-kicker">
            Theme {String(index + 1).padStart(2, "0")} · CSS Variables
          </p>
          <h3 className="s4-title">{theme.name}</h3>
        </div>
        <div className="s4-head-actions">
          <span className={`s4-badge ${theme.mode}`}>{theme.mode}</span>
          <label className="s4-switch">
            <input
              type="checkbox"
              checked={toggleOn}
              onChange={(e) => setToggleOn(e.target.checked)}
              aria-label="Keep session"
            />
            <span className="s4-switch-track">
              <span className="s4-switch-thumb" />
            </span>
            <span>Keep Session</span>
          </label>
        </div>
      </header>

      <section className="s4-panel">
        <div className="s4-panel-title">Color Palette</div>
        <div className="s4-swatches">
          {PALETTE_KEYS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`s4-swatch${pickedSwatch === key ? " is-active" : ""}`}
              style={{ "--swatch": `var(${key})` }}
              onClick={() => {
                setPickedSwatch(key);
                showToast(`${label} selected`);
              }}
            >
              <span className="s4-swatch-fill" />
              <span className="s4-swatch-meta">
                <strong>{label}</strong>
                <em>{theme.vars[key]}</em>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="s4-grid">
        <section className="s4-panel">
          <div className="s4-panel-title">Inputs</div>
          <div className="s4-fields">
            <label className="s4-field">
              <span>BKG No. *</span>
              <input
                type="text"
                value={text}
                placeholder="Type booking number"
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <label className="s4-field s4-field-icon">
              <span>Search</span>
              <input
                type="search"
                value={search}
                placeholder="POR / POL / Carrier"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                className="s4-icon-btn"
                onClick={() => showToast(`Search: ${search || "empty"}`)}
                aria-label="Run search"
              >
                ⌕
              </button>
            </label>
            <label className="s4-field">
              <span>Booking Type</span>
              <select
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
              >
                <option value="general">General BKG</option>
                <option value="empty">Empty Repo</option>
                <option value="co-load">Co-Load</option>
              </select>
            </label>
            <label className="s4-field">
              <span>ETD Date</span>
              <input
                type="date"
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
              />
            </label>
            <label className="s4-field">
              <span>Cut-off</span>
              <input
                type="time"
                value={timeVal}
                onChange={(e) => setTimeVal(e.target.value)}
              />
            </label>
            <label className="s4-field s4-field-icon">
              <span>Password</span>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="s4-icon-btn"
                onClick={() => setShowPw((v) => !v)}
                aria-label="Toggle password"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </label>
            <div className="s4-field">
              <span>Qty Stepper</span>
              <div className="s4-stepper">
                <button
                  type="button"
                  onClick={() => setQty((v) => Math.max(0, v - 1))}
                  aria-label="Decrease"
                >
                  −
                </button>
                <strong>{qty}</strong>
                <button
                  type="button"
                  onClick={() => setQty((v) => v + 1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            </div>
            <label className="s4-field s4-field-remark">
              <span>Remark</span>
              <textarea
                rows={1}
                placeholder="Write a note…"
                defaultValue=""
                onBlur={(e) => e.target.value && showToast("Remark saved")}
              />
            </label>
          </div>
        </section>

        <section className="s4-panel">
          <div className="s4-panel-title">Controls</div>
          <div className="s4-controls-top">
            <div className="s4-seg" role="group" aria-label="Region">
              {["Asia", "US", "EU"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={region === item ? "is-active" : ""}
                  onClick={() => setRegion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="s4-switch dense">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
              />
              <span className="s4-switch-track">
                <span className="s4-switch-thumb" />
              </span>
              <span>Notify</span>
            </label>
          </div>

          <div className="s4-checks">
            {CARGO_OPTIONS.map((label) => (
              <label key={label} className="s4-check">
                <input
                  type="checkbox"
                  checked={checks.has(label)}
                  onChange={() => toggleCheck(label)}
                />
                <span className="s4-check-box" />
                {label}
              </label>
            ))}
          </div>

          <div className="s4-tag-row">
            {["EDI", "Hold", "VIP", "Reefer", "DG"].map((tag) => (
              <button
                key={tag}
                type="button"
                className={`s4-chip${tags.has(tag) ? " is-on" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="s4-controls-bottom">
            <div className="s4-radios" role="radiogroup" aria-label="Priority">
              {["Normal", "Urgent", "VIP"].map((item, i) => (
                <label key={item} className="s4-radio">
                  <input
                    type="radio"
                    name={`${uid}-priority`}
                    defaultChecked={i === 0}
                    onChange={() => showToast(`Priority: ${item}`)}
                  />
                  <span className="s4-radio-dot" />
                  {item}
                </label>
              ))}
            </div>
            <div className="s4-stars" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= rating ? "is-on" : ""}
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <label className="s4-field s4-field-range">
            <span>Progress · {range}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
            />
            <div className="s4-progress">
              <i style={{ width: `${range}%` }} />
            </div>
          </label>
        </section>

        <section className="s4-panel">
          <div className="s4-panel-title">Widgets</div>

          <div className="s4-status-row">
            <span className="s4-status ok">Ready</span>
            <span className="s4-status warn">Pending</span>
            <span className="s4-status err">Blocked</span>
            <span className="s4-status info">Sync</span>
          </div>

          {alertOn ? (
            <div className="s4-alert">
              <span>Vessel cut-off in 2h. Confirm POL ETD.</span>
              <button
                type="button"
                onClick={() => setAlertOn(false)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="s4-btn ghost s4-btn-block"
              onClick={() => setAlertOn(true)}
            >
              Show alert
            </button>
          )}

          <div className="s4-steps" role="list">
            {["Draft", "Confirm", "Submit"].map((label, i) => (
              <button
                key={label}
                type="button"
                role="listitem"
                className={`s4-step${step === i ? " is-active" : ""}${step > i ? " is-done" : ""}`}
                onClick={() => setStep(i)}
              >
                <em>{i + 1}</em>
                {label}
              </button>
            ))}
          </div>

          <div className="s4-widget-row">
            <label className="s4-file">
              <input
                type="file"
                onChange={(e) => {
                  const name = e.target.files?.[0]?.name || "";
                  setFileName(name);
                  showToast(name ? `File: ${name}` : "No file");
                }}
              />
              <span className="s4-btn ghost">{fileName || "Attach file"}</span>
            </label>
            <button
              type="button"
              className={`s4-btn primary${loading ? " is-loading" : ""}`}
              onClick={runLoading}
              disabled={loading}
            >
              {loading ? "…" : "Submit"}
            </button>
          </div>

          <div className="s4-meter" aria-label="Capacity">
            <div className="s4-meter-head">
              <span>Capacity</span>
              <strong>{Math.min(100, qty * 12 + range)}%</strong>
            </div>
            <div className="s4-progress">
              <i style={{ width: `${Math.min(100, qty * 12 + range)}%` }} />
            </div>
          </div>

          <button
            type="button"
            className={`s4-accordion${accordionOpen ? " is-open" : ""}`}
            onClick={() => setAccordionOpen((v) => !v)}
          >
            <span>More options</span>
            <em>{accordionOpen ? "−" : "+"}</em>
          </button>
          {accordionOpen ? (
            <div className="s4-accordion-body">
              <label className="s4-switch dense">
                <input
                  type="checkbox"
                  checked={toggleOn}
                  onChange={(e) => setToggleOn(e.target.checked)}
                />
                <span className="s4-switch-track">
                  <span className="s4-switch-thumb" />
                </span>
                <span>Auto EDI</span>
              </label>
              <label className="s4-field">
                <span>Accent color</span>
                <input
                  type="color"
                  value={theme.vars["--primary"]}
                  onChange={() => showToast("Preview only · theme locked")}
                />
              </label>
            </div>
          ) : null}
        </section>
      </div>

      <section className="s4-panel">
        <div className="s4-tabs">
          {TAB_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className={tab === item ? "is-active" : ""}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="s4-table-wrap">
          <div className="s4-table-toolbar">
            <strong>{tab} · Container Q&apos;ty</strong>
            <div className="s4-btn-row">
              <button type="button" className="s4-btn ghost" onClick={addRow}>
                + Add Row
              </button>
              <button
                type="button"
                className="s4-btn ghost"
                onClick={removeRow}
              >
                - Delete
              </button>
            </div>
          </div>
          <table className="s4-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Qty2</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={`${row.type}-${i}`}>
                  <td>{i + 1}</td>

                  <td>
                    <select
                      value={row.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        setRows((prev) =>
                          prev.map((r, idx) =>
                            idx === i ? { ...r, type } : r,
                          ),
                        );
                      }}
                    >
                      {["20GP", "40GP", "40HC", "45HC"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      min={0}
                      value={row.qty}
                      onChange={(e) => {
                        const qty = Number(e.target.value);
                        setRows((prev) =>
                          prev.map((r, idx) => (idx === i ? { ...r, qty } : r)),
                        );
                      }}
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      className="s4-chip"
                      onClick={() => showToast(`${row.type} inquired`)}
                    >
                      Inquiry
                    </button>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="s4-chip"
                      onClick={() => showToast(`${row.type} inquired`)}
                    >
                      Inquiry
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="s4-footer">
        <div className="s4-chips">
          <span className="s4-chip soft">{region}</span>
          <span className="s4-chip soft">{selectVal}</span>
          <span className="s4-chip soft">{checks.size} cargo</span>
          {notify && <span className="s4-chip soft">notify on</span>}
        </div>
        <div className="s4-btn-row">
          <button
            type="button"
            className="s4-btn ghost"
            onClick={() => showToast("Cancelled")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="s4-btn primary"
            onClick={() => showToast("Search run")}
          >
            Search
          </button>
          <button
            type="button"
            className="s4-btn accent"
            onClick={() => showToast("Saved!")}
          >
            Save
          </button>
        </div>
      </footer>

      {toast ? (
        <div className="s4-toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

/* ── 컴포넌트 ── */
export default function Section4() {
  const { sectionRef, scrollPercent } = useSectionScroll();

  return (
    <div className="section section4" ref={sectionRef}>
      <div className="layer-sticky">
        <div className="layer-stack">
          {THEMES.map((theme, i) => (
            <div
              key={theme.id}
              className="layer-card"
              style={{
                clipPath: getCardClipPath(i, scrollPercent, THEMES.length),
              }}
            >
              <ThemeShowcase theme={theme} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
