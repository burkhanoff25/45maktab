const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const crypto = require('node:crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'school45.db');
const db = new DatabaseSync(DB_PATH);

// Pragmas for performance and integrity
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
`);

function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(verifyHash, 'hex'), Buffer.from(originalHash, 'hex'));
}

// Database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_uz TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    body_uz TEXT NOT NULL,
    body_ru TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    date TEXT NOT NULL,
    images TEXT DEFAULT '[]', -- JSON array of file paths
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_uz TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    content_uz TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    event_date TEXT,
    is_urgent INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_uz TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    category TEXT DEFAULT 'normativ',
    file_path TEXT NOT NULL,
    file_size TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- new, answered, archived
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leaders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    position_uz TEXT NOT NULL,
    position_ru TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    reception_days_uz TEXT,
    reception_days_ru TEXT,
    image_path TEXT,
    order_num INTEGER DEFAULT 0
  );
`);

// Seed default admin if none exists
const checkAdmin = db.prepare('SELECT id FROM users WHERE username = ?');
const adminRow = checkAdmin.get('admin');

if (!adminRow) {
  const insertAdmin = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
  // Default master secure password (changeable from admin panel)
  const defaultHash = hashPassword('Maktab45@Admin2026');
  insertAdmin.run('admin', defaultHash, 'admin');
  console.log('✅ Default admin user created (admin / Maktab45@Admin2026)');
}

// Seed default leadership data if empty
const checkLeaders = db.prepare('SELECT count(*) as count FROM leaders').get();
if (checkLeaders.count === 0) {
  const insertLeader = db.prepare(`
    INSERT INTO leaders (full_name, position_uz, position_ru, phone, email, reception_days_uz, reception_days_ru, image_path, order_num)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLeader.run(
    'Ravshanbek Mamajonov Raxmonjonovich',
    'Maktab direktori',
    'Директор школы',
    '+998 94 509 71 71',
    'marifatlimaktab@umail.uz',
    'Dushanba - Juma: 09:00 - 12:00',
    'Понедельник - Пятница: 09:00 - 12:00',
    '/assets/director.jpg',
    1
  );

  insertLeader.run(
    'Pulatov Jaxongir Odilovich',
    'O‘quv ishlari bo‘yicha direktor o‘rinbosari (O‘IBDO‘)',
    'Заместитель директора по учебной работе (УИБДО)',
    '+998 94 509 71 71',
    'marifatlimaktab@umail.uz',
    'Seshanba, Payshanba: 14:00 - 17:00',
    'Вторник, Четверг: 14:00 - 17:00',
    '/assets/oibdo.jpg',
    2
  );

  insertLeader.run(
    'Nabijonov Diyorbek Umarovich',
    'Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari (MMIBDO‘)',
    'Заместитель директора по духовно-просветительской работе (ММИБДО)',
    '+998 94 509 71 71',
    'marifatlimaktab@umail.uz',
    'Chorshanba, Shanba: 10:00 - 13:00',
    'Среда, Суббота: 10:00 - 13:00',
    '/assets/mmibdo.jpg',
    3
  );
  console.log('✅ Initial leadership records seeded');
}

// Seed default news if empty
const checkNews = db.prepare('SELECT count(*) as count FROM news').get();
if (checkNews.count === 0) {
  const insertNews = db.prepare(`
    INSERT INTO news (title_uz, title_ru, body_uz, body_ru, category, date, images)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertNews.run(
    '45-maktabda yangi o‘quv yili muvaffaqiyatli davom etmoqda',
    'В школе №45 успешно продолжается новый учебный год',
    'Namangan viloyati Yangiqo‘rg‘on tumanidagi 45-sonli umumiy o‘rta ta’lim maktabida zamonaviy ta’lim standartlari asosida o‘quv jarayonlari qizg‘in davom etmoqda. Maktabda 1056 nafar o‘quvchi ta’lim olib, ularga 49 nafar malakali pedagog ustozlar saboq berishmoqda.',
    'В общеобразовательной школе №45 Янгикурганского района Наманганской области учебный процесс активно развивается на основе современных стандартов образования. В школе обучаются 1056 учащихся под руководством 49 квалифицированных педагогов.',
    'ta’lim',
    '18.11.2026',
    JSON.stringify(['/assets/school-front-1.jpg', '/assets/school-entry.jpg'])
  );

  insertNews.run(
    'Iqtidorli o‘quvchilar fan olimpiadalariga tayyorgarlik ko‘rmoqda',
    'Одаренные ученики готовятся к предметным олимпиадам',
    'Maktabimizda aniq va ijtimoiy-gumanitar fanlar yo‘nalishida to‘garaklar faoliyati namunali yo‘lga qo‘yilgan. O‘quvchilarimiz tuman va viloyat miqyosidagi olimpiadalarda munosib ishtirok etish uchun muntazam darsdan tashqari mashg‘ulotlarda qatnashmoqdalar.',
    'В нашей школе образцово налажена работа кружков по точным и социально-гуманитарным предметам. Ученики регулярно посещают внеурочные занятия для успешного участия в районных и областных олимпиадах.',
    'yutuqlar',
    '15.11.2026',
    JSON.stringify(['/assets/teachers-all.png', '/assets/school-yard.jpg'])
  );
  console.log('✅ Initial real news seeded');
}

// Seed sample announcements if empty
const checkAnnouncements = db.prepare('SELECT count(*) as count FROM announcements').get();
if (checkAnnouncements.count === 0) {
  const insertAnn = db.prepare(`
    INSERT INTO announcements (title_uz, title_ru, content_uz, content_ru, event_date, is_urgent)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAnn.run(
    'Ota-onalar umumiy majlisi o‘tkaziladi',
    'Состоится общее родительское собрание',
    'Joriy haftaning shanba kuni soat 10:00 da maktab faollar zalida ota-onalar bilan ochiq muloqot va chorak yakunlari muhokamasi bo‘lib o‘tadi.',
    'В субботу текущей недели в 10:00 в актовом зале школы состоится открытый диалог с родителями и обсуждение итогов четверти.',
    '2026-11-21',
    1
  );

  insertAnn.run(
    'Fan to‘garaklariga yangi qabul',
    'Новый набор в предметные и творческие кружки',
    'Matematika, rus tili, xorijiy tillar va robototexnika to‘garaklariga qo‘shimcha qabul boshlandi. Qatnashish istagida bo‘lgan o‘quvchilar sinf rahbarlariga murojaat qilishlari mumkin.',
    'Открыт дополнительный набор в кружки математики, русского языка, иностранных языков и робототехники. Желающие могут обратиться к классным руководителям.',
    '2026-11-25',
    0
  );
  console.log('✅ Initial announcements seeded');
}

module.exports = {
  db,
  hashPassword,
  verifyPassword
};
