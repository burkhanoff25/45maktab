'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

export const Hero: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section className="hero-section" id="home">
      <div className="hero-slider">
        <div
          className="hero-slide active"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10, 40, 48, 0.75), rgba(10, 40, 48, 0.85)), url('/assets/school-front-1.jpg')",
          }}
        >
          <div className="container hero-content">
            <div className="hero-badge">{t.heroBadge}</div>
            <h1 className="hero-title">{t.heroTitle}</h1>
            <p className="hero-description">{t.heroDesc}</p>
            <div className="hero-buttons">
              <a href="#about" className="btn btn-primary">
                <span>{t.heroBtnExplore}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#contact" className="btn btn-outline">
                <span>{t.heroBtnContact}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
