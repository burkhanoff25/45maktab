import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = db.prepare('SELECT * FROM news ORDER BY id DESC').all();
    const formatted = list.map((item: any) => ({
      ...item,
      images: JSON.parse(item.images || '[]'),
    }));
    return NextResponse.json({ success: true, data: formatted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title_uz, title_ru, body_uz, body_ru, category, date, images } = body;

    if (!title_uz || !title_ru || !body_uz || !body_ru) {
      return NextResponse.json(
        { success: false, error: 'Sarlavha va matn talab qilinadi' },
        { status: 400 }
      );
    }

    const currentDate = date || new Date().toLocaleDateString('uz-UZ');
    const stmt = db.prepare(`
      INSERT INTO news (title_uz, title_ru, body_uz, body_ru, category, date, images)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title_uz,
      title_ru,
      body_uz,
      body_ru,
      category || 'Ta’lim',
      currentDate,
      JSON.stringify(images || [])
    );

    return NextResponse.json({
      success: true,
      id: Number(info.lastInsertRowid),
      message: 'Yangilik muvaffaqiyatli qo‘shildi',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
