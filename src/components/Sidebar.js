"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { characters } from "@/data/characters";
import { episodes } from "@/data/episodes";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1>Chasing Chaos</h1>
          <p>Series Bible, First Draft</p>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {/* Characters Section */}
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
          {characters.map((char) => (
            <Link
              key={char.slug}
              href={`/characters/${char.slug}`}
              className={`sidebar-link ${
                pathname === `/characters/${char.slug}` ? "active" : ""
              }`}
            >
              {char.name}
            </Link>
          ))}
        </div>

        {/* Episodes Section */}
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
          {episodes.map((ep) => (
            <Link
              key={ep.number}
              href={`/episodes/${ep.number}`}
              className={`sidebar-link ${
                pathname === `/episodes/${ep.number}` ? "active" : ""
              }`}
            >
              Ep {ep.number}: {ep.title}
            </Link>
          ))}
        </div>

        {/* Production Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Production</div>
          <Link
            href="/production"
            className={`sidebar-link ${
              pathname === "/production" ? "active" : ""
            }`}
          >
            Framework & Intentions
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        6 Episodes · 45 min each
      </div>
    </aside>
  );
}
