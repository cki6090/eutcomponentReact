"use client";

import { useEffect } from "react";

// 토스트 1개
function ToastItem({ message, onClose, duration = 2500 }) {
  // duration(ms) 후 자동으로 닫기
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
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

// 토스트 여러 개를 아래에서 위로 쌓아서 보여줌
export default function ToastPopup({ toasts, onClose, duration = 2500 }) {
  if (toasts.length === 0) return null;

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
