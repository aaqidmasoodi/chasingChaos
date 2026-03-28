import Link from "next/link";
import { characters } from "@/data/characters";
import CharacterAvatar from "@/components/CharacterAvatar";

export const metadata = {
  title: "Characters, Chasing Chaos",
  description: "Meet the team behind the Baja 1000 attempt.",
};

export default function CharactersPage() {
  return (
    <div className="page-container">
      <div className="section-subtitle">Section One</div>
      <h1 className="page-title">Character Profiles</h1>
      <p className="page-subtitle">
        Eleven individuals bound together not by sport but by survival. They met
        in recovery rooms, church basements, and hospital corridors. Now they
        are attempting the impossible.
      </p>

      <div className="characters-grid">
        {characters.map((char, i) => (
          <Link
            key={char.slug}
            href={`/characters/${char.slug}`}
            className={`character-card stagger-${(i % 6) + 1}`}
            style={{ "--card-accent": char.accentColor, animationFillMode: "both", animation: `fadeInUp 0.5s var(--ease-out) ${i * 0.06}s` }}
          >
            <div className="character-card-header">
              <CharacterAvatar
                slug={char.slug}
                name={char.name}
                accentColor={char.accentColor}
                className="character-avatar"
                size={48}
              />
              <div className="character-meta">
                {char.age && (
                  <div className="character-age">Age {char.age}</div>
                )}
              </div>
            </div>
            <div className="character-name">{char.name}</div>
            <div className="character-role">{char.role}</div>
            <p className="character-summary">{char.summary}</p>
            <div className="character-tagline">&ldquo;{char.tagline}&rdquo;</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
