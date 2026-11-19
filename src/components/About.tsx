'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

export const About: React.FC<{ lang: Lang; onOpenLightbox: (src: string, title: string) => void }> = ({
  lang,
  onOpenLightbox,
}) => {
  const t = translations[lang];

  return (
    <section className="section-about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="section-tag">{t.aboutTag}</span>
            <h2 className="section-title">{t.aboutTitle}</h2>
            <div className="rich-text">
              <p>{t.aboutParagraph1}</p>
              <p>{t.aboutParagraph2}</p>
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>{t.aboutHl1Title}</strong>
                  <p>{t.aboutHl1Desc}</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="check-icon">✓</span>
                <div>
                  <strong>{t.aboutHl2Title}</strong>
                  <p>{t.aboutHl2Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-gallery">
            <div
              className="about-image-card main-img"
              style={{ cursor: 'zoom-in' }}
              onClick={() => onOpenLightbox('/assets/school-front-2.jpg', 'Maktab binosi')}
            >
              <img src="/assets/school-front-2.jpg" alt="Maktab binosi" />
            </div>
            <div className="about-sub-images">
              <div
                className="about-image-card"
                style={{ cursor: 'zoom-in' }}
                onClick={() => onOpenLightbox('/assets/school-entry.jpg', 'Maktab kirish darvozasi')}
              >
                <img src="/assets/school-entry.jpg" alt="Maktab kirish darvozasi" />
              </div>
              <div
                className="about-image-card"
                style={{ cursor: 'zoom-in' }}
                onClick={() => onOpenLightbox('/assets/school-yard.jpg', 'Maktab hovlisi')}
              >
                <img src="/assets/school-yard.jpg" alt="Maktab hovlisi" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
