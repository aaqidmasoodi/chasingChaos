"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import CharacterAvatar from "@/components/CharacterAvatar";
import EditableText from "@/components/EditableText";
import EditableList from "@/components/EditableList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showToast } from "@/components/Toast";

export default function CharacterDetailPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/characters/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setCharacter(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  const saveField = async (field, value) => {
    try {
      await fetch(`/api/characters/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setCharacter((prev) => ({ ...prev, [field]: value }));
      showToast("Saved");
    } catch {
      showToast("Save failed", "error");
    }
  };

  const saveBioItem = async (index, newText) => {
    const newBio = [...character.bio];
    newBio[index] = newText;
    await saveField("bio", newBio);
  };

  const addBioItem = async () => {
    const newBio = [...character.bio, "New paragraph..."];
    await saveField("bio", newBio);
  };

  const deleteBioItem = async (index) => {
    const newBio = character.bio.filter((_, i) => i !== index);
    await saveField("bio", newBio);
  };

  const deleteCharacter = async () => {
    if (!confirm(`Delete ${character.name}? This cannot be undone.`)) return;
    try {
      await fetch(`/api/characters/${slug}`, { method: "DELETE" });
      showToast(`${character.name} deleted`);
      router.push("/characters");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="page-container">
        <Link href="/characters" className="back-link">
          ← Back to Characters
        </Link>
        <h1 className="page-title">Character not found</h1>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link href="/characters" className="back-link">
        ← Back to Characters
      </Link>

      <div className="character-detail-header">
        <CharacterAvatar
          slug={character.slug}
          name={character.name}
          accentColor={character.accentColor}
          className="character-detail-avatar"
        />
        <EditableText
          value={character.name}
          onSave={(v) => saveField("name", v)}
          className="page-title"
          tag="h1"
        />
        <EditableText
          value={character.role}
          onSave={(v) => saveField("role", v)}
          className="character-role"
          tag="p"
          placeholder="Role..."
        />
        <EditableText
          value={character.tagline ? `"${character.tagline}"` : ""}
          onSave={(v) => saveField("tagline", v.replace(/^"|"$/g, ""))}
          tag="p"
          className="character-tagline"
          placeholder="Tagline..."
        />
        <div className="character-detail-meta">
          <div className="character-detail-meta-item">
            <span>Age</span>
            <EditableText
              value={character.age ? String(character.age) : ""}
              onSave={(v) => saveField("age", v ? parseInt(v) : null)}
              placeholder="—"
            />
          </div>
          <div className="character-detail-meta-item">
            <span>Hometown</span>
            <EditableText
              value={character.hometown}
              onSave={(v) => saveField("hometown", v)}
              placeholder="—"
            />
          </div>
          <div className="character-detail-meta-item">
            <span>Job</span>
            <EditableText
              value={character.job}
              onSave={(v) => saveField("job", v)}
              placeholder="—"
            />
          </div>
        </div>
      </div>

      <div className="character-detail-section">
        <h3>Summary</h3>
        <EditableText
          value={character.summary}
          onSave={(v) => saveField("summary", v)}
          multiline
          tag="p"
          placeholder="Character summary..."
        />
      </div>

      <div className="character-detail-section">
        <h3>Biography</h3>
        <EditableList
          items={character.bio}
          onSaveItem={saveBioItem}
          onAddItem={addBioItem}
          onDeleteItem={deleteBioItem}
        />
      </div>

      <div className="character-detail-section">
        <h3>Camera Presence</h3>
        <EditableText
          value={character.cameraPresence}
          onSave={(v) => saveField("cameraPresence", v)}
          multiline
          tag="p"
          placeholder="Camera presence notes..."
        />
      </div>

      <div className="character-detail-section">
        <h3>Story Arc</h3>
        <EditableText
          value={character.storyArc}
          onSave={(v) => saveField("storyArc", v)}
          multiline
          tag="p"
          placeholder="Story arc notes..."
        />
      </div>

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
        <button className="action-btn action-btn-danger" onClick={deleteCharacter}>
          Delete Character
        </button>
      </div>
    </div>
  );
}
