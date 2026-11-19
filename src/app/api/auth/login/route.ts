import { NextResponse } from 'next/server';
import { db, verifyPassword } from '@/lib/db';
import crypto from 'node:crypto';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Login va parol kiritilishi shart' }, { status: 400 });
    }

    const user: any = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ success: false, error: 'Login yoki parol noto‘g‘ri' }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
