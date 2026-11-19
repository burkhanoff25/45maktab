'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

const galleryItems = [
  { src: '/assets/school-front-1.jpg', titleUz: 'Maktab binosi old ko‘rinishi', titleRu: 'Здание школы' },
  { src: '/assets/school-yard.jpg', titleUz: 'Maktab hovlisi va sport maydoni', titleRu: 'Школьный двор' },
  { src: '/assets/school-angle.jpg', titleUz: 'Maktab o‘quv korpusi', titleRu: 'Учебный корпус' },
  { src: '/assets/teachers-all.png', titleUz: 'Pedagoglar jamoasi', titleRu: 'Педагогический коллектив' },
  { src: '/assets/teachers-women.png', titleUz: 'Ustoz ayollar jamoasi', titleRu: 'Учителя школы' },
  { src: '/assets/school-uniform.png', titleUz: 'Maktab formasi', titleRu: 'Школьная форма' },
  { src: '/assets/leadership-group.png', titleUz: 'Rahbariyat jamoasi', titleRu: 'Руководство' },
  { src: '/assets/school-entry.jpg', titleUz: 'Maktab asosiy kirish darvozasi', titleRu: 'Главный вход' },
];

export const Gallery: React.FC<{
  lang: Lang;
  onOpenLightbox: (src: string, title: string) => void;
}> = ({ lang, onOpenLightbox }) => {
  const t = translations[lang];

  return (
    <section className="section-gallery" id="gallery">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">{t.galleryTag}</span>
          <h2 className="section-title">{t.galleryTitle}</h2>
          <p className="section-subtitle">{t.gallerySubtitle}</p>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="gallery-item zoomable"
              onClick={() => onOpenLightbox(item.src, lang === 'uz' ? item.titleUz : item.titleRu)}
            >
              <img src={item.src} alt={lang === 'uz' ? item.titleUz : item.titleRu} />
              <div className="gallery-caption">
                <span>{lang === 'uz' ? item.titleUz : item.titleRu}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
