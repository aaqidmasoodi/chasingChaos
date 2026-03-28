"use client";

import { useState, useEffect } from "react";
import EditableText from "@/components/EditableText";
import EditableList from "@/components/EditableList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showToast } from "@/components/Toast";

export default function ProductionPage() {
  const [sections, setSections] = useState([]);
  const [finalStatement, setFinalStatement] = useState(null);
  const [pageMeta, setPageMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [prodRes, metaRes] = await Promise.all([
        fetch("/api/production"),
        fetch("/api/pages/production"),
      ]);
      const data = await prodRes.json();
      const meta = await metaRes.json();
      setSections(data.sections);
      setFinalStatement(data.finalStatement);
      setPageMeta(meta);
    } catch {
      showToast("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const savePageMeta = async (field, value) => {
    try {
      await fetch("/api/pages/production", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setPageMeta(prev => ({ ...prev, [field]: value }));
    } catch {
      showToast("Save failed", "error");
    }
  };

  const saveSection = async (id, field, value) => {
    try {
      await fetch("/api/production", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      showToast("Saved");
      fetchData();
    } catch {
      showToast("Save failed", "error");
    }
  };

  const saveSectionContent = async (id, content, index, newText) => {
    const newContent = [...content];
    newContent[index] = newText;
    await saveSection(id, "content", newContent);
  };

  const addSectionContent = async (id, content) => {
    await saveSection(id, "content", [...content, "New paragraph..."]);
  };

  const deleteSectionContent = async (id, content, index) => {
    await saveSection(
      id,
      "content",
      content.filter((_, i) => i !== index)
    );
  };

  const addSection = async () => {
    const title = prompt("Enter section title:");
    if (!title) return;
    try {
      await fetch("/api/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      showToast("Section added");
      fetchData();
    } catch {
      showToast("Failed to add section", "error");
    }
  };

  const deleteSection = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await fetch(`/api/production?id=${id}`, { method: "DELETE" });
      showToast("Section deleted");
      fetchData();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  if (loading || !pageMeta) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page-container">
      <EditableText
        tag="p"
        className="section-subtitle"
        value={pageMeta.sectionLabel}
        placeholder="Section label..."
        onSave={(v) => savePageMeta("sectionLabel", v)}
      />
      <EditableText
        tag="h1"
        className="page-title"
        value={pageMeta.title}
        placeholder="Page title..."
        onSave={(v) => savePageMeta("title", v)}
      />
      <EditableText
        tag="p"
        className="page-subtitle"
        multiline
        value={pageMeta.subtitle}
        placeholder="Page subtitle..."
        onSave={(v) => savePageMeta("subtitle", v)}
      />

      <div style={{ marginBottom: 32, marginTop: 16 }}>
        <button className="action-btn" onClick={addSection}>
          + Add Section
        </button>
      </div>

      {sections.map((section) => (
        <div className="production-section" key={section.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <EditableText
              value={section.title}
              onSave={(v) => saveSection(section.id, "title", v)}
              tag="h2"
              placeholder="Section title..."
            />
            <button
              className="card-delete-btn"
              style={{ position: "static", opacity: 0.5 }}
              onClick={() => deleteSection(section.id, section.title)}
              title="Delete section"
            >
              ×
            </button>
          </div>
          <EditableList
            items={section.content}
            onSaveItem={(i, v) =>
              saveSectionContent(section.id, section.content, i, v)
            }
            onAddItem={() => addSectionContent(section.id, section.content)}
            onDeleteItem={(i) =>
              deleteSectionContent(section.id, section.content, i)
            }
          />
        </div>
      ))}

      {finalStatement && (
        <div className="final-statement">
          <EditableText
            value={finalStatement.title}
            onSave={(v) => saveSection(finalStatement.id, "title", v)}
            tag="h2"
            placeholder="Final statement title..."
          />
          <EditableList
            items={finalStatement.content}
            onSaveItem={(i, v) =>
              saveSectionContent(
                finalStatement.id,
                finalStatement.content,
                i,
                v
              )
            }
            onAddItem={() =>
              addSectionContent(finalStatement.id, finalStatement.content)
            }
            onDeleteItem={(i) =>
              deleteSectionContent(
                finalStatement.id,
                finalStatement.content,
                i
              )
            }
          />
        </div>
      )}
    </div>
  );
}
