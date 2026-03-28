"use client";

import { useState, useEffect } from "react";

let toastId = 0;

const toastEvents = {
  listeners: [],
  emit(toast) {
    this.listeners.forEach((fn) => fn(toast));
  },
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  },
};

export function showToast(message, type = "success") {
  toastEvents.emit({ id: ++toastId, message, type });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toastEvents.subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 2000);
    });
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
