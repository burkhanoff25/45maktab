import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifyTelegramAdmins, escapeHtml } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, phone, email, subject, message } = body;

    if (!full_name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Ism, telefon va xabar matni to‘ldirilishi shart' },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO contacts_inquiries (full_name, phone, email, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(full_name, phone, email || '', subject || 'Sayt orqali murojaat', message);

    // Telegram Bot Notification
    const tgMsg =
      `📩 <b>YANGI MUROJAAT (Next.js Sayt orqali)</b>\n\n` +
      `👤 <b>F.I.SH.:</b> ${escapeHtml(full_name)}\n` +
      `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>\n` +
      (email ? `✉️ <b>Email:</b> ${escapeHtml(email)}\n` : '') +
      (subject ? `📌 <b>Mavzu:</b> ${escapeHtml(subject)}\n` : '') +
      `\n💬 <b>Murojaat matni:</b>\n${escapeHtml(message)}\n\n` +
      `📅 <i>Sana: ${new Date().toLocaleString('uz-UZ')}</i>\n` +
      `🏫 <i>45-sonli maktab rasmiy portali</i>`;

    notifyTelegramAdmins(tgMsg);

    return NextResponse.json({
      success: true,
      message: 'Murojaatingiz muvaffaqiyatli qabul qilindi',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = db.prepare('SELECT * FROM contacts_inquiries ORDER BY id DESC').all();
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
