import https from 'node:https';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9217947885:AAGWbMcZlyDEwP7DJ8UGqstO_XDM5eOWYqc';
const TELEGRAM_ADMINS = (process.env.TELEGRAM_ADMINS
  ? process.env.TELEGRAM_ADMINS.split(',')
  : ['76813895', '1426434654', '7918236863']
).map(s => s.trim()).filter(Boolean);

export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function notifyTelegramAdmins(messageText: string): void {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMINS.length) return;

  TELEGRAM_ADMINS.forEach(chatId => {
    const postData = JSON.stringify({
      chat_id: chatId,
      text: messageText,
      parse_mode: 'HTML'
    });

    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.warn(`[Telegram] Send failed for admin ${chatId}:`, data);
        }
      });
    });

    req.on('error', err => {
      console.warn(`[Telegram Error for ${chatId}]:`, err.message);
    });

    req.write(postData);
    req.end();
  });
}
