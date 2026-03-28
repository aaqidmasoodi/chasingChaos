"use client";

import EditableText from "./EditableText";

export default function EditableList({
  items,
  onSaveItem,
  onAddItem,
  onDeleteItem,
  multiline = true,
  className = "",
  itemClassName = "",
  placeholder = "New item...",
}) {
  return (
    <div className={`editable-list ${className}`}>
      {items.map((item, i) => (
        <div key={i} className={`editable-list-item ${itemClassName}`}>
          <div style={{ flex: 1 }}>
            <EditableText
              value={item}
              onSave={(newText) => onSaveItem(i, newText)}
              multiline={multiline}
              tag="p"
            />
          </div>
          {onDeleteItem && (
            <button
              className="editable-list-delete"
              onClick={() => onDeleteItem(i)}
              title="Remove item"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {onAddItem && (
        <button className="editable-list-add" onClick={onAddItem}>
          + Add
        </button>
      )}
    </div>
  );
}
