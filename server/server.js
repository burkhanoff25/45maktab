const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');
const crypto = require('node:crypto');
const { db, hashPassword, verifyPassword } = require('./database');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Session store for authenticated admin tokens
const activeSessions = new Map(); // token -> { userId, username, expiresAt }

function createToken(userId, username) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { userId, username, expiresAt });
  return token;
}

function verifyToken(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { success: false, error: message });
}

// Helper to parse multipart/form-data with zero external dependencies
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) {
      return reject(new Error('Invalid multipart content-type boundary'));
    }
    const boundary = boundaryMatch[1] || boundaryMatch[2];
    const boundaryBuffer = Buffer.from('--' + boundary);

    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const fields = {};
      const files = [];

      let start = 0;
      while ((start = buffer.indexOf(boundaryBuffer, start)) !== -1) {
        start += boundaryBuffer.length;
        if (buffer.slice(start, start + 2).toString() === '--') break; // closing boundary
        if (buffer.slice(start, start + 2).toString() === '\r\n') start += 2;

        const nextBoundary = buffer.indexOf(boundaryBuffer, start);
        if (nextBoundary === -1) break;

        // Extract part
        const part = buffer.slice(start, nextBoundary - 2); // strip trailing \r\n
        const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
        if (headerEnd === -1) continue;

        const headerStr = part.slice(0, headerEnd).toString('utf8');
        const body = part.slice(headerEnd + 4);

        const nameMatch = headerStr.match(/name="([^"]+)"/);
        const filenameMatch = headerStr.match(/filename="([^"]+)"/);

        if (nameMatch) {
          const fieldName = nameMatch[1];
          if (filenameMatch && filenameMatch[1]) {
            const originalName = path.basename(filenameMatch[1]);
            const ext = path.extname(originalName).toLowerCase();
            const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
            const targetPath = path.join(UPLOADS_DIR, safeName);
            fs.writeFileSync(targetPath, body);
            files.push({
              fieldName,
              originalName,
              fileName: safeName,
              url: `/uploads/${safeName}`,
              size: body.length
            });
          } else {
            fields[fieldName] = body.toString('utf8');
          }
        }
      }
      resolve({ fields, files });
    });
    req.on('error', reject);
  });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Request Handler
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Authorization helper
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const adminUser = verifyToken(token);

  // ===================== API ROUTES =====================

  // 1. AUTHENTICATION
  if (pathname === '/api/login' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { username, password } = body;
      if (!username || !password) {
        return sendError(res, 400, 'Login va parol kiritilishi shart');
      }

      const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
      const user = stmt.get(username);
      if (!user || !verifyPassword(password, user.password_hash)) {
        return sendError(res, 401, 'Login yoki parol noto‘g‘ri');
      }

      const token = createToken(user.id, user.username);
      return sendJson(res, 200, {
        success: true,
        token,
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (e) {
      return sendError(res, 400, e.message);
    }
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    if (!adminUser) return sendError(res, 401, 'Autentifikatsiyadan o‘tilmagan');
    return sendJson(res, 200, { success: true, user: adminUser });
  }

  // 2. NEWS
  if (pathname === '/api/news' && method === 'GET') {
    const list = db.prepare('SELECT * FROM news ORDER BY id DESC').all();
    const formatted = list.map(item => ({
      ...item,
      images: JSON.parse(item.images || '[]')
    }));
    return sendJson(res, 200, { success: true, data: formatted });
  }

  if (pathname.match(/^\/api\/news\/(\d+)$/) && method === 'GET') {
    const id = pathname.match(/^\/api\/news\/(\d+)$/)[1];
    const item = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    if (!item) return sendError(res, 404, 'Yangilik topilmadi');
    // Increment view
    db.prepare('UPDATE news SET views = views + 1 WHERE id = ?').run(id);
    item.images = JSON.parse(item.images || '[]');
    return sendJson(res, 200, { success: true, data: item });
  }

  if (pathname === '/api/news' && method === 'POST') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    try {
      let fields, files = [];
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('multipart/form-data')) {
        const parsed = await parseMultipart(req);
        fields = parsed.fields;
        files = parsed.files;
      } else {
        fields = await parseJsonBody(req);
      }

      const { title_uz, title_ru, body_uz, body_ru, category, date } = fields;
      if (!title_uz || !title_ru || !body_uz || !body_ru) {
        return sendError(res, 400, 'Barcha tillardagi sarlavha va matn talab qilinadi');
      }

      let images = [];
      if (fields.existing_images) {
        try {
          images = JSON.parse(fields.existing_images);
        } catch (e) {}
      }
      if (files && files.length > 0) {
        files.forEach(f => images.push(f.url));
      }

      const currentDate = date || new Date().toLocaleDateString('uz-UZ');
      const stmt = db.prepare(`
        INSERT INTO news (title_uz, title_ru, body_uz, body_ru, category, date, images)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title_uz, title_ru, body_uz, body_ru, category || 'general', currentDate, JSON.stringify(images));

      return sendJson(res, 201, {
        success: true,
        id: Number(info.lastInsertRowid),
        message: 'Yangilik muvaffaqiyatli qo‘shildi'
      });
    } catch (e) {
      return sendError(res, 500, e.message);
    }
  }

  if (pathname.match(/^\/api\/news\/(\d+)$/) && method === 'PUT') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    const id = pathname.match(/^\/api\/news\/(\d+)$/)[1];
    try {
      let fields, files = [];
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('multipart/form-data')) {
        const parsed = await parseMultipart(req);
        fields = parsed.fields;
        files = parsed.files;
      } else {
        fields = await parseJsonBody(req);
      }

      const current = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
      if (!current) return sendError(res, 404, 'Yangilik topilmadi');

      let images = JSON.parse(current.images || '[]');
      if (fields.images) {
        try { images = JSON.parse(fields.images); } catch(e) {}
      }
      if (files && files.length > 0) {
        files.forEach(f => images.push(f.url));
      }

      const stmt = db.prepare(`
        UPDATE news 
        SET title_uz = ?, title_ru = ?, body_uz = ?, body_ru = ?, category = ?, images = ?
        WHERE id = ?
      `);
      stmt.run(
        fields.title_uz || current.title_uz,
        fields.title_ru || current.title_ru,
        fields.body_uz || current.body_uz,
        fields.body_ru || current.body_ru,
        fields.category || current.category,
        JSON.stringify(images),
        id
      );

      return sendJson(res, 200, { success: true, message: 'Yangilik tahrirlandi' });
    } catch (e) {
      return sendError(res, 500, e.message);
    }
  }

  if (pathname.match(/^\/api\/news\/(\d+)$/) && method === 'DELETE') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    const id = pathname.match(/^\/api\/news\/(\d+)$/)[1];
    db.prepare('DELETE FROM news WHERE id = ?').run(id);
    return sendJson(res, 200, { success: true, message: 'Yangilik o‘chirildi' });
  }

  // 3. ANNOUNCEMENTS (E'LONLAR)
  if (pathname === '/api/announcements' && method === 'GET') {
    const list = db.prepare('SELECT * FROM announcements ORDER BY id DESC').all();
    return sendJson(res, 200, { success: true, data: list });
  }

  if (pathname === '/api/announcements' && method === 'POST') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    try {
      const body = await parseJsonBody(req);
      const { title_uz, title_ru, content_uz, content_ru, event_date, is_urgent } = body;
      if (!title_uz || !content_uz) return sendError(res, 400, 'Ma’lumot to‘liq emas');

      const stmt = db.prepare(`
        INSERT INTO announcements (title_uz, title_ru, content_uz, content_ru, event_date, is_urgent)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(title_uz, title_ru || title_uz, content_uz, content_ru || content_uz, event_date || '', is_urgent ? 1 : 0);
      return sendJson(res, 201, { success: true, id: Number(info.lastInsertRowid) });
    } catch (e) {
      return sendError(res, 500, e.message);
    }
  }

  if (pathname.match(/^\/api\/announcements\/(\d+)$/) && method === 'DELETE') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    const id = pathname.match(/^\/api\/announcements\/(\d+)$/)[1];
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    return sendJson(res, 200, { success: true });
  }

  // 4. LEADERS (RAHBARIYAT)
  if (pathname === '/api/leaders' && method === 'GET') {
    const list = db.prepare('SELECT * FROM leaders ORDER BY order_num ASC, id ASC').all();
    return sendJson(res, 200, { success: true, data: list });
  }

  // 5. INQUIRIES / CONTACT (MUROJAATLAR)
  if (pathname === '/api/contact' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { full_name, phone, email, subject, message } = body;
      if (!full_name || !phone || !message) {
        return sendError(res, 400, 'Ism, telefon va xabar matni to‘ldirilishi shart');
      }

      const stmt = db.prepare(`
        INSERT INTO contacts_inquiries (full_name, phone, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(full_name, phone, email || '', subject || 'Sayt orqali murojaat', message);
      return sendJson(res, 201, {
        success: true,
        message: 'Murojaatingiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.'
      });
    } catch (e) {
      return sendError(res, 500, e.message);
    }
  }

  if (pathname === '/api/inquiries' && method === 'GET') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    const list = db.prepare('SELECT * FROM contacts_inquiries ORDER BY id DESC').all();
    return sendJson(res, 200, { success: true, data: list });
  }

  // 6. GENERAL FILE UPLOAD (FOR GALLERY OR ADMIN)
  if (pathname === '/api/upload' && method === 'POST') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    try {
      const parsed = await parseMultipart(req);
      return sendJson(res, 200, { success: true, files: parsed.files });
    } catch (e) {
      return sendError(res, 500, e.message);
    }
  }

  // 7. CHANGE ADMIN PASSWORD
  if (pathname === '/api/admin/change-password' && method === 'POST') {
    if (!adminUser) return sendError(res, 401, 'Admin ruxsati zarur');
    try {
      const body = await parseJsonBody(req);
      const { oldPassword, newPassword } = body;
      if (!oldPassword || !newPassword || newPassword.length < 6) {
        return sendError(res, 400, 'Yangi parol kamida 6 belgidan iborat bo‘lishi kerak');
      }

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(adminUser.userId);
      if (!verifyPassword(oldPassword, user.password_hash)) {
        return sendError(res, 400, 'Amaldagi eski parol noto‘g‘ri');
      }

      const newHash = hashPassword(newPassword);
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, adminUser.userId);
      return sendJson(res, 200, { success: true, message: 'Parol muvaffaqiyatli yangilandi' });
    } catch (e) {
      return sendError(res, 500, e.message);
    }
  }

  // ===================== STATIC FILE SERVING =====================
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') safePath = '/index.html';
  if (safePath === '/admin' || safePath === '/admin/') safePath = '/admin.html';

  let filePath = path.join(PUBLIC_DIR, safePath);

  // Check if file exists in public directory
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA or 404
      if (safePath.startsWith('/api/')) {
        return sendError(res, 404, 'API endpoint topilmadi');
      }
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache control
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    }

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`=================================================`);
  console.log(`🏫 45-maktab rasmiy serveri muvaffaqiyatli ishga tushdi!`);
  console.log(`🌐 Manzil: http://127.0.0.1:${PORT}`);
  console.log(`🔐 Admin panel: http://127.0.0.1:${PORT}/admin`);
  console.log(`=================================================`);
});
