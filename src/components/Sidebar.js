"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [characters, setCharacters] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    fetch("/api/characters")
      .then((r) => r.json())
      .then(setCharacters)
      .catch(() => {});
    fetch("/api/episodes")
      .then((r) => r.json())
      .then(setEpisodes)
      .catch(() => {});
  }, [pathname]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>Chasing Chaos</h1>
          <p>Series Bible, First Draft</p>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">Characters</div>
          <Link
            href="/characters"
            className={`sidebar-link ${
              pathname === "/characters" ? "active" : ""
            }`}
          >
            All Characters
          </Link>
          {characters.map((c) => (
            <Link
              key={c.slug}
              href={`/characters/${c.slug}`}
              className={`sidebar-link ${
                pathname === `/characters/${c.slug}` ? "active" : ""
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Episodes</div>
          <Link
            href="/episodes"
            className={`sidebar-link ${
              pathname === "/episodes" ? "active" : ""
            }`}
          >
            All Episodes
          </Link>
          {episodes.map((e) => (
            <Link
              key={e.number}
              href={`/episodes/${e.number}`}
              className={`sidebar-link ${
                pathname === `/episodes/${e.number}` ? "active" : ""
              }`}
            >
              Ep {e.number}: {e.title}
            </Link>
          ))}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Production</div>
          <Link
            href="/production"
            className={`sidebar-link ${
              pathname === "/production" ? "active" : ""
            }`}
          >
            Framework
          </Link>
        </div>
      </nav>
      <div className="sidebar-footer">
        6 episodes · 45 min each
      </div>
    </aside>
  );
}
