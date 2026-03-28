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

export async function GET() {
  const result = await db.execute(
    "SELECT * FROM episodes ORDER BY sort_order ASC"
  );
  const episodes = result.rows.map(rowToEpisode);
  return NextResponse.json(episodes);
}

export async function POST(request) {
  const data = await request.json();

  const maxNum = await db.execute(
    "SELECT COALESCE(MAX(number), 0) as max_num FROM episodes"
  );
  const newNumber = data.number || maxNum.rows[0].max_num + 1;

  const maxOrder = await db.execute(
    "SELECT COALESCE(MAX(sort_order), -1) as max_order FROM episodes"
  );

  await db.execute({
    sql: `INSERT INTO episodes (number, title, runtime, logline, cold_open, acts, key_scenes, themes, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      newNumber,
      data.title || "New Episode",
      data.runtime || "45 minutes",
      data.logline || "",
      JSON.stringify(data.coldOpen || { description: "", details: "" }),
      JSON.stringify(data.acts || []),
      JSON.stringify(data.keyScenes || []),
      JSON.stringify(data.themes || []),
      maxOrder.rows[0].max_order + 1,
    ],
  });

  return NextResponse.json({ number: newNumber }, { status: 201 });
}
