"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import EditableText from "@/components/EditableText";
import { showToast } from "@/components/Toast";

export default function EpisodesPage() {
  const router = useRouter();
  const [episodes, setEpisodes] = useState([]);
  const [pageMeta, setPageMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [epRes, metaRes] = await Promise.all([
        fetch("/api/episodes"),
        fetch("/api/pages/episodes"),
      ]);
      const eps = await epRes.json();
      const meta = await metaRes.json();
      setEpisodes(eps);
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
      await fetch("/api/pages/episodes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setPageMeta(prev => ({ ...prev, [field]: value }));
    } catch {
      showToast("Save failed", "error");
    }
  };

  const addEpisode = async () => {
    const title = prompt("Enter episode title:");
    if (!title) return;
    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      showToast(`Episode ${data.number} added`);
      fetchData();
      router.push(`/episodes/${data.number}`);
    } catch {
      showToast("Failed to add episode", "error");
    }
  };

  const deleteEpisode = async (e, number, title) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete Episode ${number}: ${title}?`)) return;
    try {
      await fetch(`/api/episodes/${number}`, { method: "DELETE" });
      showToast(`Episode ${number} deleted`);
      fetchData();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  if (loading || !pageMeta) {
    return (
      <div className="page-container">
        <p style={{ color: "var(--text-tertiary)" }}>Loading...</p>
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

      <div style={{ marginBottom: 24, marginTop: 16 }}>
        <button className="action-btn" onClick={addEpisode}>
          + Add Episode
        </button>
      </div>

      <div className="episodes-timeline">
        {episodes.map((episode, i) => (
          <Link
            href={`/episodes/${episode.number}`}
            className={`episode-card stagger-${(i % 6) + 1}`}
            key={episode.number}
          >
            <button
              className="card-delete-btn"
              onClick={(e) => deleteEpisode(e, episode.number, episode.title)}
              title="Delete episode"
            >
              ×
            </button>
            <p className="episode-number">Episode {episode.number}</p>
            <h3 className="episode-title">{episode.title}</h3>
            <p className="episode-runtime">{episode.runtime}</p>
            <p className="episode-logline">{episode.logline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
