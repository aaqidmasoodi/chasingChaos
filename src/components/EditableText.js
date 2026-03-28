"use client";

import { useState, useRef, useEffect } from "react";

export default function EditableText({
  value,
  onSave,
  multiline = false,
  className = "",
  tag = "span",
  placeholder = "Click to edit...",
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value ?? "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(value ?? "");
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      }
    }
  }, [editing, multiline]);

  const handleSave = async () => {
    setEditing(false);
    if (text !== value) {
      setSaving(true);
      try {
        await onSave(text);
      } catch (e) {
        console.error("Save failed:", e);
        setText(value ?? "");
      }
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setText(value ?? "");
      setEditing(false);
    }
  };

  if (editing) {
    const sharedStyle = {
      background: "rgba(212, 165, 116, 0.08)",
      border: "1px solid rgba(212, 165, 116, 0.3)",
      borderRadius: "6px",
      color: "var(--text-primary)",
      WebkitTextFillColor: "var(--text-primary)",
      font: "inherit",
      padding: "4px 8px",
      width: "100%",
      outline: "none",
      resize: multiline ? "vertical" : "none",
    };

    return multiline ? (
      <textarea
        ref={inputRef}
        className={className}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        style={sharedStyle}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef}
        className={className}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        style={sharedStyle}
      />
    );
  }

  const Tag = tag;
  return (
    <Tag
      className={`${className} editable-text ${saving ? "saving" : ""}`}
      onDoubleClick={() => setEditing(true)}
      title="Double-click to edit"
    >
      {text || <span style={{ opacity: 0.3 }}>{placeholder}</span>}
    </Tag>
  );
}
