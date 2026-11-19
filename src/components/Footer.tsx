'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

export const Footer: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="main-footer">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src="/assets/logo.png" alt="45-maktab" />
            <div>
              <h4>{t.brandTitle}</h4>
              <p>{t.region}</p>
            </div>
          </div>
          <p className="footer-desc">{t.footerDesc}</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t.footerSections}</h4>
          <ul className="footer-links">
            <li><a href="#about">{t.navAbout}</a></li>
            <li><a href="#leaders">{t.navLeaders}</a></li>
            <li><a href="#news">{t.navNews}</a></li>
            <li><a href="#gallery">{t.navGallery}</a></li>
            <li><a href="#documents">{t.navDocuments}</a></li>
            <li><a href="#contact">{t.navContact}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">{t.navContact}</h4>
          <ul className="footer-contacts">
            <li>📍 Yangiqo‘rg‘on t., Chortoq ko‘chasi, 36</li>
            <li>📞 +998 94 509 71 71</li>
            <li>✉️ marifatlimaktab@umail.uz</li>
            <li>
              ✈️{' '}
              <a href="https://t.me/+KQm8vZ8efHo1NWEy" target="_blank" rel="noopener noreferrer">
                Telegram kanali
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            © 2026 {t.brandTitle}. <span>{t.footerRights}</span>
          </p>
          <p>
            <a href="/admin" className="footer-admin-link">
              {t.adminLink}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
