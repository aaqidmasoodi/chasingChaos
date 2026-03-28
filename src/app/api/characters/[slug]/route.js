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

export async function GET(request, { params }) {
  const { slug } = await params;
  const result = await db.execute({
    sql: "SELECT * FROM characters WHERE slug = ?",
    args: [slug],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rowToCharacter(result.rows[0]));
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const data = await request.json();

  const fields = [];
  const args = [];

  const fieldMap = {
    name: "name",
    age: "age",
    role: "role",
    job: "job",
    hometown: "hometown",
    summary: "summary",
    tagline: "tagline",
    cameraPresence: "camera_presence",
    storyArc: "story_arc",
    accentColor: "accent_color",
  };

  for (const [jsKey, dbKey] of Object.entries(fieldMap)) {
    if (data[jsKey] !== undefined) {
      fields.push(`${dbKey} = ?`);
      args.push(data[jsKey]);
    }
  }

  if (data.bio !== undefined) {
    fields.push("bio = ?");
    args.push(JSON.stringify(data.bio));
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  args.push(slug);
  await db.execute({
    sql: `UPDATE characters SET ${fields.join(", ")} WHERE slug = ?`,
    args,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { slug } = await params;
  await db.execute({
    sql: "DELETE FROM characters WHERE slug = ?",
    args: [slug],
  });
  return NextResponse.json({ success: true });
}
