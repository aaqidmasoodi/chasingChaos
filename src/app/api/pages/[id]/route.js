import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const result = await db.execute({
    sql: "SELECT * FROM page_meta WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ id, section_label: "", title: "", subtitle: "" });
  }

  const row = result.rows[0];
  return NextResponse.json({
    id: row.id,
    sectionLabel: row.section_label,
    title: row.title,
    subtitle: row.subtitle,
  });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const data = await request.json();

  const fields = [];
  const args = [];

  const fieldMap = {
    sectionLabel: "section_label",
    title: "title",
    subtitle: "subtitle",
  };

  for (const [jsKey, dbKey] of Object.entries(fieldMap)) {
    if (data[jsKey] !== undefined) {
      fields.push(`${dbKey} = ?`);
      args.push(data[jsKey]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  args.push(id);
  await db.execute({
    sql: `UPDATE page_meta SET ${fields.join(", ")} WHERE id = ?`,
    args,
  });

  return NextResponse.json({ success: true });
}
