import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = db.prepare('SELECT * FROM stats WHERE id = 1').get() as any;
    if (!stats) {
      return NextResponse.json({
        success: true,
        data: { total_students: 1056, girls: 438, boys: 618, teachers: 49 },
      });
    }
    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { total_students, girls, boys, teachers } = body;

    const stmt = db.prepare(`
      UPDATE stats
      SET total_students = ?, girls = ?, boys = ?, teachers = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);
    stmt.run(
      Number(total_students) || 0,
      Number(girls) || 0,
      Number(boys) || 0,
      Number(teachers) || 0
    );

    const updated = db.prepare('SELECT * FROM stats WHERE id = 1').get();
    return NextResponse.json({ success: true, data: updated, message: 'Statistika muvaffaqiyatli yangilandi' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
