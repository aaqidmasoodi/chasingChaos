"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import EditableText from "@/components/EditableText";
import EditableList from "@/components/EditableList";
import { showToast } from "@/components/Toast";

export default function EpisodeDetailPage({ params }) {
  const { number } = use(params);
  const router = useRouter();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/episodes/${number}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setEpisode(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [number]);

  const saveField = async (field, value) => {
    try {
      await fetch(`/api/episodes/${number}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setEpisode((prev) => ({ ...prev, [field]: value }));
      showToast("Saved");
    } catch {
      showToast("Save failed", "error");
    }
  };

  // Cold open helpers
  const saveColdOpen = async (key, value) => {
    const newColdOpen = { ...episode.coldOpen, [key]: value };
    await saveField("coldOpen", newColdOpen);
  };

  // Act helpers
  const saveActTitle = async (actIndex, value) => {
    const newActs = [...episode.acts];
    newActs[actIndex] = { ...newActs[actIndex], title: value };
    await saveField("acts", newActs);
  };

  const saveActContent = async (actIndex, contentIndex, value) => {
    const newActs = [...episode.acts];
    const newContent = [...newActs[actIndex].content];
    newContent[contentIndex] = value;
    newActs[actIndex] = { ...newActs[actIndex], content: newContent };
    await saveField("acts", newActs);
  };

  const addActContent = async (actIndex) => {
    const newActs = [...episode.acts];
    newActs[actIndex] = {
      ...newActs[actIndex],
      content: [...newActs[actIndex].content, "New paragraph..."],
    };
    await saveField("acts", newActs);
  };

  const deleteActContent = async (actIndex, contentIndex) => {
    const newActs = [...episode.acts];
    newActs[actIndex] = {
      ...newActs[actIndex],
      content: newActs[actIndex].content.filter((_, i) => i !== contentIndex),
    };
    await saveField("acts", newActs);
  };

  const addAct = async () => {
    const newActs = [
      ...episode.acts,
      { title: "New Act", content: ["New paragraph..."] },
    ];
    await saveField("acts", newActs);
  };

  const deleteAct = async (actIndex) => {
    if (!confirm("Delete this act?")) return;
    const newActs = episode.acts.filter((_, i) => i !== actIndex);
    await saveField("acts", newActs);
  };

  // Key scenes helpers
  const saveKeyScene = async (index, value) => {
    const newScenes = [...episode.keyScenes];
    newScenes[index] = value;
    await saveField("keyScenes", newScenes);
  };

  const addKeyScene = async () => {
    await saveField("keyScenes", [...episode.keyScenes, "New scene..."]);
  };

  const deleteKeyScene = async (index) => {
    await saveField(
      "keyScenes",
      episode.keyScenes.filter((_, i) => i !== index)
    );
  };

  // Theme helpers
  const saveTheme = async (index, value) => {
    const newThemes = [...episode.themes];
    newThemes[index] = value;
    await saveField("themes", newThemes);
  };

  const addTheme = async () => {
    await saveField("themes", [...episode.themes, "New theme"]);
  };

  const deleteTheme = async (index) => {
    await saveField(
      "themes",
      episode.themes.filter((_, i) => i !== index)
    );
  };

  const deleteEpisode = async () => {
    if (!confirm(`Delete Episode ${number}? This cannot be undone.`)) return;
    try {
      await fetch(`/api/episodes/${number}`, { method: "DELETE" });
      showToast("Episode deleted");
      router.push("/episodes");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="page-container">
        <Link href="/episodes" className="back-link">
          ← Back to Episodes
        </Link>
        <h1 className="page-title">Episode not found</h1>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link href="/episodes" className="back-link">
        ← Back to Episodes
      </Link>

      <div className="episode-detail-header">
        <p className="section-subtitle">Episode {episode.number}</p>
        <EditableText
          value={episode.title}
          onSave={(v) => saveField("title", v)}
          className="page-title"
          tag="h1"
        />
        <EditableText
          value={episode.logline}
          onSave={(v) => saveField("logline", v)}
          multiline
          className="page-subtitle"
          tag="p"
        />
      </div>

      {/* Cold Open */}
      <div className="cold-open-panel">
        <p className="cold-open-label">Cold Open</p>
        <div className="cold-open-text">
          <EditableText
            value={episode.coldOpen?.description}
            onSave={(v) => saveColdOpen("description", v)}
            multiline
            tag="p"
            placeholder="Cold open description..."
          />
          <EditableText
            value={episode.coldOpen?.details}
            onSave={(v) => saveColdOpen("details", v)}
            multiline
            tag="p"
            placeholder="Cold open details..."
          />
        </div>
      </div>

      {/* Acts */}
      {episode.acts.map((act, actIndex) => (
        <div className="act-panel" key={actIndex}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <EditableText
              value={act.title}
              onSave={(v) => saveActTitle(actIndex, v)}
              className="act-title"
              tag="h3"
              placeholder="Act title..."
            />
            <button
              className="card-delete-btn"
              style={{ position: "static", opacity: 0.5 }}
              onClick={() => deleteAct(actIndex)}
              title="Delete act"
            >
              ×
            </button>
          </div>
          <div className="act-content">
            <EditableList
              items={act.content}
              onSaveItem={(i, v) => saveActContent(actIndex, i, v)}
              onAddItem={() => addActContent(actIndex)}
              onDeleteItem={(i) => deleteActContent(actIndex, i)}
            />
          </div>
        </div>
      ))}
      <button className="action-btn" onClick={addAct} style={{ marginBottom: 40 }}>
        + Add Act
      </button>

      {/* Key Scenes */}
      <div className="key-scenes-panel">
        <h3>Key Scenes</h3>
        <EditableList
          items={episode.keyScenes}
          onSaveItem={saveKeyScene}
          onAddItem={addKeyScene}
          onDeleteItem={deleteKeyScene}
        />
      </div>

      {/* Themes */}
      <div className="themes-panel">
        <h3>Themes</h3>
        <div className="themes-list">
          {episode.themes.map((theme, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <EditableText
                value={theme}
                onSave={(v) => saveTheme(i, v)}
                className="theme-tag"
                tag="span"
              />
              <button
                className="editable-list-delete"
                onClick={() => deleteTheme(i)}
                style={{ opacity: 0.4 }}
                title="Remove theme"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          className="editable-list-add"
          onClick={addTheme}
          style={{ maxWidth: 200, marginTop: 12 }}
        >
          + Add Theme
        </button>
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
        <button className="action-btn action-btn-danger" onClick={deleteEpisode}>
          Delete Episode
        </button>
      </div>
    </div>
  );
}
