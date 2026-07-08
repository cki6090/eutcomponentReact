"use client";

import { useEffect } from "react";

function ToastItem({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="legocode-toast" role="alert">
      <span className="legocode-toast-icon" aria-hidden="true">
        !
      </span>
      <p className="legocode-toast-message">{message}</p>
      <button type="button" className="legocode-toast-close" onClick={onClose} aria-label="닫기">
        ×
      </button>
    </div>
  );
}

export default function ToastPopup({ toasts, onClose, duration = 2500 }) {
  if (!toasts.length) return null;

  return (
    <div className="legocode-toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          onClose={() => onClose(toast.id)}
          duration={duration}
        />
      ))}
    </div>
  );
}
