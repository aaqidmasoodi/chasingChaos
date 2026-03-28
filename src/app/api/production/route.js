import db from "@/lib/db";
import { NextResponse } from "next/server";

function rowToSection(row) {
  return {
    id: row.slug,
    title: row.title,
    content: JSON.parse(row.content),
    isFinalStatement: Boolean(row.is_final_statement),
    sortOrder: row.sort_order,
  };
}

export async function GET() {
  const result = await db.execute(
    "SELECT * FROM production_sections ORDER BY sort_order ASC"
  );
  const sections = result.rows.map(rowToSection);

  const regular = sections.filter((s) => !s.isFinalStatement);
  const final = sections.find((s) => s.isFinalStatement);

  return NextResponse.json({
    sections: regular,
    finalStatement: final || null,
  });
}

export async function PUT(request) {
  const data = await request.json();

  if (!data.id) {
    return NextResponse.json({ error: "Section id required" }, { status: 400 });
  }

  const fields = [];
  const args = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    args.push(data.title);
  }
  if (data.content !== undefined) {
    fields.push("content = ?");
    args.push(JSON.stringify(data.content));
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  args.push(data.id);
  await db.execute({
    sql: `UPDATE production_sections SET ${fields.join(", ")} WHERE slug = ?`,
    args,
  });

  return NextResponse.json({ success: true });
}

export async function POST(request) {
  const data = await request.json();
  const slug =
    data.id ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const maxOrder = await db.execute(
    "SELECT COALESCE(MAX(sort_order), -1) as max_order FROM production_sections WHERE is_final_statement = 0"
  );

  await db.execute({
    sql: `INSERT INTO production_sections (slug, title, content, is_final_statement, sort_order)
          VALUES (?, ?, ?, 0, ?)`,
    args: [
      slug,
      data.title || "New Section",
      JSON.stringify(data.content || []),
      maxOrder.rows[0].max_order + 1,
    ],
  });

  return NextResponse.json({ id: slug }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Section id required" }, { status: 400 });
  }

  await db.execute({
    sql: "DELETE FROM production_sections WHERE slug = ?",
    args: [id],
  });

  return NextResponse.json({ success: true });
}
