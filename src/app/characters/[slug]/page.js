import Link from "next/link";
import { notFound } from "next/navigation";
import { characters } from "@/data/characters";
import CharacterAvatar from "@/components/CharacterAvatar";

export function generateStaticParams() {
  return characters.map((char) => ({ slug: char.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const character = characters.find((c) => c.slug === slug);
  if (!character) return { title: "Not Found" };
  return {
    title: `${character.name}, Chasing Chaos`,
    description: character.summary,
  };
}

export default async function CharacterDetailPage({ params }) {
  const { slug } = await params;
  const character = characters.find((c) => c.slug === slug);
  if (!character) notFound();

  const currentIndex = characters.findIndex((c) => c.slug === slug);
  const prevChar = currentIndex > 0 ? characters[currentIndex - 1] : null;
  const nextChar =
    currentIndex < characters.length - 1 ? characters[currentIndex + 1] : null;

  return (
    <div className="page-container">
      <Link href="/characters" className="back-link">
        ← All Characters
      </Link>

      <div className="character-detail-header">
        <CharacterAvatar
          slug={character.slug}
          name={character.name}
          accentColor={character.accentColor}
          className="character-detail-avatar"
          size={72}
        />
        <div className="section-subtitle">{character.role}</div>
        <h1 className="page-title">{character.name}</h1>
        <p
          style={{
            fontStyle: "italic",
            color: "var(--text-tertiary)",
            fontSize: "15px",
            marginBottom: "16px",
          }}
        >
          &ldquo;{character.tagline}&rdquo;
        </p>
        <div className="character-detail-meta">
          {character.age && (
            <div className="character-detail-meta-item">
              <span>Age</span>
              {character.age}
            </div>
          )}
          <div className="character-detail-meta-item">
            <span>Role</span>
            {character.role}
          </div>
          <div className="character-detail-meta-item">
            <span>Job</span>
            {character.job}
          </div>
          <div className="character-detail-meta-item">
            <span>Hometown</span>
            {character.hometown}
          </div>
        </div>
      </div>

      <div className="character-detail-section">
        <h3>Biography</h3>
        {character.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="character-detail-section">
        <h3>Camera Presence</h3>
        <p>{character.cameraPresence}</p>
      </div>

      <div className="character-detail-section">
        <h3>Story Arc Across the Series</h3>
        <p>{character.storyArc}</p>
      </div>

      {/* Navigation between characters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {prevChar ? (
          <Link
            href={`/characters/${prevChar.slug}`}
            style={{
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "13px",
              transition: "color 0.2s",
            }}
          >
            ← {prevChar.name}
          </Link>
        ) : (
          <span />
        )}
        {nextChar ? (
          <Link
            href={`/characters/${nextChar.slug}`}
            style={{
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "13px",
              transition: "color 0.2s",
            }}
          >
            {nextChar.name} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
