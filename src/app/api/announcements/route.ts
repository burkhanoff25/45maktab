import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyTelegramAdmins, escapeHtml } from '@/lib/telegram';

export async function GET() {
  try {
    const list = db.prepare('SELECT * FROM announcements ORDER BY id DESC').all();
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title_uz, title_ru, content_uz, content_ru, event_date, is_urgent } = body;

    if (!title_uz || !content_uz) {
      return NextResponse.json({ success: false, error: 'Ma’lumot to‘liq emas' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO announcements (title_uz, title_ru, content_uz, content_ru, event_date, is_urgent)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title_uz,
      title_ru || title_uz,
      content_uz,
      content_ru || content_uz,
      event_date || '',
      is_urgent ? 1 : 0
    );

    // Notify Telegram Admins
    const urgentBadge = is_urgent ? '⚠️ <b>SHOSHILINCH E‘LON!</b>\n' : '📢 <b>YANGI E‘LON!</b>\n';
    const tgMsg =
      `${urgentBadge}<b>Sarlavha:</b> ${escapeHtml(title_uz)}\n` +
      (event_date ? `<b>Sana:</b> ${escapeHtml(event_date)}\n` : '') +
      `<b>Batafsil:</b> ${escapeHtml(content_uz)}\n\n` +
      `<i>45-maktab rasmiy sayti</i>`;
    notifyTelegramAdmins(tgMsg);

    return NextResponse.json({ success: true, id: Number(info.lastInsertRowid) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
