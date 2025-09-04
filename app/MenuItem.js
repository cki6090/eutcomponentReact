"use client";

import { useState } from "react";
import { menuData } from "./data";

function MenuItem({ item, depth = 0 }) {
  // depth 기본값 0
  const [open, setOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className={`menu-item depth-${depth}`}>
      <div
        className={`menu-title ${hasChildren ? "has-children" : ""}`}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {item.title}{" "}
        {hasChildren && <span className="arrow">{open ? "🌞" : "🌕"}</span>}
      </div>

      {hasChildren && (
        <ul className={`submenu ${open ? "open" : ""}`}>
          {item.children.map((child) => (
            <MenuItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="MenuButton">
      <div
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        {menuOpen ? (
          <div className="btn">🛎️</div>
        ) : (
          <div className="btn">🍔</div>
        )}
      </div>

      {menuOpen ? (
        <div className="menulist">
          <ul className="menu">
            {menuData.map((item) => (
              <MenuItem key={item.id} item={item} depth={0} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
