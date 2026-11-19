import path from 'node:path';
import crypto from 'node:crypto';

let dbInstance: any = null;

function getDb() {
  if (dbInstance) return dbInstance;
  try {
    const { DatabaseSync } = require('node:sqlite');
    const DB_PATH = path.join(process.cwd(), 'data', 'school45.db');
    dbInstance = new DatabaseSync(DB_PATH);
    dbInstance.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);
    return dbInstance;
  } catch (err) {
    console.warn('SQLite native module not available in current environment:', err);
    return null;
  }
}

export function hashPassword(password: string, salt: string | null = null): string {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(verifyHash, 'hex'), Buffer.from(originalHash, 'hex'));
}

// In-memory store for serverless/edge environments
const serverlessMemoryStore = {
  inquiries: [] as any[],
  stats: { total_students: 1056, girls: 438, boys: 618, teachers: 49 },
  news: [] as any[],
  announcements: [] as any[],
};

export const db = {
  prepare: (sql: string) => {
    const realDb = getDb();
    if (realDb) {
      return realDb.prepare(sql);
    }
    // Fallback in-memory store for serverless environments (Vercel)
    return {
      get: (...args: any[]) => {
        if (sql.includes('users')) {
          return {
            id: 1,
            username: 'admin',
            // PBKDF2 hash for Maktab45@Admin2026
            password_hash: '0b22200e8b9f5e68b96bc815112f1698:3d8efaaf7ca7bc013bf418bd4bf3bd6183b092c1eed06487516c78ff605b7ca885d16a02bd3dfa209c24a0a52942076a57ecd38e3e72b0f5c4603d91700de128',
            role: 'admin'
          };
        }
        if (sql.includes('stats')) {
          return serverlessMemoryStore.stats;
        }
        return null;
      },
      all: (...args: any[]) => {
        if (sql.includes('contacts_inquiries')) {
          return serverlessMemoryStore.inquiries;
        }
        if (sql.includes('stats')) {
          return [serverlessMemoryStore.stats];
        }
        if (sql.includes('news')) {
          return serverlessMemoryStore.news;
        }
        if (sql.includes('announcements')) {
          return serverlessMemoryStore.announcements;
        }
        return [];
      },
      run: (...args: any[]) => {
        if (sql.includes('contacts_inquiries')) {
          const [full_name, phone, email, subject, message] = args;
          const newInquiry = {
            id: serverlessMemoryStore.inquiries.length + 1,
            full_name,
            phone,
            email,
            subject,
            message,
            created_at: new Date().toLocaleString('uz-UZ'),
          };
          serverlessMemoryStore.inquiries.unshift(newInquiry);
          return { lastInsertRowid: newInquiry.id };
        }
        if (sql.includes('stats')) {
          const [total_students, girls, boys, teachers] = args;
          serverlessMemoryStore.stats = { total_students, girls, boys, teachers };
          return { lastInsertRowid: 1 };
        }
        return { lastInsertRowid: 1 };
      }
    };
  }
};
