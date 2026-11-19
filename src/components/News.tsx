'use client';

import React, { useState } from 'react';
import { Lang, translations } from '@/lib/i18n';

export interface NewsItem {
  id: number;
  title_uz: string;
  title_ru: string;
  body_uz: string;
  body_ru: string;
  category: string;
  date: string;
  images: string[];
  views: number;
}

const initialNews: NewsItem[] = [
  {
    id: 1,
    title_uz: '45-maktabda yangi o‘quv yili muvaffaqiyatli davom etmoqda',
    title_ru: 'В школе №45 успешно продолжается новый учебный год',
    body_uz:
      'Namangan viloyati Yangiqo‘rg‘on tumanidagi 45-sonli umumiy o‘rta ta’lim maktabida zamonaviy ta’lim standartlari asosida o‘quv jarayonlari qizg‘in davom etmoqda. Maktabda 1056 nafar o‘quvchi ta’lim olib, ularga 49 nafar malakali pedagog ustozlar saboq berishmoqda.',
    body_ru:
      'В общеобразовательной школе №45 Янгикурганского района Наманганской области учебный процесс активно развивается на основе современных стандартов образования. В школе обучаются 1056 учащихся под руководством 49 квалифицированных педагогов.',
    category: 'Ta’lim',
    date: '18.11.2026',
    images: ['/assets/school-front-1.jpg', '/assets/school-entry.jpg'],
    views: 12,
  },
  {
    id: 2,
    title_uz: 'Iqtidorli o‘quvchilar fan olimpiadalariga tayyorgarlik ko‘rmoqda',
    title_ru: 'Одаренные ученики готовятся к предметным олимпиадам',
    body_uz:
      'Maktabimizda aniq va ijtimoiy-gumanitar fanlar yo‘nalishida to‘garaklar faoliyati namunali yo‘lga qo‘yilgan. O‘quvchilarimiz tuman va viloyat miqyosidagi olimpiadalarda munosib ishtirok etish uchun muntazam darsdan tashqari mashg‘ulotlarda qatnashmoqdalar.',
    body_ru:
      'В нашей школе образцово налажена работа кружков по точным и социально-гуманитарным предметам. Ученики регулярно посещают внеурочные занятия для успешного участия в районных и областных олимпиадах.',
    category: 'Yutuqlar',
    date: '15.11.2026',
    images: ['/assets/teachers-all.png', '/assets/school-yard.jpg'],
    views: 8,
  },
];

export const News: React.FC<{
  lang: Lang;
  onOpenLightbox: (src: string, title: string) => void;
}> = ({ lang, onOpenLightbox }) => {
  const t = translations[lang];
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <>
      <section className="section-news" id="news">
        <div className="container">
          <div className="section-header between">
            <div>
              <span className="section-tag">{t.newsTag}</span>
              <h2 className="section-title">{t.newsTitle}</h2>
            </div>
          </div>

          <div className="news-grid">
            {initialNews.map((n) => {
              const title = lang === 'uz' ? n.title_uz : n.title_ru;
              const body = lang === 'uz' ? n.body_uz : n.body_ru;
              const cover = n.images && n.images.length > 0 ? n.images[0] : '/assets/school-front-1.jpg';

              return (
                <article key={n.id} className="news-card">
                  <div className="news-cover">
                    <img src={cover} alt={title} loading="lazy" />
                    <span className="news-badge-cat">{n.category}</span>
                  </div>
                  <div className="news-body">
                    <div className="news-meta">
                      <span>📅 {n.date}</span>
                      <span>👁️ {n.views}</span>
                    </div>
                    <h3>{title}</h3>
                    <p className="news-excerpt">{body}</p>
                    <div className="news-footer">
                      <button className="btn-read-more" onClick={() => setSelectedNews(n)}>
                        {t.btnReadMore}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Modal */}
      {selectedNews && (
        <div className="news-modal open">
          <div className="news-modal-content">
            <button className="news-modal-close" onClick={() => setSelectedNews(null)}>
              ✕
            </button>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 10 }}>
              📅 {selectedNews.date} · {selectedNews.category}
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: 18, lineHeight: 1.3 }}>
              {lang === 'uz' ? selectedNews.title_uz : selectedNews.title_ru}
            </h2>
            {selectedNews.images && selectedNews.images.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  margin: '20px 0',
                }}
              >
                {selectedNews.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => onOpenLightbox(img, lang === 'uz' ? selectedNews.title_uz : selectedNews.title_ru)}
                  />
                ))}
              </div>
            )}
            <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
              {lang === 'uz' ? selectedNews.body_uz : selectedNews.body_ru}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
