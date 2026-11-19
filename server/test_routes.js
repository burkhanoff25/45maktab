const { db, hashPassword, verifyPassword } = require('./database');
const assert = require('node:assert');

console.log('--- RUNNING BACKEND TESTS ---');

// 1. Password verification
const pwd = 'TestPassword123!';
const hashed = hashPassword(pwd);
assert(verifyPassword(pwd, hashed), 'Password hash check failed');
console.log('✔ Password hashing & verification passed');

// 2. Insert and read news
const stmt = db.prepare(`
  INSERT INTO news (title_uz, title_ru, body_uz, body_ru, category, date, images)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const info = stmt.run('Test Title UZ', 'Test Title RU', 'Body UZ', 'Body RU', 'Sport', '18.11.2026', '[]');
assert(info.lastInsertRowid, 'News insert failed');

const fetched = db.prepare('SELECT * FROM news WHERE id = ?').get(info.lastInsertRowid);
assert.strictEqual(fetched.title_uz, 'Test Title UZ');
console.log('✔ News insertion and retrieval passed');

// Clean test item
db.prepare('DELETE FROM news WHERE id = ?').run(info.lastInsertRowid);
console.log('✔ News deletion passed');

// 3. Contact inquiry
const inqStmt = db.prepare(`
  INSERT INTO contacts_inquiries (full_name, phone, email, subject, message)
  VALUES (?, ?, ?, ?, ?)
`);
const inqInfo = inqStmt.run('Aliyev Vali', '+998901234567', 'vali@example.com', 'Savol', 'Salom');
assert(inqInfo.lastInsertRowid, 'Inquiry insert failed');
const inq = db.prepare('SELECT * FROM contacts_inquiries WHERE id = ?').get(inqInfo.lastInsertRowid);
assert.strictEqual(inq.full_name, 'Aliyev Vali');
console.log('✔ Contact inquiry submission and retrieval passed');

// Clean test item
db.prepare('DELETE FROM contacts_inquiries WHERE id = ?').run(inqInfo.lastInsertRowid);

console.log('🎉 ALL BACKEND LOGIC TESTS PASSED SUCCESSFULLY!');
