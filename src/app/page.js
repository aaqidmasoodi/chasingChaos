"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [characterCount, setCharacterCount] = useState(0);
  const [episodeCount, setEpisodeCount] = useState(0);

  useEffect(() => {
    fetch("/api/characters")
      .then((r) => r.json())
      .then((data) => setCharacterCount(data.length))
      .catch(() => {});
    fetch("/api/episodes")
      .then((r) => r.json())
      .then((data) => setEpisodeCount(data.length))
      .catch(() => {});
  }, []);

  return (
    <div className="hero">
      <div className="hero-bg"></div>
      <div className="page-container">
        <p className="hero-tagline">A Documentary Series</p>
        <h1 className="hero-title">Chasing Chaos</h1>

        <div className="hero-series-info">
          <div className="hero-info-item">
            <strong>{characterCount}</strong>
            Characters
          </div>
          <div className="hero-info-item">
            <strong>{episodeCount}</strong>
            Episodes
          </div>
          <div className="hero-info-item">
            <strong>45 min</strong>
            Each
          </div>
        </div>

        <p className="hero-logline">
          A group of friends who met in recovery attempt to conquer the brutal
          Baja 1000, risking their money, relationships, and lives as they train
          in the world's most unforgiving desert race.
        </p>

        <div className="hero-nav-cards">
          <Link href="/characters" className="hero-nav-card">
            <h3>Characters</h3>
            <p>
              Meet the team, from venture capitalists to ex-convicts, united by
              recovery and bound for the desert.
            </p>
          </Link>
          <Link href="/episodes" className="hero-nav-card">
            <h3>Episodes</h3>
            <p>
              Six episodes. Assembly through reckoning. The shape of recovery
              itself.
            </p>
          </Link>
          <Link href="/production" className="hero-nav-card">
            <h3>Production</h3>
            <p>Tone, approach, and the creative framework behind the series.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
