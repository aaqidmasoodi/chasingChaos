import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Support seeding either local or Turso via CLI arg
const target = process.argv[2] || "local";

let dbConfig;
if (target === "turso") {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables"
    );
    process.exit(1);
  }
  dbConfig = {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  };
  console.log(`Seeding Turso: ${process.env.TURSO_DATABASE_URL}`);
} else {
  dbConfig = { url: "file:local.db" };
  console.log("Seeding local SQLite: local.db");
}

async function seed() {
  const db = createClient(dbConfig);

  // Run schema
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await db.execute(stmt);
  }
  console.log("✓ Schema created");

  // Import characters
  const { characters } = await import("../data/characters.js");
  for (let i = 0; i < characters.length; i++) {
    const c = characters[i];
    await db.execute({
      sql: `INSERT OR REPLACE INTO characters (slug, name, age, role, job, hometown, summary, tagline, bio, camera_presence, story_arc, accent_color, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        c.slug,
        c.name,
        c.age,
        c.role,
        c.job,
        c.hometown,
        c.summary,
        c.tagline,
        JSON.stringify(c.bio),
        c.cameraPresence,
        c.storyArc,
        c.accentColor,
        i,
      ],
    });
  }
  console.log(`✓ Inserted ${characters.length} characters`);

  // Import episodes
  const { episodes } = await import("../data/episodes.js");
  for (let i = 0; i < episodes.length; i++) {
    const e = episodes[i];
    await db.execute({
      sql: `INSERT OR REPLACE INTO episodes (number, title, runtime, logline, cold_open, acts, key_scenes, themes, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        e.number,
        e.title,
        e.runtime,
        e.logline,
        JSON.stringify(e.coldOpen),
        JSON.stringify(e.acts),
        JSON.stringify(e.keyScenes),
        JSON.stringify(e.themes),
        i,
      ],
    });
  }
  console.log(`✓ Inserted ${episodes.length} episodes`);

  // Import production sections
  const { production } = await import("../data/production.js");
  for (let i = 0; i < production.sections.length; i++) {
    const s = production.sections[i];
    await db.execute({
      sql: `INSERT OR REPLACE INTO production_sections (slug, title, content, is_final_statement, sort_order)
            VALUES (?, ?, ?, 0, ?)`,
      args: [s.id, s.title, JSON.stringify(s.content), i],
    });
  }

  // Insert final statement
  await db.execute({
    sql: `INSERT OR REPLACE INTO production_sections (slug, title, content, is_final_statement, sort_order)
          VALUES (?, ?, ?, 1, ?)`,
    args: [
      "final-statement",
      production.finalStatement.title,
      JSON.stringify(production.finalStatement.content),
      production.sections.length,
    ],
  });
  console.log(
    `✓ Inserted ${production.sections.length + 1} production sections`
  );

  // Seed page meta
  const pages = [
    {
      id: "characters",
      section_label: "Section One",
      title: "Character Profiles",
      subtitle: "Eleven individuals bound together not by sport but by survival. They met in recovery rooms, church basements, and hospital corridors. Now they are attempting the impossible.",
    },
    {
      id: "episodes",
      section_label: "Section Two",
      title: "Episode Breakdown",
      subtitle: "Six episodes mapping the journey from assembly through crisis through return. Each episode is 45 minutes, structured to breathe.",
    },
    {
      id: "production",
      section_label: "Section Three",
      title: "Production Framework",
      subtitle: "The creative architecture, thematic foundations, and production approach that shapes every frame of Chasing Chaos.",
    }
  ];

  for (const p of pages) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO page_meta (id, section_label, title, subtitle) VALUES (?, ?, ?, ?)`,
      args: [p.id, p.section_label, p.title, p.subtitle],
    });
  }
  console.log(`✓ Inserted ${pages.length} page metadata records`);

  console.log("\n🎬 Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
