/**
 * 45-MAKTAB FRONTEND CONTROLLER (app.js)
 */

let currentLang = 'uz';
let newsCache = [];
let announcementsCache = [];
let leadersCache = [];
let lightboxItems = [];
let lightboxIndex = 0;

// Language Dictionaries
const i18n = {
  uz: {
    region: "Namangan viloyati, Yangiqo‘rg‘on tumani",
    heroTitle: "45-maktab — yuksak bilim va mustahkam tarbiya maskani",
    heroDesc: "Har bir o‘quvchining qobiliyati va orzularini yuzaga chiqaruvchi mustahkam ta’lim muhiti. Kelajak yetakchilarini birgalikda tarbiyalaymiz.",
    aboutText: `
      <p>Namangan viloyati Yangiqo‘rg‘on tumanidagi 45-sonli umumiy o‘rta ta’lim maktabi <strong>2019-yil 5-sentabrda</strong> o‘z faoliyatini boshlagan. Maktabda ta’lim sifatini yuksaltirish, yosh avlodni vatanparvarlik va yuksak axloqiy qadriyatlar ruhida tarbiyalash ustuvor maqsad etib belgilangan.</p>
      <p>Ta’lim jarayonlari to‘liq <strong>rus tilida</strong> olib boriladi. Maktabda jami 1 056 nafar o‘quvchi ta’lim olib, ularga zamonaviy metodikalar asosida 49 nafar oliy toifali va tajribali pedagog xodimlar saboq bermoqda.</p>
    `,
    readMore: "Batafsil o‘qish →",
    urgentTag: "Shoshilinch",
    annEmpty: "Hozircha yangi e’lonlar yo‘q.",
    newsEmpty: "Yangiliklar tez orada e’lon qilinadi.",
    inquirySuccess: "Murojaatingiz muvaffaqiyatli qabul qilindi! Tez orada bog‘lanamiz.",
    inquiryFailed: "Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring."
  },
  ru: {
    region: "Наманганская область, Янгикурганский район",
    heroTitle: "Школа №45 — пространство глубоких знаний и воспитания",
    heroDesc: "Образовательная среда, раскрывающая способности каждого ученика. Воспитываем будущих лидеров вместе.",
    aboutText: `
      <p>Общеобразовательная школа №45 Янгикурганского района Наманганской области начала свою работу <strong>5 сентября 2019 года</strong>. Главной целью школы является повышение качества образования и воспитание молодого поколения в духе патриотизма и нравственности.</p>
      <p>Учебный процесс ведётся полностью <strong>на русском языке</strong>. В школе обучаются 1 056 учеников, которых обучают 49 высококвалифицированных педагогов по современным образовательным методикам.</p>
    `,
    readMore: "Читать далее →",
    urgentTag: "Срочно",
    annEmpty: "В настоящее время новых объявлений нет.",
    newsEmpty: "Новости будут опубликованы в ближайшее время.",
    inquirySuccess: "Ваше обращение успешно принято! Скоро свяжемся с вами.",
    inquiryFailed: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Close nav when clicking a link
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });

  // Fetch initial data
  loadLeaders();
  loadAnnouncements();
  loadNews();
  initLightbox();

  // Keyboard controls for modals
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightboxModal');
    if (lb && lb.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    }
    const nm = document.getElementById('newsModal');
    if (nm && nm.classList.contains('open') && e.key === 'Escape') {
      closeNewsModal();
    }
  });
});

// Toggle Language
function toggleLanguage() {
  currentLang = currentLang === 'uz' ? 'ru' : 'uz';
  document.documentElement.lang = currentLang;

  // Update static elements with data-uz / data-ru
  document.querySelectorAll('[data-uz]').forEach(el => {
    const val = el.getAttribute(`data-${currentLang}`);
    if (val) el.textContent = val;
  });

  // Dynamic texts
  document.getElementById('currentLangText').textContent = currentLang === 'uz' ? 'UZ | RU' : 'RU | UZ';
  document.getElementById('topRegion').textContent = i18n[currentLang].region;
  document.getElementById('heroTitle').textContent = i18n[currentLang].heroTitle;
  document.getElementById('heroDesc').textContent = i18n[currentLang].heroDesc;
  document.getElementById('aboutTextContent').innerHTML = i18n[currentLang].aboutText;

  // Re-render dynamic components
  renderNews();
  renderAnnouncements();
  renderLeaders();
}

// 1. LEADERS
async function loadLeaders() {
  try {
    const res = await fetch('/api/leaders');
    const json = await res.json();
    if (json.success && json.data) {
      leadersCache = json.data;
      renderLeaders();
    }
  } catch (err) {
    console.error('Error loading leaders:', err);
  }
}

function renderLeaders() {
  const container = document.getElementById('leadersList');
  if (!container || !leadersCache.length) return;

  container.innerHTML = leadersCache.map(l => `
    <div class="leader-card">
      <img src="${escapeAttr(l.image_path || '/assets/director.jpg')}" alt="${escapeAttr(l.full_name)}" class="leader-avatar zoomable" data-title="${escapeAttr(l.full_name)}">
      <h3>${escapeHtml(l.full_name)}</h3>
      <span class="leader-position">${escapeHtml(currentLang === 'uz' ? l.position_uz : l.position_ru)}</span>
      <div class="leader-meta">
        <span>📞 ${escapeHtml(l.phone || '+998 94 509 71 71')}</span>
        <span>✉️ ${escapeHtml(l.email || 'marifatlimaktab@umail.uz')}</span>
        <span>🕒 ${escapeHtml(currentLang === 'uz' ? l.reception_days_uz : l.reception_days_ru)}</span>
      </div>
    </div>
  `).join('');

  // Re-attach zoomable events for new images
  initLightbox();
}

// 2. ANNOUNCEMENTS
async function loadAnnouncements() {
  try {
    const res = await fetch('/api/announcements');
    const json = await res.json();
    if (json.success && json.data) {
      announcementsCache = json.data;
      renderAnnouncements();
    }
  } catch (err) {
    console.error('Error loading announcements:', err);
  }
}

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  if (!container) return;

  if (!announcementsCache.length) {
    container.innerHTML = `<div class="announcement-item"><p>${i18n[currentLang].annEmpty}</p></div>`;
    return;
  }

  container.innerHTML = announcementsCache.map(a => `
    <div class="announcement-item ${a.is_urgent ? 'urgent' : ''}">
      <div class="ann-content">
        ${a.is_urgent ? `<span class="ann-badge">⚠️ ${i18n[currentLang].urgentTag}</span>` : ''}
        <h4>${escapeHtml(currentLang === 'uz' ? a.title_uz : a.title_ru)}</h4>
        <p>${escapeHtml(currentLang === 'uz' ? a.content_uz : a.content_ru)}</p>
      </div>
      ${a.event_date ? `<div class="ann-date">📅 ${escapeHtml(a.event_date)}</div>` : ''}
    </div>
  `).join('');
}

// 3. NEWS
async function loadNews() {
  try {
    const res = await fetch('/api/news');
    const json = await res.json();
    if (json.success && json.data) {
      newsCache = json.data;
      renderNews();
    }
  } catch (err) {
    console.error('Error loading news:', err);
  }
}

function renderNews() {
  const container = document.getElementById('newsGrid');
  if (!container) return;

  if (!newsCache.length) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">${i18n[currentLang].newsEmpty}</p>`;
    return;
  }

  container.innerHTML = newsCache.map((n, idx) => {
    const title = currentLang === 'uz' ? n.title_uz : n.title_ru;
    const body = currentLang === 'uz' ? n.body_uz : n.body_ru;
    const cover = (n.images && n.images.length > 0) ? n.images[0] : '/assets/school-front-1.jpg';

    return `
      <article class="news-card">
        <div class="news-cover">
          <img src="${escapeAttr(cover)}" alt="${escapeAttr(title)}" loading="lazy">
          <span class="news-badge-cat">${escapeHtml(n.category || 'Maktab')}</span>
        </div>
        <div class="news-body">
          <div class="news-meta">
            <span>📅 ${escapeHtml(n.date)}</span>
            <span>👁️ ${n.views || 0}</span>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p class="news-excerpt">${escapeHtml(body)}</p>
          <div class="news-footer">
            <button class="btn-read-more" onclick="openNewsDetail(${n.id})">
              ${i18n[currentLang].readMore}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openNewsDetail(id) {
  const item = newsCache.find(n => n.id === id);
  if (!item) return;

  const modal = document.getElementById('newsModal');
  const body = document.getElementById('newsModalBody');
  const title = currentLang === 'uz' ? item.title_uz : item.title_ru;
  const content = currentLang === 'uz' ? item.body_uz : item.body_ru;

  const imagesHtml = (item.images && item.images.length > 0)
    ? `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 20px 0;">
        ${item.images.map(img => `<img src="${escapeAttr(img)}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; cursor:pointer;" onclick="openSingleLightbox('${escapeAttr(img)}', '${escapeAttr(title)}')">`).join('')}
       </div>`
    : '';

  body.innerHTML = `
    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">📅 ${escapeHtml(item.date)} · ${escapeHtml(item.category || 'Umumiy')}</div>
    <h2 style="font-size: 1.6rem; color: var(--primary-dark); margin-bottom: 18px; line-height: 1.3;">${escapeHtml(title)}</h2>
    ${imagesHtml}
    <div style="font-size: 1.05rem; line-height: 1.7; color: var(--text-main); white-space: pre-line;">${escapeHtml(content)}</div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
  const modal = document.getElementById('newsModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// 4. CONTACT / INQUIRY FORM SUBMISSION
async function submitInquiry(event) {
  event.preventDefault();
  const btn = document.getElementById('btnSubmitInquiry');
  const msgBox = document.getElementById('formStatusMsg');
  
  const full_name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  btn.disabled = true;
  msgBox.className = 'form-status';
  msgBox.textContent = currentLang === 'uz' ? 'Yuborilmoqda...' : 'Отправка...';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, phone, email, subject, message })
    });
    const data = await res.json();

    if (data.success) {
      msgBox.className = 'form-status success';
      msgBox.textContent = i18n[currentLang].inquirySuccess;
      document.getElementById('contactForm').reset();
    } else {
      msgBox.className = 'form-status error';
      msgBox.textContent = data.error || i18n[currentLang].inquiryFailed;
    }
  } catch (err) {
    msgBox.className = 'form-status error';
    msgBox.textContent = i18n[currentLang].inquiryFailed;
  } finally {
    btn.disabled = false;
  }
}

// 5. LIGHTBOX SYSTEM
function initLightbox() {
  const elements = document.querySelectorAll('.zoomable');
  lightboxItems = Array.from(elements).map(el => {
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    return {
      src: img ? (img.getAttribute('src') || '') : '',
      title: el.getAttribute('data-title') || (img ? img.getAttribute('alt') : '') || '45-maktab rasmi'
    };
  }).filter(item => item.src);

  elements.forEach((el, idx) => {
    el.style.cursor = 'zoom-in';
    el.onclick = () => openLightbox(idx);
  });
}

function openLightbox(index) {
  if (!lightboxItems.length) return;
  lightboxIndex = index;
  showLightboxItem();
  const modal = document.getElementById('lightboxModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openSingleLightbox(src, title) {
  lightboxItems = [{ src, title }];
  lightboxIndex = 0;
  showLightboxItem();
  const modal = document.getElementById('lightboxModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxItem() {
  const item = lightboxItems[lightboxIndex];
  if (!item) return;

  const img = document.getElementById('lightboxImage');
  const cap = document.getElementById('lightboxCaption');
  const counter = document.getElementById('lightboxCounter');

  img.src = item.src;
  cap.textContent = item.title;
  counter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
}

function stepLightbox(step) {
  if (!lightboxItems.length) return;
  lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
  showLightboxItem();
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Safety Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}
