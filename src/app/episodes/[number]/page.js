import Link from "next/link";
import { notFound } from "next/navigation";
import { episodes } from "@/data/episodes";

export function generateStaticParams() {
  return episodes.map((ep) => ({ number: String(ep.number) }));
}

export async function generateMetadata({ params }) {
  const { number } = await params;
  const episode = episodes.find((e) => String(e.number) === number);
  if (!episode) return { title: "Not Found" };
  return {
    title: `Episode ${episode.number}: ${episode.title}, Chasing Chaos`,
    description: episode.logline,
  };
}

export default async function EpisodeDetailPage({ params }) {
  const { number } = await params;
  const episode = episodes.find((e) => String(e.number) === number);
  if (!episode) notFound();

  const prevEp =
    episode.number > 1
      ? episodes.find((e) => e.number === episode.number - 1)
      : null;
  const nextEp =
    episode.number < 6
      ? episodes.find((e) => e.number === episode.number + 1)
      : null;

  return (
    <div className="page-container">
      <Link href="/episodes" className="back-link">
        ← All Episodes
      </Link>

      <div className="episode-detail-header">
        <div className="section-subtitle">
          Episode {episode.number} · {episode.runtime}
        </div>
        <h1 className="page-title">&ldquo;{episode.title}&rdquo;</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          {episode.logline}
        </p>
      </div>

      {/* Cold Open */}
      <div className="cold-open-panel">
        <div className="cold-open-label">Cold Open</div>
        <div className="cold-open-text">
          <p>{episode.coldOpen.description}</p>
          <p>{episode.coldOpen.details}</p>
        </div>
      </div>

      {/* Acts */}
      {episode.acts.map((act, i) => (
        <div key={i} className="act-panel">
          <h2 className="act-title">{act.title}</h2>
          <div className="act-content">
            {act.content.map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}

      {/* Key Scenes */}
      <div className="key-scenes-panel">
        <h3>Key Scenes to Find and Hold</h3>
        <ul className="key-scenes-list">
          {episode.keyScenes.map((scene, i) => (
            <li key={i}>{scene}</li>
          ))}
        </ul>
      </div>

      {/* Themes */}
      <div className="themes-panel">
        <h3>Themes</h3>
        <div className="themes-list">
          {episode.themes.map((theme, i) => (
            <span key={i} className="theme-tag">
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Episode Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {prevEp ? (
          <Link
            href={`/episodes/${prevEp.number}`}
            style={{
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "13px",
            }}
          >
            ← Ep {prevEp.number}: {prevEp.title}
          </Link>
        ) : (
          <span />
        )}
        {nextEp ? (
          <Link
            href={`/episodes/${nextEp.number}`}
            style={{
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "13px",
            }}
          >
            Ep {nextEp.number}: {nextEp.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
