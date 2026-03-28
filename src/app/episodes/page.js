import Link from "next/link";
import { episodes } from "@/data/episodes";

export const metadata = {
  title: "Episodes, Chasing Chaos",
  description:
    "Six episodes, each 45 minutes. From assembly through the desert to the return.",
};

export default function EpisodesPage() {
  return (
    <div className="page-container">
      <div className="section-subtitle">Section Two</div>
      <h1 className="page-title">Episode-by-Episode Synopsis</h1>
      <p className="page-subtitle">
        Six episodes. Forty-five minutes each. The series arc moves from assembly
        through testing through crisis through reckoning through return. It is
        the shape of recovery itself.
      </p>

      <div className="episodes-timeline">
        {episodes.map((ep, i) => (
          <Link
            key={ep.number}
            href={`/episodes/${ep.number}`}
            className="episode-card"
            style={{
              animationFillMode: "both",
              animation: `fadeInUp 0.5s var(--ease-out) ${i * 0.1}s`,
            }}
          >
            <div className="episode-number">Episode {ep.number}</div>
            <div className="episode-title">&ldquo;{ep.title}&rdquo;</div>
            <div className="episode-runtime">{ep.runtime}</div>
            <p className="episode-logline">{ep.logline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
