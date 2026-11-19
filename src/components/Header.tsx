'use client';

import React, { useState } from 'react';
import { Lang, translations } from '@/lib/i18n';

interface HeaderProps {
  lang: Lang;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onToggleLang }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-meta">
            <span className="badge-flag">🇺🇿</span>
            <span>{t.region}</span>
          </div>
          <div className="top-contacts">
            <a href="tel:+998945097171" className="top-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +998 94 509 71 71
            </a>
            <a href="mailto:marifatlimaktab@umail.uz" className="top-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              marifatlimaktab@umail.uz
            </a>
            <a href="https://t.me/+KQm8vZ8efHo1NWEy" target="_blank" rel="noopener noreferrer" className="top-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header" id="header">
        <div className="container header-container">
          <a href="#home" className="brand-group">
            <img src="/assets/logo.png" alt="45-maktab ramzi" className="school-logo" />
            <div className="brand-text">
              <span className="brand-title">{t.brandTitle}</span>
              <span className="brand-sub">{t.brandSub}</span>
            </div>
          </a>

          <button
            className="menu-toggle"
            aria-label="Menyu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#home" className="nav-item active" onClick={() => setMobileMenuOpen(false)}>{t.navHome}</a>
            <a href="#about" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navAbout}</a>
            <a href="#leaders" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navLeaders}</a>
            <a href="#announcements" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navAnnouncements}</a>
            <a href="#news" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navNews}</a>
            <a href="#gallery" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navGallery}</a>
            <a href="#documents" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navDocuments}</a>
            <a href="#contact" className="nav-item" onClick={() => setMobileMenuOpen(false)}>{t.navContact}</a>

            <div className="nav-actions">
              <button className="lang-switcher" onClick={onToggleLang}>
                <span className="lang-flag">🌐</span>
                <span>{lang === 'uz' ? 'UZ | RU' : 'RU | UZ'}</span>
              </button>
              <a href="/admin" className="btn-admin-nav" title="Admin panelga kirish">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>{t.navAdmin}</span>
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
