"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CharacterAvatar from "@/components/CharacterAvatar";
import EditableText from "@/components/EditableText";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showToast } from "@/components/Toast";

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [pageMeta, setPageMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [charRes, metaRes] = await Promise.all([
        fetch("/api/characters"),
        fetch("/api/pages/characters"),
      ]);
      const chars = await charRes.json();
      const meta = await metaRes.json();
      setCharacters(chars);
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
      await fetch("/api/pages/characters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      // Optionally fetch data again or just update state, we assume text update worked locally
      setPageMeta(prev => ({ ...prev, [field]: value }));
    } catch {
      showToast("Save failed", "error");
    }
  };

  const addCharacter = async () => {
    const name = prompt("Enter character name:");
    if (!name) return;
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      showToast(`${name} added`);
      fetchData();
      router.push(`/characters/${data.slug}`);
    } catch {
      showToast("Failed to add character", "error");
    }
  };

  const deleteCharacter = async (e, slug, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await fetch(`/api/characters/${slug}`, { method: "DELETE" });
      showToast(`${name} deleted`);
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

      <div style={{ marginBottom: 24, marginTop: 16 }}>
        <button className="action-btn" onClick={addCharacter}>
          + Add Character
        </button>
      </div>

      <div className="characters-grid">
        {characters.map((character, i) => (
          <Link
            href={`/characters/${character.slug}`}
            className={`character-card stagger-${(i % 6) + 1}`}
            key={character.slug}
            style={{ "--card-accent": character.accentColor }}
          >
            <button
              className="card-delete-btn"
              onClick={(e) =>
                deleteCharacter(e, character.slug, character.name)
              }
              title="Delete character"
            >
              ×
            </button>
            <div className="character-card-header">
              <CharacterAvatar
                slug={character.slug}
                name={character.name}
                accentColor={character.accentColor}
                className="character-avatar"
              />
              <div className="character-meta">
                {character.age && (
                  <span className="character-age">Age {character.age}</span>
                )}
              </div>
            </div>
            <h3 className="character-name">{character.name}</h3>
            <p className="character-role">{character.role}</p>
            <p className="character-summary">{character.summary}</p>
            {character.tagline && (
              <p className="character-tagline">"{character.tagline}"</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
