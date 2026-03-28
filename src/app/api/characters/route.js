import db from "@/lib/db";
import { NextResponse } from "next/server";

function rowToCharacter(row) {
  return {
    slug: row.slug,
    name: row.name,
    age: row.age,
    role: row.role,
    job: row.job,
    hometown: row.hometown,
    summary: row.summary,
    tagline: row.tagline,
    bio: JSON.parse(row.bio),
    cameraPresence: row.camera_presence,
    storyArc: row.story_arc,
    accentColor: row.accent_color,
    sortOrder: row.sort_order,
  };
}

export async function GET() {
  const result = await db.execute(
    "SELECT * FROM characters ORDER BY sort_order ASC"
  );
  const characters = result.rows.map(rowToCharacter);
  return NextResponse.json(characters);
}

export async function POST(request) {
  const data = await request.json();
  const slug =
    data.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const maxOrder = await db.execute(
    "SELECT COALESCE(MAX(sort_order), -1) as max_order FROM characters"
  );

  await db.execute({
    sql: `INSERT INTO characters (slug, name, age, role, job, hometown, summary, tagline, bio, camera_presence, story_arc, accent_color, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      slug,
      data.name || "New Character",
      data.age || null,
      data.role || "",
      data.job || "",
      data.hometown || "",
      data.summary || "",
      data.tagline || "",
      JSON.stringify(data.bio || []),
      data.cameraPresence || "",
      data.storyArc || "",
      data.accentColor || "#D4A574",
      maxOrder.rows[0].max_order + 1,
    ],
  });

  return NextResponse.json({ slug }, { status: 201 });
}
