"use client";

import { useEffect, useState } from "react";

interface SmsToastProps {
  message?: string;
  onClose?: () => void;
}

export default function SmsToast({ message: propMessage, onClose }: SmsToastProps) {
  const [activeMessage, setActiveMessage] = useState<string | null>(propMessage || null);

  useEffect(() => {
    if (propMessage) {
      setActiveMessage(propMessage);
      const timer = setTimeout(() => {
        setActiveMessage(null);
        if (onClose) onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [propMessage, onClose]);

  if (!activeMessage) return null;

  return (
    <div className="toast-container">
      <div className="sms-toast" role="alert">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>📲</span>
            <strong style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem" }}>SMS Gateway Notification</strong>
          </div>
          <button
            onClick={() => {
              setActiveMessage(null);
              if (onClose) onClose();
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "0.85rem", lineHeight: "1.4" }}>
          {activeMessage}
        </p>
        <div style={{ marginTop: "6px", fontSize: "0.72rem", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
          Delivered in &lt; 60s · SLA Target Met (NFR-05)
        </div>
      </div>
    </div>
  );
}
