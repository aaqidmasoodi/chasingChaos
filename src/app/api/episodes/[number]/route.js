import db from "@/lib/db";
import { NextResponse } from "next/server";

function rowToEpisode(row) {
  return {
    number: row.number,
    title: row.title,
    runtime: row.runtime,
    logline: row.logline,
    coldOpen: JSON.parse(row.cold_open),
    acts: JSON.parse(row.acts),
    keyScenes: JSON.parse(row.key_scenes),
    themes: JSON.parse(row.themes),
    sortOrder: row.sort_order,
  };
}

export async function GET(request, { params }) {
  const { number } = await params;
  const result = await db.execute({
    sql: "SELECT * FROM episodes WHERE number = ?",
    args: [parseInt(number)],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(rowToEpisode(result.rows[0]));
}

export async function PUT(request, { params }) {
  const { number } = await params;
  const data = await request.json();

  const fields = [];
  const args = [];

  const simpleFields = ["title", "runtime", "logline"];
  for (const key of simpleFields) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      args.push(data[key]);
    }
  }

  const jsonFieldMap = {
    coldOpen: "cold_open",
    acts: "acts",
    keyScenes: "key_scenes",
    themes: "themes",
  };
  for (const [jsKey, dbKey] of Object.entries(jsonFieldMap)) {
    if (data[jsKey] !== undefined) {
      fields.push(`${dbKey} = ?`);
      args.push(JSON.stringify(data[jsKey]));
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  args.push(parseInt(number));
  await db.execute({
    sql: `UPDATE episodes SET ${fields.join(", ")} WHERE number = ?`,
    args,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { number } = await params;
  await db.execute({
    sql: "DELETE FROM episodes WHERE number = ?",
    args: [parseInt(number)],
  });
  return NextResponse.json({ success: true });
}
