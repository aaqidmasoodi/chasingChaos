import Link from "next/link";

export default function Home() {
  return (
    <div className="page-container">
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-tagline">A Documentary Series</div>
        <h1 className="hero-title">Chasing Chaos</h1>
        <p className="hero-logline">
          A group of friends who met in recovery attempt to conquer the brutal
          Baja 1000, risking their money, relationships, and lives as they train
          in the world&apos;s most unforgiving desert race.
        </p>

        <div className="hero-series-info">
          <div className="hero-info-item">
            <strong>6</strong>
            Episodes
          </div>
          <div className="hero-info-item">
            <strong>45 min</strong>
            Per Episode
          </div>
          <div className="hero-info-item">
            <strong>11</strong>
            Characters
          </div>
        </div>

        <div className="hero-nav-cards">
          <Link href="/characters" className="hero-nav-card">
            <h3>Characters</h3>
            <p>
              Meet the team, from venture capitalists to ex-convicts, united by
              recovery.
            </p>
          </Link>
          <Link href="/episodes" className="hero-nav-card">
            <h3>Episodes</h3>
            <p>
              Six episodes, each 45 minutes. Assembly through reckoning through
              return.
            </p>
          </Link>
          <Link href="/production" className="hero-nav-card">
            <h3>Production</h3>
            <p>
              Framework, tone, metaphors, and the handling of difficult material.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
